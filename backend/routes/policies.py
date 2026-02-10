from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from models.models import Policy, PolicyRule
from auth.dependencies import get_current_user
from auth.roles import Role

router = APIRouter(prefix="/policies", tags=["Policies"])

#  Request/Response schemas
class PolicyRuleCreateRequest(BaseModel):
    condition: str
    action: str
    priority: int = 1

class PolicyCreateRequest(BaseModel):
    name: str
    is_active: bool = True
    rules: Optional[List[PolicyRuleCreateRequest]] = []

class PolicyResponse(BaseModel):
    id: str
    name: str
    is_active: bool
    rules: List[PolicyRuleCreateRequest]

#  Routes 
@router.post("", response_model=PolicyResponse)
async def create_policy(payload: PolicyCreateRequest, user=Depends(lambda: get_current_user(required_roles=[Role.FINANCE]))):
    policy = await Policy.create(
        name=payload.name,
        is_active=payload.is_active,
        organization=user.organization
    )

    for rule_req in payload.rules or []:
        await PolicyRule.create(
            policy=policy,
            condition=rule_req.condition,
            action=rule_req.action,
            priority=rule_req.priority
        )

    return PolicyResponse(
        id=str(policy.id),
        name=policy.name,
        is_active=policy.is_active,
        rules=payload.rules or []
    )

@router.get("", response_model=List[PolicyResponse])
async def list_policies(user=Depends(lambda: get_current_user(required_roles=[Role.FINANCE]))):
    policies = await Policy.filter(organization=user.organization).prefetch_related("rules")
    result = []
    for p in policies:
        rules = [PolicyRuleCreateRequest(condition=r.condition, action=r.action, priority=r.priority) for r in p.rules]
        result.append(PolicyResponse(id=str(p.id), name=p.name, is_active=p.is_active, rules=rules))
    return result

@router.patch("/{policy_id}", response_model=PolicyResponse)
async def update_policy(policy_id: str, payload: PolicyCreateRequest, user=Depends(lambda: get_current_user(required_roles=[Role.FINANCE]))):
    policy = await Policy.get_or_none(id=policy_id, organization=user.organization)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    policy.name = payload.name
    policy.is_active = payload.is_active
    await policy.save()

    # Replace rules (simplest MVP approach)
    await PolicyRule.filter(policy=policy).delete()
    for rule_req in payload.rules or []:
        await PolicyRule.create(
            policy=policy,
            condition=rule_req.condition,
            action=rule_req.action,
            priority=rule_req.priority
        )

    return PolicyResponse(
        id=str(policy.id),
        name=policy.name,
        is_active=policy.is_active,
        rules=payload.rules or []
    )
