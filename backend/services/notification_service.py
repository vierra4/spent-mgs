from models.models import Notification, User, Organization

async def create_notification(
    *,
    organization: Organization,
    recipient: User,
    title: str,
    message: str,
    metadata: dict | None = None
):
    return await Notification.create(
        organization=organization,
        recipient=recipient,
        title=title,
        message=message,
        metadata=metadata
    )

async def mark_notification_as_read(notification_id: str, user: User):
    notif = await Notification.get_or_none(id=notification_id, recipient=user)
    if notif:
        notif.read = True
        await notif.save()
    return notif

async def list_notifications(user: User, unread_only: bool = False, limit: int = 50, offset: int = 0):
    qs = Notification.filter(recipient=user)
    if unread_only:
        qs = qs.filter(read=False)
    total = await qs.count()
    notifications = await qs.order_by("-created_at").limit(limit).offset(offset)
    return {"total": total, "limit": limit, "offset": offset, "items": notifications}
