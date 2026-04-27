import { Router } from "express";
import { create } from "./booking.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMyBookings } from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getMyBookings);

export default router;