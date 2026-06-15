import { Router } from "express";
import { getAdminItineraries, getMyItinerariesController, saveItineraryController,   deleteItineraryController,}from "./itinerary.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/admin", getAdminItineraries);
router.get("/my", authMiddleware, getMyItinerariesController);
router.post("/save", authMiddleware, saveItineraryController);
router.delete("/delete/:id", authMiddleware, deleteItineraryController);
export default router;