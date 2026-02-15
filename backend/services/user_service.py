from models.models import User, Organization
from tortoise.transactions import in_transaction

async def create_user_from_auth0(user_data: dict):
    """
    Handles provisioning a new user.
    This function only creates the user; organization linking
    is handled separately by 'organization.member.created' events.
    """
    email = user_data.get("email")
    if not email:
        raise ValueError("User email is required for creation")

    name = user_data.get("username") or user_data.get("nickname", "Unnamed User")
    
    # Fallback for role
    app_metadata = user_data.get("app_metadata", {})
    role = app_metadata.get("role", "employee")

    async with in_transaction():
        # Only create the user
        user, created = await User.get_or_create(
            email=email,
            defaults={
                "full_name": name,
                "auth_id": user_data.get("user_id"),  # Store Auth0 user ID for reference
                "username": user_data.get("username"),
                "hash_password": user_data.get("password") or None,
                "role": role,
                "is_active": True
            }
        )

    return user


async def update_user_from_auth0(user_data: dict):
    """
    Syncs changes from Auth0 to the local database.
    """
    email = user_data.get("email")
    user = await User.get_or_none(email=email)
    
    if not user:
        # If user doesn't exist yet, create them instead of failing
        return await create_user_from_auth0(user_data)

    app_metadata = user_data.get("app_metadata", {})
    
    # Update fields if they exist in the payload
    if "role" in app_metadata:
        user.role = app_metadata["role"]
    
    user.full_name = user_data.get("name", user.full_name)
    
    # 'blocked' status in Auth0 maps to 'is_active' in our DB
    if "blocked" in user_data:
        user.is_active = not user_data["blocked"]

    await user.save()
    return user

async def delete_user_from_auth0(auth0_user_id: str):
    """
    Handles user deletion (Soft delete recommended for Audit logs).
    """
    # Note: In a spend app, we usually soft-delete because 
    # we need to keep the user's name on old receipts/audit logs.
    user = await User.get_or_none(email=auth0_user_id) 
    if user:
        user.is_active = False
        await user.save()
    return {"status": "deactivated"}

async def sync_user_roles_from_auth0(user_data: dict):
    """
    Specific handler for role-only update events.
    """
    email = user_data.get("email")
    roles = user_data.get("roles", [])
    
    user = await User.get_or_none(email=email)
    if user and roles:
        # Take the highest priority role
        user.role = roles[0] 
        await user.save()
    return user

async def handle_role_assignment(data: dict, action: str):
    """
    Handles organization.member.role.assigned and deleted.
    Data usually contains: user_id, organization_id, and the role name/ID.
    """
    user_id = data.get("user_id")
    role_name = data.get("role_name") 
    user = await User.get_or_none(email=user_id) 
    if not user:
        return

    if action == "assign":
        user.role = role_name
    elif action == "remove":
        user.role = "employee" # Fallback to base role
        
    await user.save()
    
from models import Organization, Category, Policy
org_data_example ={
  "name": "my-organization",
  "id": "org_1234567890abcdef",
  "display_name": "My Organization",
  "metadata": {},
  "branding": {
    "logo_url": "https://example.com",
    "colors": {
      "primary": "#0059d6",
      "page_background": "#000000"
    }
  }
}
async def initialize_organization_workspace(org_data: dict):
    print("Initializing workspace for organization:", org_data.get("name"))
    org_id = org_data.get("id") or org_data.get("display_name") or "Unnamed Org"or org_data.get("display_name") or "Unnamed Org"
    org_name = org_data.get("name")

    # Get or Create the Organization
    org, created = await Organization.get_or_create(
        auth_id=org_id,
        defaults={"name": org_name}
    )

    if created:
        # Seed Default Categories and Policies for the new organization
        default_categories = ["Travel", "Software", "Office Supplies", "Meals & Entertainment"]
        for cat_name in default_categories:
            await Category.get_or_create(
                organization=org,
                name=cat_name,
                defaults={"accounting_code": f"EXP-{cat_name.upper()[:3]}"}
            )

        # Create a Default "Global Spend Policy"
        await Policy.create(
            organization=org,
            name="Default Monthly Limit",
            is_active=True
            # we will add rules later as needed ......
        )
        
    return org    
from models.models import Organization
from tortoise.transactions import in_transaction

async def handle_organization_deleted(org_data: dict):
    """
    Handles Auth0 'organization.deleted' events.

    org_data: payload['data']['object'] from Auth0
    """
    org_id = org_data.get("id")
    if not org_id:
        raise ValueError("Organization ID missing in deleted event")

    async with in_transaction():
        org = await Organization.get_or_none(auth_id=org_id)
        if not org:
            # Already deleted or never existed
            return {"status": "not found"}

        # # Option 1: Soft delete
        # org.is_active = False  # Assuming you have an is_active boolean field
        # await org.save()

        # Option 2: Hard delete (uncomment if you want)
        await org.delete()

    return {"status": "deleted", "organization": org_id}


async def handle_organization_user_link(event_object: dict):
    """
    Links an existing user to an organization.

    Expected event_object format:
    {
      "organization": {"id": "...", "name": "..."},
      "user": {"user_id": "..."}
    }

    Note: User must already exist (created by 'user.created' event).
    """
    print("Handling organization.member.created event with data:", event_object)
    org_info = event_object.get("organization", {})
    user_info = event_object.get("user", {})

    org_id = org_info.get("id")
    org_name = org_info.get("name", "Unnamed Org")
    auth0_user_id = user_info.get("user_id")

    if not org_id or not auth0_user_id:
        raise ValueError("Organization ID or User ID missing in member.created event")

    async with in_transaction():
        # 1. Find or create the organization
        org, _ = await Organization.get_or_create(
            auth_id=org_id,
            defaults={"name": org_name}
        )

        # 2. Find the existing user
        user = await User.get_or_none(auth_id=auth0_user_id)
        if not user:
            # User not yet created → just log or skip
            print(f"User {auth0_user_id} not found, cannot link to org {org_id}")
            return {"status": "user not found", "user": auth0_user_id, "org": org_id}

        # 3. Link user to org
        user.organization = org
        user.is_active = True  # activate if previously inactive
        await user.save()

    print(f"User {auth0_user_id} linked to organization {org_id}")
    return {"status": "linked", "user": auth0_user_id, "org": org_id}
