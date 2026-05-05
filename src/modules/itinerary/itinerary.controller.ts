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


export const saveItineraryController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { content, days, budget, groupSize } = req.body;

    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        sourceType: "AI",
        city: "Agra",
        days,
        budget,
        groupSize,
        contentJson: content,
      },
    });

    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ message: "Error saving itinerary" });
  }
};