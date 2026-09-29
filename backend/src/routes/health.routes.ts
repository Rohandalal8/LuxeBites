import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      service: "cravio-api",
      timestamp: new Date().toISOString(),
    },
  });
});

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: "Cravio API",
      version: "1.0.0",
      status: "online",
    },
  });
});

export default router;
