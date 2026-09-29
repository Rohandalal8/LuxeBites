import type { NextFunction, Request, Response } from "express";

import admin from "../config/firebase.js";
import prisma from "../config/prisma.js";

type AuthenticatedUser = {
  id: string;
  role: string;
  firebaseUid?: string;
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

    req.user = {
      id: user.id,
      role: user.role,
      firebaseUid: user.firebaseUid ?? decodedToken.uid,
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

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentRole = req.user?.role;

    if (!currentRole || !roles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
        code: "FORBIDDEN",
      });
    }

    return next();
  };
}
