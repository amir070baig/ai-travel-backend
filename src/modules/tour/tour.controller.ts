import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define a strict interface for route params
interface TourParams {
  id: string;
}

export const getTourById = async (
  req: Request<TourParams>, 
  res: Response
) => {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id: req.params.id, 
      },
    });

    if (!tour) {
      res.status(404).json({ message: "Tour not found" });
      return;
    }

    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tour" });
  }
};

export const createTour = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      gallery,
      highlights,
      inclusions,
      exclusions,
      duration,
      pickupPoint,
    } = req.body;

    const tour = await prisma.tour.create({
      data: {
        title,
        description,
        price: Number(price),
        imageUrl,
        gallery, 
        highlights,
        inclusions,
        exclusions,
        duration,
        pickupPoint,
      },
    });

    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create tour" });
  }
};

export const updateTour = async (
  req: Request<TourParams>, // Fixes the string[] type error
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      imageUrl,
      gallery,
      highlights,
      inclusions,
      exclusions,
      duration,
      pickupPoint,
    } = req.body;

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        title,
        description,
        price: Number(price),
        imageUrl,
        gallery, 
        highlights,
        inclusions,
        exclusions,
        duration,
        pickupPoint,
      },
    });

    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update tour" });
  }
};

export const deleteTour = async (
  req: Request<TourParams>, // Fixes the string[] type error
  res: Response
) => {
  try {
    const { id } = req.params;

    await prisma.tour.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete tour" });
  }
};
