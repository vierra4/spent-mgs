from enum import Enum
from models import SpendEvent, Approval

class SpendStatus(str, Enum):
    PENDING = "pending"
    AWAITING_APPROVAL = "awaiting_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    BLOCKED = "blocked"


# Allowed transitions map
TRANSITIONS = {
    SpendStatus.PENDING: [SpendStatus.AWAITING_APPROVAL, SpendStatus.APPROVED, SpendStatus.REJECTED, SpendStatus.BLOCKED],
    SpendStatus.AWAITING_APPROVAL: [SpendStatus.APPROVED, SpendStatus.REJECTED, SpendStatus.BLOCKED],
    SpendStatus.APPROVED: [],
    SpendStatus.REJECTED: [],
    SpendStatus.BLOCKED: []
}


async def transition_spend(spend: SpendEvent, new_status: str):
    if new_status not in TRANSITIONS[spend.status]:
        raise ValueError(f"Invalid transition from {spend.status} to {new_status}")

    spend.status = new_status
    await spend.save()
