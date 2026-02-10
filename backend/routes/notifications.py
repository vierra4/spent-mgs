from fastapi import APIRouter, Depends, Query
from auth.dependencies import get_current_user
from models.models import Notification
from services.notification_service import list_notifications, mark_notification_as_read

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
async def get_notifications(
    user=Depends(get_current_user),
    unread_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    return await list_notifications(user=user, unread_only=unread_only, limit=limit, offset=offset)

@router.post("/{notification_id}/read")
async def read_notification(notification_id: str, user=Depends(get_current_user)):
    notif = await mark_notification_as_read(notification_id, user)
    if not notif:
        return {"status": "not_found"}
    return {"status": "ok"}
