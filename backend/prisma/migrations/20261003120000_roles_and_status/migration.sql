-- Expand trusted account roles and add suspension state.
ALTER TYPE "UserRole" RENAME VALUE 'OWNER' TO 'RESTAURANT_OWNER';
ALTER TYPE "UserRole" ADD VALUE 'RIDER';

CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');
ALTER TABLE "User" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
