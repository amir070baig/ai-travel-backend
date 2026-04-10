import { Router } from "express";
import { create } from "./booking.controller";

const router = Router();

router.post("/", create);

export default router;