from fastapi import Depends, HTTPException
from models.models import User, Organization
from fastapi_plugin.fast_api_client import Auth0FastAPI
from auth.config import get_settings

settings = get_settings()

auth0 = Auth0FastAPI(
    domain=settings.auth0_domain,
    audience=settings.auth0_api_audience
)


async def get_current_user(claims=Depends(auth0.require_auth())):
    auth_id = claims.get("sub")
    print(f"Authenticating user with Auth0 ID: {auth_id}")

    user = await User.get_or_none(auth_id=auth_id)

    if not user:
        raise HTTPException(403, "User not provisioned")

    return user
