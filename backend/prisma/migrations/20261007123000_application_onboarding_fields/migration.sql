-- Add the normalized role-assignment table without removing the legacy User.role
-- field. Existing authorization code continues to work until the role service
-- migration is implemented in the application/API phase.
CREATE TABLE "UserRoleAssignment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserRoleAssignment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserRoleAssignment_userId_role_key"
  ON "UserRoleAssignment"("userId", "role");
CREATE INDEX "UserRoleAssignment_role_idx"
  ON "UserRoleAssignment"("role");
ALTER TABLE "UserRoleAssignment"
  ADD CONSTRAINT "UserRoleAssignment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "UserRoleAssignment" ("id", "userId", "role", "updatedAt")
SELECT md5("id" || ':' || "role"::text), "id", "role", CURRENT_TIMESTAMP
FROM "User"
ON CONFLICT ("userId", "role") DO NOTHING;

ALTER TABLE "RestaurantApplication"
  ADD COLUMN "restaurantDescription" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "state" TEXT,
  ADD COLUMN "pincode" TEXT,
  ADD COLUMN "cuisine" TEXT,
  ADD COLUMN "latitude" DOUBLE PRECISION,
  ADD COLUMN "longitude" DOUBLE PRECISION,
  ADD COLUMN "openingTime" TEXT,
  ADD COLUMN "closingTime" TEXT,
  ADD COLUMN "restaurantType" TEXT,
  ADD COLUMN "preparationTime" INTEGER,
  ADD COLUMN "minimumOrder" DOUBLE PRECISION,
  ADD COLUMN "logo" TEXT,
  ADD COLUMN "coverImage" TEXT,
  ADD COLUMN "businessDocuments" JSONB,
  ADD COLUMN "rejectionReason" TEXT,
  ADD COLUMN "reviewedBy" TEXT,
  ADD COLUMN "reviewedAt" TIMESTAMP(3);

CREATE INDEX "RestaurantApplication_reviewedBy_idx"
  ON "RestaurantApplication"("reviewedBy");
ALTER TABLE "RestaurantApplication"
  ADD CONSTRAINT "RestaurantApplication_reviewedBy_fkey"
  FOREIGN KEY ("reviewedBy") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RiderApplication"
  DROP CONSTRAINT IF EXISTS "RiderApplication_applicantId_key";

ALTER TABLE "RiderApplication"
  ADD COLUMN "fullName" TEXT,
  ADD COLUMN "email" TEXT,
  ADD COLUMN "vehicleBrand" TEXT,
  ADD COLUMN "vehicleModel" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "state" TEXT,
  ADD COLUMN "pincode" TEXT,
  ADD COLUMN "drivingLicense" TEXT,
  ADD COLUMN "vehicleRegistration" TEXT,
  ADD COLUMN "identityDocument" TEXT,
  ADD COLUMN "profileImage" TEXT,
  ADD COLUMN "rejectionReason" TEXT,
  ADD COLUMN "reviewedBy" TEXT,
  ADD COLUMN "reviewedAt" TIMESTAMP(3);

CREATE INDEX "RiderApplication_applicantId_status_idx"
  ON "RiderApplication"("applicantId", "status");
CREATE INDEX "RiderApplication_reviewedBy_idx"
  ON "RiderApplication"("reviewedBy");
ALTER TABLE "RiderApplication"
  ADD CONSTRAINT "RiderApplication_reviewedBy_fkey"
  FOREIGN KEY ("reviewedBy") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- PostgreSQL partial unique indexes prevent duplicate active applications
-- while allowing a new application after a rejection.
CREATE UNIQUE INDEX "RestaurantApplication_one_active_per_applicant_idx"
  ON "RestaurantApplication"("applicantId")
  WHERE "status" IN ('PENDING', 'APPROVED');
CREATE UNIQUE INDEX "RiderApplication_one_active_per_applicant_idx"
  ON "RiderApplication"("applicantId")
  WHERE "status" IN ('PENDING', 'APPROVED');
