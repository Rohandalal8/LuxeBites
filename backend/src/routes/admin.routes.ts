import { ApplicationStatus, UserRole } from "@prisma/client";
import { Router } from "express";

import prisma from "../config/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/applications", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const [restaurants, riders] = await Promise.all([
      prisma.restaurantApplication.findMany({ include: { applicant: true, restaurant: true }, orderBy: { createdAt: "desc" } }),
      prisma.riderApplication.findMany({ include: { applicant: true }, orderBy: { createdAt: "desc" } }),
    ]);
    res.status(200).json({ success: true, data: { restaurants, riders } });
  } catch (error) {
    next(error);
  }
});

router.patch("/rider-applications/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const status = req.body?.status as ApplicationStatus;
    if (status !== ApplicationStatus.APPROVED && status !== ApplicationStatus.REJECTED) {
      res.status(400).json({ success: false, message: "Approval status is required.", code: "INVALID_STATUS" });
      return;
    }
    const applicationId = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    const result = await prisma.$transaction(async (transaction) => {
      const application = await transaction.riderApplication.findUnique({ where: { id: applicationId } });
      if (!application) return null;
      await transaction.riderApplication.update({ where: { id: application.id }, data: { status } });
      if (status === ApplicationStatus.APPROVED) {
        await transaction.user.update({ where: { id: application.applicantId }, data: { role: UserRole.RIDER } });
        await transaction.rider.upsert({
          where: { userId: application.applicantId },
          update: { vehicleType: application.vehicleType, vehicleNumber: application.vehicleNumber, licenseNumber: application.licenseNumber },
          create: { userId: application.applicantId, vehicleType: application.vehicleType, vehicleNumber: application.vehicleNumber, licenseNumber: application.licenseNumber },
        });
      }
      return application;
    });
    if (!result) {
      res.status(404).json({ success: false, message: "Rider application not found.", code: "APPLICATION_NOT_FOUND" });
      return;
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.patch("/restaurant-applications/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const status = req.body?.status as ApplicationStatus;
    if (status !== ApplicationStatus.APPROVED && status !== ApplicationStatus.REJECTED) {
      res.status(400).json({ success: false, message: "Approval status is required.", code: "INVALID_STATUS" });
      return;
    }
    const applicationId = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    const result = await prisma.$transaction(async (transaction) => {
      const application = await transaction.restaurantApplication.findUnique({ where: { id: applicationId } });
      if (!application) return null;
      const updated = await transaction.restaurantApplication.update({ where: { id: application.id }, data: { status } });
      if (status === ApplicationStatus.APPROVED) {
        const slug = `${application.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${application.id.slice(-6)}`;
        const restaurant = await transaction.restaurant.create({ data: { ownerId: application.applicantId, name: application.name, slug, phone: application.phone, email: application.email, address: application.address } });
        await transaction.restaurantApplication.update({ where: { id: application.id }, data: { restaurantId: restaurant.id } });
        await transaction.user.update({ where: { id: application.applicantId }, data: { role: UserRole.RESTAURANT_OWNER } });
      }
      return updated;
    });
    if (!result) {
      res.status(404).json({ success: false, message: "Restaurant application not found.", code: "APPLICATION_NOT_FOUND" });
      return;
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get("/users", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }, orderBy: { createdAt: "desc" } });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const userId = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    if (userId === req.user!.id) {
      res.status(400).json({ success: false, message: "You cannot change your own account status.", code: "SELF_STATUS_CHANGE" });
      return;
    }
    const status = req.body?.status === "SUSPENDED" ? "SUSPENDED" : req.body?.status === "ACTIVE" ? "ACTIVE" : null;
    if (!status) {
      res.status(400).json({ success: false, message: "A valid account status is required.", code: "INVALID_STATUS" });
      return;
    }
    const user = await prisma.user.update({ where: { id: userId }, data: { status } });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
