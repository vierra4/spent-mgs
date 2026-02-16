from fastapi import Depends, HTTPException, status
from auth.dependencies import get_current_user
from auth.roles import Role

def require_role(*allowed_roles: Role):
    async def checker(user=Depends(get_current_user)):
        allowed_values = [r.value for r in allowed_roles]

        user_roles = user.role if isinstance(user.role, list) else [user.role]

        if not any(role in allowed_values for role in user_roles):
            raise HTTPException(403, "Insufficient permissions")

        return user
    return checker
