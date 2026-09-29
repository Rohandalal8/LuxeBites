import { Router } from "express";

import { listRestaurants } from "../services/restaurant.service.js";

const router = Router();

router.get("/restaurants", (req, res) => {
  const restaurants = listRestaurants({
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    cuisine: typeof req.query.cuisine === "string" ? req.query.cuisine : undefined,
    rating: typeof req.query.rating === "string" ? Number(req.query.rating) : undefined,
    vegOnly: req.query.veg === "true",
  });

  res.status(200).json({
    success: true,
    data: restaurants,
  });
});

export default router;
