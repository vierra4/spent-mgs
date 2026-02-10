from models.models import Policy, PolicyRule, SpendEvent, Category
from services.approval_service import request_approval
from services.audit_service import log_action
from spend_state import transition_spend, SpendStatus
import asyncio

async def evaluate_policies(spend):
    policies = await Policy.filter(
        organization=spend.organization,
        is_active=True
    ).prefetch_related("rules")

    actions = []

    for policy in policies:
        for rule in sorted(policy.rules, key=lambda r: r.priority):
            if _match_condition(rule.condition, spend):
                actions.append(rule.action)

    await _apply_actions(spend, actions)


def _match_condition(condition: dict, spend: SpendEvent) -> bool:
    for field, expected in condition.items():
        value = getattr(spend, field, None)
        if value != expected:
            return False
    return True


async def _apply_actions(spend: SpendEvent, actions: list[dict]):
    for action in actions:
        action_type = action.get("type")

        if action_type == "require_approval":
            await request_approval(spend, action)
            await transition_spend(spend, SpendStatus.AWAITING_APPROVAL)

        elif action_type == "auto_approve":
            await transition_spend(spend, SpendStatus.APPROVED)

        elif action_type == "block":
            await transition_spend(spend, SpendStatus.BLOCKED)

    # Always log after applying actions
    from services.audit_service import log_action
    await log_action(
        organization=spend.organization,
        actor=spend.user,
        entity=spend,
        action="policy_evaluated",
        metadata={"actions": actions}
    )


async def auto_categorize_spend(spend: SpendEvent, vendor_name: str):
    """
    Try to map vendor_name to a Category in the organization.
    """
    if not vendor_name:
        return  # Nothing to do

    # Simple exact match for MVP; can improve with advanced matching later
    category = await Category.get_or_none(
        organization=spend.organization,
        name__iexact=vendor_name
    )

    if category:
        spend.category = category
        await spend.save()
    else:
        # Optional: create "Uncategorized" if no match
        category = await Category.get_or_create(
            organization=spend.organization,
            name="Uncategorized"
        )
        spend.category = category[0]
        await spend.save()
