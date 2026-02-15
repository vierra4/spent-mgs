from tortoise import Tortoise
from db import TORTOISE_ORM
from models.models import Organization
import asyncio


async def main():
    await Tortoise.init(config=TORTOISE_ORM)

    orgs = await Organization.all()

    print("COUNT:", len(orgs))

    for org in orgs:
        print(org.id, org.name)

    await Tortoise.close_connections()


asyncio.run(main())
