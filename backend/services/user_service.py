from models.models import User, Organization
from tortoise.transactions import in_transaction

async def create_user_from_auth0(user_data: dict):
    """
    Handles provisioning a new user and their organization.
    No more splitting email domains—we use the Auth0 data.
    """
    email = user_data.get("email")
    name = user_data.get("name") or user_data.get("nickname")
    
    # Get Organization info from Auth0 metadata or event
    # If using Auth0 Organizations, it's usually in 'organization_id'
    # If custom, we use app_metadata
    app_metadata = user_data.get("app_metadata", {})
    org_id = user_data.get("organization_id") or app_metadata.get("org_id")
    org_name = user_data.get("organization_name") or app_metadata.get("org_name")
    
    # Fallback for role
    role = app_metadata.get("role", "employee")

    async with in_transaction():
        # use the real name/ID provided
        # If no org info is provided, we use a default "Personal" instance
        org, _ = await Organization.get_or_create(
            id=org_id if org_id else None,
            defaults={
                "name": org_name if org_name else f"{name}'s Org",
                "domain": email.split("@")[-1] if email else None
            }
        )

        # 2. Create the User linked to that Org
        user, created = await User.get_or_create(
            email=email,
            defaults={
                "full_name": name,
                "organization": org,
                "role": role,
                "is_active": True
            }
        )
        
        return user

async def update_user_from_auth0(user_data: dict):
    """
    Syncs changes from Auth0 to the local database.
    """
    email = user_data.get("email")
    user = await User.get_or_none(email=email)
    
    if not user:
        # If user doesn't exist yet, create them instead of failing
        return await create_user_from_auth0(user_data)

    app_metadata = user_data.get("app_metadata", {})
    
    # Update fields if they exist in the payload
    if "role" in app_metadata:
        user.role = app_metadata["role"]
    
    user.full_name = user_data.get("name", user.full_name)
    
    # 'blocked' status in Auth0 maps to 'is_active' in our DB
    if "blocked" in user_data:
        user.is_active = not user_data["blocked"]

    await user.save()
    return user

async def delete_user_from_auth0(auth0_user_id: str):
    """
    Handles user deletion (Soft delete recommended for Audit logs).
    """
    # Note: In a spend app, we usually soft-delete because 
    # we need to keep the user's name on old receipts/audit logs.
    user = await User.get_or_none(email=auth0_user_id) 
    if user:
        user.is_active = False
        await user.save()
    return {"status": "deactivated"}

async def sync_user_roles_from_auth0(user_data: dict):
    """
    Specific handler for role-only update events.
    """
    email = user_data.get("email")
    roles = user_data.get("roles", [])
    
    user = await User.get_or_none(email=email)
    if user and roles:
        # Take the highest priority role
        user.role = roles[0] 
        await user.save()
    return users

async def handle_role_assignment(data: dict, action: str):
    """
    Handles organization.member.role.assigned and deleted.
    Data usually contains: user_id, organization_id, and the role name/ID.
    """
    user_id = data.get("user_id")
    role_name = data.get("role_name") 
    user = await User.get_or_none(email=user_id) 
    if not user:
        return

    if action == "assign":
        user.role = role_name
    elif action == "remove":
        user.role = "employee" # Fallback to base role
        
    await user.save()
    
from models import Organization, Category, Policy

async def initialize_organization_workspace(org_data: dict):
    org_id = org_data.get("id")
    org_name = org_data.get("name")

    # Get or Create the Organization
    org, created = await Organization.get_or_create(
        id=org_id,
        defaults={"name": org_name}
    )

    if created:
        # Seed Default Categories and Policies for the new organization
        default_categories = ["Travel", "Software", "Office Supplies", "Meals & Entertainment"]
        for cat_name in default_categories:
            await Category.get_or_create(
                organization=org,
                name=cat_name,
                defaults={"accounting_code": f"EXP-{cat_name.upper()[:3]}"}
            )

        # Create a Default "Global Spend Policy"
        await Policy.create(
            organization=org,
            name="Default Monthly Limit",
            is_active=True
            # we will add rules later as needed ......
        )
        
    return org    