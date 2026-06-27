import { Router } from "express";

import {
  createReview,
  getTourReviews,
  getItineraryReviews,
  getFeaturedAIReviews
} from "./review.controller";

import { authMiddleware } from "../../middleware/auth.middleware"


const router = Router();

router.post(
  "/",
  authMiddleware,
  createReview
);

router.get(
  "/ai",
  getFeaturedAIReviews
);

router.get(
  "/itinerary/:itineraryId",
  getItineraryReviews
);

router.get(
  "/:tourId",
  getTourReviews
);

export default router;