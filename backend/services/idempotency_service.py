from models.models import IdempotencyKey

async def is_duplicate(key: str) -> bool:
    return await IdempotencyKey.exists(key=key)

async def record_key(key: str, scope: str, organization=None):
    await IdempotencyKey.create(
        key=key,
        scope=scope,
        organization=organization
    )
