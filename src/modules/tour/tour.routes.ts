import { Router } from "express";
import { prisma } from "../../shared/prisma/client";

const router = Router();

// GET all tours
router.get("/", async (req, res) => {
  const tours = await (prisma as any).tour.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(tours);
});

// CREATE tour (for now open, later admin only)
router.post("/", async (req, res) => {
  const { title, description, price } = req.body;

  const tour = await (prisma as any).tour.create({
    data: { title, description, price },
  });

  res.json(tour);
});

export default router;