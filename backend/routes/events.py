import os
from fastapi import APIRouter, Request, HTTPException, status, Header
from services.idempotency_service import is_duplicate
from services.user_service import (
    create_user_from_auth0,
    handle_organization_deleted,
    update_user_from_auth0,
    delete_user_from_auth0,
    initialize_organization_workspace, 
    handle_role_assignment, 
    sync_user_roles_from_auth0,
    handle_organization_user_link
)
from auth.config import get_settings
settings = get_settings()
router = APIRouter(prefix="/events", tags=["Events"])

#should be in .env file
WEBHOOK_SECRET = os.getenv("AUTH0_WEBHOOK_SECRET")

@router.post("/webhook")
async def handle_auth0_webhook(
    request: Request, 
    x_webhook_secret: str = Header(None)
):
    # Verify the secret header
    if x_webhook_secret != WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized webhook source"
        )
    print("Received webhook with valid secret. Processing event...")    

    try:
        event_data = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload"
        )

    event_id = event_data.get("id")
    print(f"Processing event ID: {event_id}, Type: {event_data.get('type')}")
    event_type = event_data.get("type")
    # N.B: Auth0 'Post-User Registration' sends the user directly in 'user'
    # but other custom events might use 'data.object'. 
    # We adjust to be flexible:
    user_data = event_data.get("data", {}).get("object") or event_data.get("user")

    if not event_type or not user_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing event_type or user data"
        )

    # Idempotency Check: Don't process the same event twice
    if event_id and await is_duplicate(event_id):
        return {"status": "duplicate", "event_id": event_id}

    # Event Routing Logic
    match event_type:
        case "user.created":
            # Initial provisioning (Org + User)
            print("User created event received for user_id:", user_data.get("user_id"))
            await create_user_from_auth0(user_data)
        
        case "user.updated":
            # Sync name, email, or active status
            await update_user_from_auth0(user_data)
        
        case "user.deleted":
            # Soft delete or cleanup
            print("User deleted event received for user_id:", user_data.get("user_id"))
            await delete_user_from_auth0(user_data.get("user_id"))

        case "roles.changed":
            # Custom event for when an admin promotes/demotes someone
            await sync_user_roles_from_auth0(user_data)
            print("Roles changed event processed for user:", user_data.get("user_id"))

        case _:
            return {
                "status": "ignored", 
                "event_type": event_type, 
                "reason": "No handler for this event type"
            }

    return {"status": "processed", "event_type": event_type}


@router.post("/webhook/stream")
async def handle_auth0_stream(
    request: Request, 
    authorization: str = Header(None)
):
    # Check the Bearer Token you set in the Auth0 Stream Dashboard
    # 'Bearer your-provided-token'
    if not authorization or settings.authorization_header_streams_auth0_token not in authorization:
        raise HTTPException(status_code=401, detail="Unauthorized Stream")

    payload = await request.json()
    print(f"Received stream payload: {payload}")
    
    # Log Streams can send a single event or a list
    events = payload if isinstance(payload, list) else [payload]
    print(f"Processing {len(events)} event(s) from stream...")

    for event in events:
        event_type = event.get("type")
        data = event.get("data", {})

        match event_type:
           
            case "organization.created":
                await initialize_organization_workspace(data["object"])
                print("Organization created event processed for organization:", data["object"].get("id"))
            
            case "organization.deleted":
                await handle_organization_deleted(data["object"])
                print("Organization deleted event processed for organization:", data["object"].get("id"))
            case "organization.member.added":

                await handle_organization_user_link(data["object"])
                print("Role assigned event processed for user:", data["object"].get("user_id"))

            #  User Events 
            case "user.created":
                await create_user_from_auth0(data["object"])

            case "user.deleted":
                await delete_user_from_auth0(data["object"].get("user_id"))

            # Role Events 
            case "organization.member.role.assigned":
                await handle_role_assignment(data, action="assign")

            case "organization.member.role.deleted":
                await handle_role_assignment(data, action="remove")

    return {"status": "accepted"}