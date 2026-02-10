import uuid
from tortoise import fields, models
from tortoise.models import Model
from fastadmin import TortoiseModelAdmin, WidgetType, register
import typing as tp
import bcrypt, sys, inspect
from uuid import UUID
class BaseModel(Model):
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        abstract = True


class Organization(BaseModel):
    name = fields.CharField(max_length=255)
    domain = fields.CharField(max_length=255, null=True)
    auth_id=fields.CharField(max_length=500,null=True, blank=True)
    is_active = fields.BooleanField(default=True)


class User(BaseModel):
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="users",
        on_delete=fields.CASCADE
    )
    email = fields.CharField(max_length=255, unique=True)
    full_name = fields.CharField(max_length=255)
    role = fields.CharField(max_length=50)
    is_active = fields.BooleanField(default=True)
    hash_password = fields.CharField(max_length=255)
    is_superuser = fields.BooleanField(default=False)
    avatar_url = fields.TextField(null=True)


class Team(BaseModel):
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="teams",
        on_delete=fields.CASCADE
    )
    name = fields.CharField(max_length=255)


class TeamMember(BaseModel):
    team = fields.ForeignKeyField(
        "models.Team",
        related_name="members",
        on_delete=fields.CASCADE
    )
    user = fields.ForeignKeyField(
        "models.User",
        related_name="team_memberships",
        on_delete=fields.CASCADE
    )


class Vendor(BaseModel):
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="vendors",
        on_delete=fields.CASCADE
    )
    name = fields.CharField(max_length=255)
    normalized_name = fields.CharField(max_length=255)
    is_blocked = fields.BooleanField(default=False)


class Category(BaseModel):
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="categories",
        on_delete=fields.CASCADE
    )
    name = fields.CharField(max_length=255)
    accounting_code = fields.CharField(max_length=100, null=True)


class SpendEvent(BaseModel):
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="spend_events",
        on_delete=fields.CASCADE
    )
    user = fields.ForeignKeyField(
        "models.User",
        related_name="spend_events",
        on_delete=fields.SET_NULL,
        null=True
    )
    vendor = fields.ForeignKeyField(
        "models.Vendor",
        related_name="spend_events",
        on_delete=fields.SET_NULL,
        null=True
    )
    category = fields.ForeignKeyField(
        "models.Category",
        related_name="spend_events",
        on_delete=fields.SET_NULL,
        null=True
    )
    team = fields.ForeignKeyField(
        "models.Team",
        related_name="spend_events",
        on_delete=fields.SET_NULL,
        null=True
    )

    amount = fields.DecimalField(max_digits=12, decimal_places=2)
    currency = fields.CharField(max_length=10)
    spend_date = fields.DateField()
    source = fields.CharField(max_length=50)
    description = fields.TextField(null=True)

    status = fields.CharField(
        max_length=50,
        default="pending"
    )

    raw_metadata = fields.JSONField(null=True)


class Receipt(BaseModel):
    spend_event = fields.ForeignKeyField(
        "models.SpendEvent",
        related_name="receipts",
        on_delete=fields.CASCADE
    )
    file_url = fields.TextField()
    extracted_data = fields.JSONField(null=True)
    is_verified = fields.BooleanField(default=False)


class Policy(BaseModel):
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="policies",
        on_delete=fields.CASCADE
    )
    name = fields.CharField(max_length=255)
    is_active = fields.BooleanField(default=True)


class PolicyRule(BaseModel):
    policy = fields.ForeignKeyField(
        "models.Policy",
        related_name="rules",
        on_delete=fields.CASCADE
    )
    condition = fields.JSONField()
    action = fields.JSONField()
    priority = fields.IntField(default=0)


class Approval(BaseModel):
    spend_event = fields.ForeignKeyField(
        "models.SpendEvent",
        related_name="approvals",
        on_delete=fields.CASCADE
    )
    approver = fields.ForeignKeyField(
        "models.User",
        related_name="approvals",
        on_delete=fields.SET_NULL,
        null=True
    )
    status = fields.CharField(max_length=50)
    comment = fields.TextField(null=True)

class IdempotencyKey(BaseModel):
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="idempotency_keys",
        on_delete=fields.CASCADE,
        null=True
    )
    key = fields.CharField(max_length=255, unique=True)
    scope = fields.CharField(max_length=100)

class Notification(BaseModel):
    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="notifications",
        on_delete=fields.CASCADE
    )
    recipient = fields.ForeignKeyField(
        "models.User",
        related_name="notifications",
        on_delete=fields.CASCADE
    )
    title = fields.CharField(max_length=255)
    message = fields.TextField()
    read = fields.BooleanField(default=False)
    metadata = fields.JSONField(null=True)  # Optional extra info (e.g., spend_id)


class AuditLog(BaseModel):

    organization = fields.ForeignKeyField(
        "models.Organization",
        related_name="audit_logs",
        on_delete=fields.CASCADE
    )
    actor = fields.ForeignKeyField(
        "models.User",
        related_name="audit_logs",
        on_delete=fields.SET_NULL,
        null=True
    )
    entity_type = fields.CharField(max_length=100)
    entity_id = fields.UUIDField()
    action = fields.CharField(max_length=100)
    metadata = fields.JSONField(null=True)

    """
    For future auto mapping
    class VendorCategoryMap(BaseModel):
    organization = fields.ForeignKeyField("models.Organization", related_name="vendor_maps")
    vendor_name = fields.CharField(max_length=255)
    category = fields.ForeignKeyField("models.Category", related_name="vendor_maps")

    """
from tortoise.contrib.pydantic import pydantic_model_creator

# User schemas
# User_Pydantic: For reading data (includes id, created_at)
User_Pydantic = pydantic_model_creator(User, name="User")
# UserIn_Pydantic: For creating/updating (excludes read-only fields)
UserIn_Pydantic = pydantic_model_creator(User, name="UserIn", exclude_readonly=True)

# Organization schemas
Org_Pydantic = pydantic_model_creator(Organization, name="Organization")
OrgIn_Pydantic = pydantic_model_creator(Organization, name="OrganizationIn", exclude_readonly=True)
