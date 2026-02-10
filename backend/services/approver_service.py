from models.models import Policy, PolicyRule, User, SpendEvent
from auth.roles import Role

async def select_approver(spend: SpendEvent) -> User | None:
    """
    Select approver automatically based on active policies.
    MVP logic:
    - Loop active policies in organization by priority
    - Check each rule condition against spend
    - Return first approver found in action JSON
    """

    org = spend.organization

    # Fetch active policies ordered by priority
    policies = await Policy.filter(
        organization=org,
        is_active=True
    ).prefetch_related("rules")

    # Flatten rules and sort by priority descending
    rules = sorted(
        [r for p in policies for r in p.rules],
        key=lambda r: r.priority,
        reverse=True
    )

    for rule in rules:
        condition = rule.condition  # JSON
        action = rule.action        # JSON

        # Simple MVP evaluator: assume condition keys match spend fields
        # e.g., {"amount_gt": 500} or {"category": "Travel"}
        match = True

        for k, v in condition.items():
            if k == "amount_gt" and (spend.amount is None or spend.amount <= v):
                match = False
                break
            elif k == "amount_lt" and (spend.amount is None or spend.amount >= v):
                match = False
                break
            elif k == "category" and getattr(spend.category, "name", None) != v:
                match = False
                break
            # We will add more as needed this is for the MVP 

        if match:
            # Get approver from action JSON, e.g., {"approver_role": "manager"}
            role = action.get("approver_role", Role.MANAGER.value)
            approver = await User.filter(organization=org, role=role).first()
            if approver:
                return approver

    # Fallback: first manager
    return await User.filter(organization=org, role=Role.MANAGER.value).first()