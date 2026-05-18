import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// 1. Import your tour validation schema
import { tourSchema } from "../../validations/tour.validation";

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
    // 2. Coerce price string to number before running safeParse if it comes from a form-data request
    const bodyToValidate = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
    };

    const parsed = tourSchema.safeParse(bodyToValidate);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid tour data",
        errors: parsed.error.flatten(),
      });
    }

    // 3. Use clean validated data
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
    } = parsed.data;

    const tour = await prisma.tour.create({
      data: {
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
      },
    });

    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create tour" });
  }
};

export const updateTour = async (
  req: Request<TourParams>, 
  res: Response
) => {
  try {
    const { id } = req.params;

    // 4. Coerce price string to number for updates as well
    const bodyToValidate = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
    };

    const parsed = tourSchema.safeParse(bodyToValidate);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid tour data",
        errors: parsed.error.flatten(),
      });
    }

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
    } = parsed.data;

    const tour = await prisma.tour.update({
      where: { id },
      data: {
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
      },
    });

    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update tour" });
  }
};

export const deleteTour = async (
  req: Request<TourParams>, 
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
