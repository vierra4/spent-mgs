from tortoise import Tortoise
from auth.config import get_settings

settings = get_settings()

# Config dictionary for Tortoise + Aerich
TORTOISE_ORM = {
    "connections": {
        "default": "postgres://neondb_owner:npg_8tQUGEgTp7Fc@ep-calm-mode-a874d34c-pooler.eastus2.azure.neon.tech/neondb"
    },
    "apps": {
        "models": {
            "models": ["models.models", "aerich.models"],  # add aerich.models for migrations
            "default_connection": "default",
        }
    },
}

async def init_db() -> None:
    await Tortoise.init(config=TORTOISE_ORM)
    # print(Tortoise.apps)
    # Only generate schemas for development/testing
    # await Tortoise.generate_schemas()

async def close_db() -> None:
    await Tortoise.close_connections()
