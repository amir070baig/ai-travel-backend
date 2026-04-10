import { Router } from "express";
import { initiatePayment } from "./payment.controller";

const router = Router();

router.post("/initiate", initiatePayment);

export default router;