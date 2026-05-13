import { Router } from "express";
import { prisma } from "../../shared/prisma/client";
import { getTourById } from "./tour.controller"; 
import {
  createTour,
  updateTour,
  deleteTour,
} from "./tour.controller";

const router = Router();

// GET all tours
router.get("/", async (req, res) => {
  const tours = await (prisma as any).tour.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(tours);
});

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

router.get("/:id", getTourById);

router.post("/", createTour);

router.patch("/:id", updateTour);

router.delete("/:id", deleteTour);

export default router;