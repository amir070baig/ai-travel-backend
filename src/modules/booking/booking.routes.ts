import { Router } from "express";
import { create, updateTravelDate, requestRefund } from "./booking.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMyBookings } from "./booking.controller";
import { updateBookingStatus } from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getMyBookings);
router.patch("/status", authMiddleware, updateBookingStatus);
router.patch("/:id/request-refund", authMiddleware, requestRefund);
router.patch("/:id/travel-date", authMiddleware, updateTravelDate );

export default router;