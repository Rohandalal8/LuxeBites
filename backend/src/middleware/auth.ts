import type { NextFunction, Request, Response } from "express";

import admin from "../config/firebase.js";
import prisma from "../config/prisma.js";
import type { UserRole } from "@prisma/client";

type AuthenticatedUser = {
  id: string;
  firebaseUid?: string;
  role: UserRole;
  status: "ACTIVE" | "SUSPENDED";
};

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
      code: "UNAUTHORIZED",
    });
  }

  const idToken = authHeader.replace("Bearer ", "").trim();

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not synced to the platform.",
        code: "USER_NOT_FOUND",
      });
    }

    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        success: false,
        message: "This account is suspended.",
        code: "ACCOUNT_SUSPENDED",
      });
    }

    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid ?? decodedToken.uid,
      role: user.role,
      status: user.status,
    } satisfies AuthenticatedUser;

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired Firebase token.",
      code: "INVALID_TOKEN",
      ...(process.env.NODE_ENV !== "production" ? { debug: (error as Error).message } : {}),
    });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
        code: "FORBIDDEN",
      });
    }

    return next();
  };
}

export const requireCustomer = requireRole("CUSTOMER");
export const requireRestaurantOwner = requireRole("RESTAURANT_OWNER");
export const requireRider = requireRole("RIDER");
export const requireAdmin = requireRole("ADMIN");
