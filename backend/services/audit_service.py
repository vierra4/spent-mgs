from models.models import AuditLog


async def log_action(
    *,
    organization,
    actor,
    entity,
    action,
    metadata=None
):
    await AuditLog.create(
        organization=organization,
        actor=actor,
        entity_type=entity.__class__.__name__,
        entity_id=entity.id,
        action=action,
        metadata=metadata
    )
