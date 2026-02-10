from fastapi import APIRouter, HTTPException
from models.models import User, User_Pydantic, UserIn_Pydantic
from typing import List
from uuid import UUID

router = APIRouter(prefix="/admin/users", tags=["Admin"])

@router.get("/", response_model=List[User_Pydantic])
async def get_users():
    # .all() returns a QuerySet, .from_queryset() converts it to Pydantic
    return await User_Pydantic.from_queryset(User.all())

@router.post("/", response_model=User_Pydantic)
async def create_user(user: UserIn_Pydantic):
    # .dict() gets the data from Pydantic, ** unpacks it into User.create
    user_obj = await User.create(**user.dict(exclude_unset=True))
    return await User_Pydantic.from_tortoise_orm(user_obj)

@router.get("/{user_id}", response_model=User_Pydantic)
async def get_user(user_id: UUID):
    return await User_Pydantic.from_queryset(User.filter(id=user_id))

@router.delete("/{user_id}")
async def delete_user(user_id: UUID):
    deleted_count = await User.filter(id=user_id).delete()
    if not deleted_count:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Deleted successfully"}
