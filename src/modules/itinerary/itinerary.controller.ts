import { Request, Response } from "express";
import { prisma } from "../../shared/prisma/client";

export const getAdminItineraries = async (req: Request, res: Response) => {
  try {
    const itineraries = await prisma.itinerary.findMany({
      where: {
        sourceType: "ADMIN",
      },
    });

    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching itineraries" });
  }
};