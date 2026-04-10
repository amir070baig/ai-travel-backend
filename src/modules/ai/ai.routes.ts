import { Router } from "express";
import { generate } from "./ai.controller";

const router = Router();

router.post("/generate-itinerary", generate);

export default router;