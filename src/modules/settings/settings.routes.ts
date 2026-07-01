import { Router } from "express";
import {
  getSettings,
  toggleAIBookings,
} from "./settings.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getSettings
);

router.patch(
  "/ai-bookings",
  authMiddleware,
  adminMiddleware,
  toggleAIBookings
);

export default router;