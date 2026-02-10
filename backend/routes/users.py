from fastapi import APIRouter, Depends
from auth.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return user
