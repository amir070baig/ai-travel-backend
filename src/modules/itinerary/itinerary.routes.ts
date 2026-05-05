import { Router } from "express";
import { getAdminItineraries, getMyItinerariesController, saveItineraryController } from "./itinerary.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/admin", getAdminItineraries);
router.get("/my", authMiddleware, getMyItinerariesController);
router.post("/save", authMiddleware, saveItineraryController);

export default router;