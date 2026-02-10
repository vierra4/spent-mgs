from fastapi import APIRouter, Depends, Query, HTTPException
from auth.dependencies import get_current_user
from auth.roles import Role
from models.models import AuditLog
from auth.permissions import require_role
router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])

@router.get("")
async def list_audit_logs(
    user=Depends(require_role(Role.ADMIN, Role.FINANCE)),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    action: str | None = None,
    entity_type: str | None = None,
    actor_id: str | None = None
):
    if user.role != Role.ADMIN.value:
        raise HTTPException(status_code=403, detail="Admin access only")

    qs = AuditLog.filter(organization=user.organization)

    if action:
        qs = qs.filter(action=action)

    if entity_type:
        qs = qs.filter(entity_type=entity_type)

    if actor_id:
        qs = qs.filter(actor_id=actor_id)

    total = await qs.count()
    logs = await qs.limit(limit).offset(offset).order_by("-id")

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": logs
    }
