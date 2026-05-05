import { Request, Response } from "express";
import { prisma } from "../../shared/prisma/client";
import { getMyItineraries } from "./itinerary.service";

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


export const getMyItinerariesController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const data = await getMyItineraries(userId);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching itineraries" });
  }
};