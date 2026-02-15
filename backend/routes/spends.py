from typing import Optional
from uuid import UUID
from services.policy_service import evaluate_policies
from fastapi import APIRouter, Depends, BackgroundTasks, Query
from pydantic import BaseModel
from datetime import date
from services.spend_service import create_spend_event
from auth.dependencies import get_current_user
from models.models import Category, Receipt, SpendEvent
from auth.roles import Role

router = APIRouter(prefix="/spends", tags=["Spends"])


class SpendCreateRequest(BaseModel):
    amount: float
    currency: str
    spend_date: date
    source: str
    category_id: Optional[UUID] 
    description: str | None = None
    vendor_id: str | None = None
    category: Optional[str]
    # category_id: str | None = None

@router.get("")
async def list_spends(
    user=Depends(get_current_user),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: str | None = None,
    category_id: str | None = None,
    user_id: str | None = None
):
    qs = SpendEvent.filter(organization=user.organization)

    # Role based visibility
    if user.role != Role.FINANCE.value:
        qs = qs.filter(user=user)

    # Filters
    if status:
        qs = qs.filter(status=status)

    if category_id:
        qs = qs.filter(category_id=category_id)

    if user_id and user.role == Role.FINANCE.value:
        qs = qs.filter(user_id=user_id)

    total = await qs.count()
    spends = await qs.limit(limit).offset(offset).order_by("-created_at")

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": spends
    }

from fastapi import Request
@router.post("")
async def create_spend(
    payload: SpendCreateRequest,
    user=Depends(get_current_user)
):
    if payload.category:
        category, _ = await Category.get_or_create(
        name=payload.category,
        organization=user.organization
    )
    elif payload.category_id:
        category = await Category.get(id=payload.category_id)
    else:
        category = None

#     # Find category by name
#     category, _ = await Category.get_or_create(
#     name=payload.category,
#     organization=user.organization
# )

    spend = await SpendEvent.create(
        organization=user.organization,
        user=user,
        amount=payload.amount,
        currency=payload.currency,
        spend_date=date.today(),
        source="dashboard",
        description=payload.description,
        category="59c75288-9201-462d-87dd-526151606310",
        vendor=None
    )
    
    if payload.receipt_url:
        await Receipt.create(
            spend_event=spend,
            file_url=payload.receipt_url
        )

# async def create_spend(request: Request):
#     data = await request.json()
#     print("INCOMING:", data)

# async def create_spend(payload: SpendCreateRequest, background_tasks: BackgroundTasks, user=Depends(get_current_user)):
#     print(payload)
#     spend = await create_spend_event(
#         organization=user.organization,
#         user=user,
#         amount=payload.amount,
#         currency=payload.currency,
#         spend_date=payload.spend_date,
#         source=payload.source,
#         description=payload.description,
#         vendor=payload.vendor_id,
#         category=payload.category_id
#     )

#     # Run policy evaluation async
#     background_tasks.add_task(evaluate_policies, spend)

#     return spend
