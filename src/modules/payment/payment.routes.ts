import { Router } from "express";
import {razorpayWebhook} from "./payment.webhook";

import {
  createOrder,
  verifyPayment,
} from "./payment.controller";

const router = Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.post("/webhook", razorpayWebhook);

export default router;