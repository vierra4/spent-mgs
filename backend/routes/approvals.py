from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models.models import Approval
from services.approval_service import resolve_approval
from auth.dependencies import get_current_user
from auth.permissions import require_role
from auth.roles import Role
from services.notification_service import create_notification
router = APIRouter(prefix="/approvals", tags=["Approvals"])


class ApprovalDecisionRequest(BaseModel):
    approved: bool
    comment: str | None = None


@router.post("/{approval_id}/decision")
async def decide_approval(
    approval_id: str,
    payload: ApprovalDecisionRequest,
    user=Depends(require_role(Role.MANAGER, Role.FINANCE))
):
    approval = await Approval.get_or_none(id=approval_id)

    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")

    if approval.approver_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    await resolve_approval(
        approval=approval,
        approved=payload.approved,
        comment=payload.comment
    )

    return {"status": "ok"}
