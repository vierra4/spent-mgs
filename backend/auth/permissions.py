from fastapi import Depends, HTTPException, status
from auth.dependencies import get_current_user
from auth.roles import Role

def require_role(*allowed_roles: Role):
    # This function is the actual FastAPI dependency
    async def checker(user=Depends(get_current_user)):
        # Convert the Enum values to a list of strings
        allowed_values = [r.value for r in allowed_roles]
        
        if user.role not in allowed_values:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required: {allowed_values}"
            )
        return user
    return checker