import { OrderStatus, Prisma } from "@prisma/client";

import prisma from "../config/prisma.js";

type CheckoutItem = {
  menuItemId: string;
  quantity: number;
};

type CreateOrderInput = {
  userId: string;
  items: CheckoutItem[];
  address: string;
};

export async function createOrder(input: CreateOrderInput) {
  if (!input.items.length) {
    throw Object.assign(new Error("Cart is empty."), { statusCode: 400, code: "EMPTY_CART" });
  }

  const quantities = new Map<string, number>();
  for (const item of input.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
      throw Object.assign(new Error("Each item quantity must be between 1 and 50."), { statusCode: 400, code: "INVALID_QUANTITY" });
    }
    quantities.set(item.menuItemId, (quantities.get(item.menuItemId) ?? 0) + item.quantity);
  }

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: [...quantities.keys()] }, isAvailable: true },
    include: { restaurant: true },
  });

  if (menuItems.length !== quantities.size) {
    throw Object.assign(new Error("One or more menu items are unavailable."), { statusCode: 409, code: "ITEM_UNAVAILABLE" });
  }

  const restaurantIds = new Set(menuItems.map((item) => item.restaurantId));
  if (restaurantIds.size !== 1) {
    throw Object.assign(new Error("An order can contain items from one restaurant only."), { statusCode: 400, code: "MULTIPLE_RESTAURANTS" });
  }

  const restaurant = menuItems[0].restaurant;
  if (!restaurant.isActive || !restaurant.isOpen) {
    throw Object.assign(new Error("This restaurant is currently unavailable."), { statusCode: 409, code: "RESTAURANT_UNAVAILABLE" });
  }

  const subtotal = menuItems.reduce((sum, item) => {
    const unitPrice = item.discountPrice ?? item.price;
    return sum + unitPrice * (quantities.get(item.id) ?? 0);
  }, 0);
  const deliveryFee = 49;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + tax;

  return prisma.$transaction(async (transaction) => {
    const address = await transaction.address.create({
      data: {
        userId: input.userId,
        label: "Checkout address",
        fullAddress: input.address.trim(),
        city: restaurant.city ?? "Unknown",
        state: restaurant.state ?? "Unknown",
        pincode: restaurant.pincode ?? "000000",
      },
    });

    return transaction.order.create({
      data: {
        userId: input.userId,
        restaurantId: restaurant.id,
        addressId: address.id,
        subtotal,
        deliveryFee,
        tax,
        total,
        status: OrderStatus.PLACED,
        items: {
          create: menuItems.map((item) => {
            const quantity = quantities.get(item.id) ?? 0;
            const price = item.discountPrice ?? item.price;
            return {
              menuItemId: item.id,
              name: item.name,
              price,
              quantity,
              subtotal: price * quantity,
            };
          }),
        },
      },
      include: { restaurant: true, items: true, address: true },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
