from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "organization" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "domain" VARCHAR(255),
    "auth_id" VARCHAR(500),
    "is_active" INT NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS "category" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "accounting_code" VARCHAR(100),
    "organization_id" CHAR(36) NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "idempotencykey" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" VARCHAR(255) NOT NULL UNIQUE,
    "scope" VARCHAR(100) NOT NULL,
    "organization_id" CHAR(36) REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "policy" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "is_active" INT NOT NULL DEFAULT 1,
    "organization_id" CHAR(36) NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "policyrule" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condition" JSON NOT NULL,
    "action" JSON NOT NULL,
    "priority" INT NOT NULL DEFAULT 0,
    "policy_id" CHAR(36) NOT NULL REFERENCES "policy" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "team" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "organization_id" CHAR(36) NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "user" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "auth_id" VARCHAR(255) UNIQUE,
    "full_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255),
    "role" VARCHAR(50) NOT NULL,
    "is_active" INT NOT NULL DEFAULT 1,
    "hash_password" VARCHAR(255),
    "is_superuser" INT NOT NULL DEFAULT 0,
    "avatar_url" TEXT,
    "organization_id" CHAR(36) REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "auditlog" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" CHAR(36) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "metadata" JSON,
    "actor_id" CHAR(36) REFERENCES "user" ("id") ON DELETE SET NULL,
    "organization_id" CHAR(36) NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "notification" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "read" INT NOT NULL DEFAULT 0,
    "metadata" JSON,
    "organization_id" CHAR(36) NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
    "recipient_id" CHAR(36) NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "teammember" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "team_id" CHAR(36) NOT NULL REFERENCES "team" ("id") ON DELETE CASCADE,
    "user_id" CHAR(36) NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "vendor" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "normalized_name" VARCHAR(255) NOT NULL,
    "is_blocked" INT NOT NULL DEFAULT 0,
    "organization_id" CHAR(36) NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "spendevent" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" VARCHAR(40) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "spend_date" DATE NOT NULL,
    "source" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "raw_metadata" JSON,
    "category_id" CHAR(36) REFERENCES "category" ("id") ON DELETE SET NULL,
    "organization_id" CHAR(36) NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
    "team_id" CHAR(36) REFERENCES "team" ("id") ON DELETE SET NULL,
    "user_id" CHAR(36) REFERENCES "user" ("id") ON DELETE SET NULL,
    "vendor_id" CHAR(36) REFERENCES "vendor" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "approval" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL,
    "comment" TEXT,
    "approver_id" CHAR(36) REFERENCES "user" ("id") ON DELETE SET NULL,
    "spend_event_id" CHAR(36) NOT NULL REFERENCES "spendevent" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "receipt" (
    "id" CHAR(36) NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_url" TEXT NOT NULL,
    "extracted_data" JSON,
    "is_verified" INT NOT NULL DEFAULT 0,
    "spend_event_id" CHAR(36) NOT NULL REFERENCES "spendevent" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSON NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "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"
    "mWbFYOkzp/v1/6sp35A="
)
