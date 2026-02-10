from fastapi import Depends, HTTPException
from models.models import User
from fastapi_plugin.fast_api_client import Auth0FastAPI
from auth.config import get_settings

settings = get_settings()

auth0 = Auth0FastAPI(
    domain=settings.auth0_domain,
    audience=settings.auth0_api_audience
)


async def get_current_user(claims: dict = Depends(auth0.require_auth())):
    email = claims.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Extract roles from the Auth0 custom claim we created in the Action
    # This looks for 'Namespace/roles' in the token, which is where we put the user's roles in Auth0
    auth0_roles = claims.get(f"{settings.NAMESPACE}/roles", [])
    
    # Decide which role to store in the DB (taking the first one found or 'employee' as default)
    primary_role = auth0_roles[0] if auth0_roles else "employee"

    user = await User.get_or_none(email=email).prefetch_related("organization")
    
    if not user:
        domain = email.split('@')[-1]
        org, _ = await Organization.get_or_create(
            domain=domain, 
            defaults={"name": domain.split('.')[0].capitalize()}
        )
        
        user = await User.create(
            email=email,
            full_name=claims.get("name", email),
            organization=org,
            role=primary_role, # Use the role from Auth0
            is_active=True
        )
    else:
        # Optional: Sync role if it changed in Auth0
        if user.role != primary_role:
            user.role = primary_role
            await user.save()

    return user