import { Router } from "express";

const router = Router();

const createOrderNumber = () => `LB-${Date.now().toString().slice(-6)}`;

router.post("/orders", (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const customerName = typeof req.body?.customerName === "string" ? req.body.customerName : "Guest";
  const address = typeof req.body?.address === "string" ? req.body.address : "Delivery address";
  const restaurantName = typeof req.body?.restaurantName === "string" ? req.body.restaurantName : "LuxeBites Kitchen";

  if (!items.length) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty.",
    });
  }

  const subtotal = items.reduce((sum: number, item: any) => {
    const price = Number(item?.price ?? 0);
    const quantity = Number(item?.quantity ?? 1);
    return sum + price * quantity;
  }, 0);

  const deliveryFee = subtotal > 0 ? 49 : 0;
  const total = subtotal + deliveryFee;

  const order = {
    orderNumber: createOrderNumber(),
    restaurantName,
    customerName,
    address,
    items,
    subtotal,
    deliveryFee,
    total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json({
    success: true,
    data: order,
  });
});

export default router;
