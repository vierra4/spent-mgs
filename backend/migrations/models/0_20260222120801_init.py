from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "organization" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "domain" VARCHAR(255),
    "auth_id" VARCHAR(500),
    "is_active" BOOL NOT NULL
);
CREATE TABLE IF NOT EXISTS "category" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "accounting_code" VARCHAR(100),
    "organization_id" UUID NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "idempotencykey" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "key" VARCHAR(255) NOT NULL UNIQUE,
    "scope" VARCHAR(100) NOT NULL,
    "organization_id" UUID REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "policy" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_active" BOOL NOT NULL,
    "organization_id" UUID NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "policyrule" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "condition" JSONB NOT NULL,
    "action" JSONB NOT NULL,
    "priority" INT NOT NULL,
    "policy_id" UUID NOT NULL REFERENCES "policy" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "team" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "organization_id" UUID NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "auth_id" VARCHAR(255) UNIQUE,
    "full_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255),
    "role" VARCHAR(50) NOT NULL,
    "is_active" BOOL NOT NULL,
    "hash_password" VARCHAR(255),
    "is_superuser" BOOL NOT NULL,
    "avatar_url" TEXT,
    "organization_id" UUID REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "auditlog" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "metadata" JSONB,
    "actor_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL,
    "organization_id" UUID NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "notification" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOL NOT NULL,
    "metadata" JSONB,
    "organization_id" UUID NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
    "recipient_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "teammember" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "team_id" UUID NOT NULL REFERENCES "team" ("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "vendor" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "normalized_name" VARCHAR(255) NOT NULL,
    "is_blocked" BOOL NOT NULL,
    "organization_id" UUID NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "spendevent" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "spend_date" DATE NOT NULL,
    "source" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(50) NOT NULL,
    "raw_metadata" JSONB,
    "category_id" UUID REFERENCES "category" ("id") ON DELETE SET NULL,
    "organization_id" UUID NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
    "team_id" UUID REFERENCES "team" ("id") ON DELETE SET NULL,
    "user_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL,
    "vendor_id" UUID REFERENCES "vendor" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "approval" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "comment" TEXT,
    "approver_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL,
    "spend_event_id" UUID NOT NULL REFERENCES "spendevent" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "receipt" (
    "id" UUID NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "file_url" TEXT NOT NULL,
    "extracted_data" JSONB,
    "is_verified" BOOL NOT NULL,
    "spend_event_id" UUID NOT NULL REFERENCES "spendevent" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
