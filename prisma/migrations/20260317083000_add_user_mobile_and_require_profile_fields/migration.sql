-- Add mobile for post-auth profile completion
ALTER TABLE "User"
ADD COLUMN "mobile" TEXT;

-- These statements will fail if legacy rows still contain null values.
ALTER TABLE "User"
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
