import { Router } from "express";
import { prisma } from "../../shared/prisma/client";
import { getTourById } from "./tour.controller"; 
import {
  createTour,
  updateTour,
  deleteTour,
} from "./tour.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

const router = Router();

// GET all tours
router.get("/", async (req, res) => {
  const tours = await (prisma as any).tour.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(tours);
});

// GET single tour by ID
router.get(
  "/:id",
  getTourById
);

// CREATE tour (for now open, later admin only)
// router.post("/", async (req, res) => {
//   const {
//     title,
//     description,
//     price,
//     imageUrl,
//     gallery,
//     highlights,
//     inclusions,
//     exclusions,
//     duration,
//     pickupPoint,
//   } = req.body;

//   const tour = await (prisma as any).tour.create({
//     data: { title, description, price, imageUrl, gallery, highlights, inclusions, exclusions, duration, pickupPoint },
//   });

//   res.json(tour);
// });

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createTour
);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateTour
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteTour
);

export default router;