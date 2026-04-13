import { Router } from "express";
import { getAdminItineraries } from "./itinerary.controller";

const router = Router();

router.get("/admin", getAdminItineraries);

export default router;