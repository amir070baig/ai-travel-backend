import { Router } from "express";
import { create, updateTravelDate, requestRefund, processRefundRequest, startSupplierBooking, adminCancelBooking} from "./booking.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { getMyBookings } from "./booking.controller";
import { updateBookingStatus } from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getMyBookings);
router.patch("/status", authMiddleware, updateBookingStatus);
router.patch("/:id/request-refund", authMiddleware, requestRefund);
router.patch("/refund/process", authMiddleware, adminMiddleware, processRefundRequest);
router.patch("/:id/travel-date", authMiddleware, updateTravelDate );
router.patch("/supplier-booking", authMiddleware, adminMiddleware, startSupplierBooking);
router.patch("/admin-cancel", authMiddleware, adminMiddleware, adminCancelBooking);

export default router;