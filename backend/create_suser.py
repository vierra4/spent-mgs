import argparse
import asyncio
import bcrypt
import getpass

from models.models import User, Organization, IdempotencyKey
from db import init_db, close_db

BOOTSTRAP_KEY = "bootstrap:admin"
BOOTSTRAP_SCOPE = "system"
ADMIN_ORG_NAME = "admin-org"

DEFAULT_ADMIN_EMAIL = "admin-test@gmail.com"
DEFAULT_ADMIN_PASSWORD = "123"
DEFAULT_ADMIN_NAME = "Admin"


async def bootstrap_admin(
    *,
    email: str,
    password: str,
    full_name: str = DEFAULT_ADMIN_NAME,
) -> bool:
    exists = await IdempotencyKey.filter(
        key=BOOTSTRAP_KEY,
        scope=BOOTSTRAP_SCOPE,
    ).exists()

    if exists:
        return False

    org, _ = await Organization.get_or_create(
        name=ADMIN_ORG_NAME,
        defaults={"is_active": True},
    )

    hashed_password = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt(),
    ).decode()

    await User.create(
        organization=org,
        email=email,
        full_name=full_name,
        role="admin",
        hash_password=hashed_password,
        is_superuser=True,
        is_active=True,
    )

    await IdempotencyKey.create(
        key=BOOTSTRAP_KEY,
        scope=BOOTSTRAP_SCOPE,
    )

    return True


async def bootstrap_default():
    created = await bootstrap_admin(
        email=DEFAULT_ADMIN_EMAIL,
        password=DEFAULT_ADMIN_PASSWORD,
    )

    print("Admin created" if created else "Admin already exists")


async def bootstrap_cli():
    email = input("Admin email: ").strip()
    password = getpass.getpass("Admin password: ")
    confirm = getpass.getpass("Confirm password: ")

    if password != confirm:
        raise SystemExit("Passwords do not match")

    created = await bootstrap_admin(
        email=email,
        password=password,
    )

    print("Admin created" if created else "Admin already exists")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cli", action="store_true")
    args = parser.parse_args()

    async def runner():
        await init_db()

        if args.cli:
            await bootstrap_cli()
        else:
            await bootstrap_default()

        await close_db()

    asyncio.run(runner())


if __name__ == "__main__":
    main()
