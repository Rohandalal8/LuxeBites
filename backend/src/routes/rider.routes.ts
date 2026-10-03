import { DeliveryTaskStatus, UserRole, VehicleType } from "@prisma/client";
import { Router } from "express";

import prisma from "../config/prisma.js";
import { requireAuth, requireCustomer, requireRider } from "../middleware/auth.js";

const router = Router();

router.post("/apply", requireAuth, requireCustomer, async (req, res, next) => {
  try {
    const vehicleType = req.body?.vehicleType as VehicleType;
    const vehicleNumber = typeof req.body?.vehicleNumber === "string" ? req.body.vehicleNumber.trim() : "";
    const licenseNumber = typeof req.body?.licenseNumber === "string" ? req.body.licenseNumber.trim() : "";
    const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
    const address = typeof req.body?.address === "string" ? req.body.address.trim() : "";

    if (!Object.values(VehicleType).includes(vehicleType) || !vehicleNumber || !licenseNumber || !phone || !address) {
      res.status(400).json({ success: false, message: "Complete rider application details are required.", code: "INVALID_APPLICATION" });
      return;
    }

    const application = await prisma.riderApplication.upsert({
      where: { applicantId: req.user!.id },
      update: { vehicleType, vehicleNumber, licenseNumber, phone, address, status: "PENDING" },
      create: { applicantId: req.user!.id, vehicleType, vehicleNumber, licenseNumber, phone, address },
    });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, requireRider, async (req, res, next) => {
  try {
    const rider = await prisma.rider.findUnique({ where: { userId: req.user!.id } });
    if (!rider) {
      res.status(404).json({ success: false, message: "Rider profile not found.", code: "RIDER_NOT_FOUND" });
      return;
    }
    res.status(200).json({ success: true, data: rider });
  } catch (error) {
    next(error);
  }
});

router.patch("/availability", requireAuth, requireRider, async (req, res, next) => {
  try {
    const isOnline = req.body?.isOnline === true;
    const rider = await prisma.rider.update({
      where: { userId: req.user!.id },
      data: { isOnline, isAvailable: isOnline },
    });
    res.status(200).json({ success: true, data: rider });
  } catch (error) {
    next(error);
  }
});

router.get("/deliveries", requireAuth, requireRider, async (req, res, next) => {
  try {
    const rider = await prisma.rider.findUnique({ where: { userId: req.user!.id } });
    if (!rider) {
      res.status(404).json({ success: false, message: "Rider profile not found.", code: "RIDER_NOT_FOUND" });
      return;
    }
    const tasks = await prisma.deliveryTask.findMany({
      where: { OR: [{ riderId: rider.id }, { riderId: null, status: DeliveryTaskStatus.SEARCHING_RIDER }] },
      include: { order: { include: { restaurant: true, address: true, items: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
});

router.post("/deliveries/:id/accept", requireAuth, requireRider, async (req, res, next) => {
  try {
    const taskId = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    const rider = await prisma.rider.findUnique({ where: { userId: req.user!.id } });
    if (!rider || !rider.isOnline || !rider.isAvailable) {
      res.status(409).json({ success: false, message: "Rider must be online and available.", code: "RIDER_UNAVAILABLE" });
      return;
    }

    const task = await prisma.$transaction(async (transaction) => {
      const current = await transaction.deliveryTask.findUnique({ where: { id: taskId } });
      if (!current || current.status !== DeliveryTaskStatus.SEARCHING_RIDER || current.riderId) return null;
      await transaction.rider.update({ where: { id: rider.id }, data: { isAvailable: false } });
      return transaction.deliveryTask.update({ where: { id: taskId }, data: { riderId: rider.id, status: DeliveryTaskStatus.RIDER_ASSIGNED, assignedAt: new Date() } });
    });

    if (!task) {
      res.status(409).json({ success: false, message: "This delivery is no longer available.", code: "DELIVERY_TAKEN" });
      return;
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

export default router;
