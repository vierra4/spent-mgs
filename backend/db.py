from tortoise import Tortoise
from auth.config import get_settings
settings = get_settings()



async def init_db() -> None:
    await Tortoise.init(
        db_url=settings.DB_URL,
        modules={"models": ["models.models"]},
    )
    print(Tortoise.apps)

    await Tortoise.generate_schemas()


async def close_db() -> None:
    await Tortoise.close_connections()
    