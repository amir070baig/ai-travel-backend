import { Router } from "express";

import {
  createReview,
  getTourReviews,
} from "./review.controller";

import { authMiddleware } from "../../middleware/auth.middleware"

const router = Router();

router.post(
  "/",
  authMiddleware,
  createReview
);

router.get(
  "/:tourId",
  getTourReviews
);

export default router;