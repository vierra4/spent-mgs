from tortoise import Tortoise # type: ignore
from auth.config import get_settings

settings = get_settings()

TORTOISE_ORM = {
    "connections": {
        "default": settings.db_url
    },
    "apps": {
        "models": {
            "models": ["models.models", "aerich.models"],
            "default_connection": "default",
        }
    },
}

async def init_db() -> None:
    await Tortoise.init(config=TORTOISE_ORM)

async def close_db() -> None:
    await Tortoise.close_connections()