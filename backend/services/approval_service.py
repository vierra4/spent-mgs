from models.models import Approval, SpendEvent, User
from services.audit_service import log_action
from spend_state import transition_spend, SpendStatus
from notifications.service import send_approval_notification
from services.notification_service import create_notification
from services.approver_service import select_approver
async def request_approval(spend: SpendEvent, action: dict):
    approver_id = action.get("approver")
    approver = await User.get(id=approver_id)
    if not approver:
        # fallback, send to financ admin or raise
        raise ValueError("No approver found for this spend")

    approval = await Approval.create(
        spend_event=spend,
        approver_id=approver_id,
        status="pending"
    )

    spend.status = "awaiting_approval"
    await spend.save()

    await log_action(
        organization=spend.organization,
        actor=spend.user,
        entity=approval,
        action="approval_requested"
    )

    # Send notification async-safe
    await send_approval_notification(approval)
    # send DB notification
    await create_notification(
        organization=spend.organization,
        recipient=approver,
        title="Approval Required",
        message=f"Spend of {spend.amount} {spend.currency} requires your approval",
        metadata={"spend_id": str(spend.id)}
    )

    return approval

async def resolve_approval(approval: Approval, approved: bool, comment=None):
    approval.status = "approved" if approved else "rejected"
    approval.comment = comment
    await approval.save()

    spend = approval.spend_event
    new_status = SpendStatus.APPROVED if approved else SpendStatus.REJECTED
    await transition_spend(spend, new_status)

    from services.audit_service import log_action
    await log_action(
        organization=spend.organization,
        actor=approval.approver,
        entity=spend,
        action="approval_resolved",
        metadata={"approved": approved}
    )
