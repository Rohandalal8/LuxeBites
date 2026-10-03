CREATE TYPE "VehicleType" AS ENUM ('BIKE', 'SCOOTER', 'CAR');
CREATE TYPE "DeliveryTaskStatus" AS ENUM ('SEARCHING_RIDER', 'RIDER_ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "Rider" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "vehicleType" "VehicleType" NOT NULL,
  "vehicleNumber" TEXT NOT NULL,
  "licenseNumber" TEXT NOT NULL,
  "isOnline" BOOLEAN NOT NULL DEFAULT false,
  "isAvailable" BOOLEAN NOT NULL DEFAULT false,
  "currentLatitude" DOUBLE PRECISION,
  "currentLongitude" DOUBLE PRECISION,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalDeliveries" INTEGER NOT NULL DEFAULT 0,
  "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Rider_userId_key" ON "Rider"("userId");
CREATE INDEX "Rider_isOnline_isAvailable_idx" ON "Rider"("isOnline", "isAvailable");
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "DeliveryTask" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "riderId" TEXT,
  "status" "DeliveryTaskStatus" NOT NULL DEFAULT 'SEARCHING_RIDER',
  "pickupLatitude" DOUBLE PRECISION,
  "pickupLongitude" DOUBLE PRECISION,
  "deliveryLatitude" DOUBLE PRECISION,
  "deliveryLongitude" DOUBLE PRECISION,
  "assignedAt" TIMESTAMP(3),
  "pickedUpAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DeliveryTask_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "DeliveryTask_orderId_key" ON "DeliveryTask"("orderId");
CREATE INDEX "DeliveryTask_riderId_status_idx" ON "DeliveryTask"("riderId", "status");
CREATE INDEX "DeliveryTask_status_idx" ON "DeliveryTask"("status");
ALTER TABLE "DeliveryTask" ADD CONSTRAINT "DeliveryTask_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeliveryTask" ADD CONSTRAINT "DeliveryTask_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "RestaurantPayout" (
  "id" TEXT NOT NULL,
  "restaurantId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RestaurantPayout_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "RestaurantPayout_restaurantId_createdAt_idx" ON "RestaurantPayout"("restaurantId", "createdAt");
ALTER TABLE "RestaurantPayout" ADD CONSTRAINT "RestaurantPayout_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "RiderEarning" (
  "id" TEXT NOT NULL,
  "riderId" TEXT NOT NULL,
  "deliveryTaskId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RiderEarning_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RiderEarning_deliveryTaskId_key" ON "RiderEarning"("deliveryTaskId");
CREATE INDEX "RiderEarning_riderId_createdAt_idx" ON "RiderEarning"("riderId", "createdAt");
ALTER TABLE "RiderEarning" ADD CONSTRAINT "RiderEarning_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "RestaurantApplication" (
  "id" TEXT NOT NULL,
  "applicantId" TEXT NOT NULL,
  "restaurantId" TEXT,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RestaurantApplication_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RestaurantApplication_restaurantId_key" ON "RestaurantApplication"("restaurantId");
CREATE INDEX "RestaurantApplication_applicantId_status_idx" ON "RestaurantApplication"("applicantId", "status");
ALTER TABLE "RestaurantApplication" ADD CONSTRAINT "RestaurantApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RestaurantApplication" ADD CONSTRAINT "RestaurantApplication_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "RiderApplication" (
  "id" TEXT NOT NULL,
  "applicantId" TEXT NOT NULL,
  "vehicleType" "VehicleType" NOT NULL,
  "vehicleNumber" TEXT NOT NULL,
  "licenseNumber" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RiderApplication_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RiderApplication_applicantId_key" ON "RiderApplication"("applicantId");
CREATE INDEX "RiderApplication_status_idx" ON "RiderApplication"("status");
ALTER TABLE "RiderApplication" ADD CONSTRAINT "RiderApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
