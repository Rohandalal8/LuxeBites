import { ApplicationStatus, OrderStatus, UserRole } from "@prisma/client";
import { Router } from "express";

import prisma from "../config/prisma.js";
import { requireAuth, requireRestaurantOwner } from "../middleware/auth.js";
import { requireCustomer } from "../middleware/auth.js";

const router = Router();
const transitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PLACED: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.READY],
};

router.post("/apply", requireAuth, requireCustomer, async (req, res, next) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    const address = typeof req.body?.address === "string" ? req.body.address.trim() : "";
    if (!name || !phone || !email || !address) {
      res.status(400).json({ success: false, message: "Complete restaurant application details are required.", code: "INVALID_APPLICATION" });
      return;
    }
    const application = await prisma.restaurantApplication.create({ data: { applicantId: req.user!.id, name, phone, email, address } });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

router.get("/orders", requireAuth, requireRestaurantOwner, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { restaurant: { ownerId: req.user!.id } },
      include: { restaurant: true, items: true, address: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.patch("/orders/:id/status", requireAuth, requireRestaurantOwner, async (req, res, next) => {
  try {
    const orderId = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
    const status = req.body?.status as OrderStatus;
    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ success: false, message: "Invalid order status.", code: "INVALID_STATUS" });
      return;
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, restaurant: { ownerId: req.user!.id } },
    });
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found.", code: "ORDER_NOT_FOUND" });
      return;
    }

    if (!transitions[order.status]?.includes(status)) {
      res.status(409).json({ success: false, message: `Cannot move an order from ${order.status} to ${status}.`, code: "INVALID_STATUS_TRANSITION" });
      return;
    }

    const updatedOrder = await prisma.order.update({ where: { id: order.id }, data: { status } });
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
});

export default router;