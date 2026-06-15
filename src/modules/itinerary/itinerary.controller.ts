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
    console.log(
      "SAVE BODY",
      req.body
    );
    const {
      content,
      days,
      budget,
      groupSize,
      city,
      travelStyle,
    } = req.body;

    const itineraryTitle =
      `Agra ${days}-Day ${travelStyle || "Personalized"} Journey`;

    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        sourceType: "AI",

        title: itineraryTitle,

        city: "Agra",

        days,
        budget,
        groupSize,

        contentJson: content,
      },
    });

    res.json(itinerary);
  } catch (err) {

    console.error(
      "SAVE ITINERARY ERROR:",
      err
    );

    res.status(500).json({
      message: "Error saving itinerary"
    });

  }
};

export const deleteItineraryController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Invalid itinerary id" });
    }

    // 🔒 important: ensure user owns this itinerary
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    await prisma.itinerary.delete({
      where: { id },
    });

    return res.json({ message: "Itinerary deleted successfully" });

  } catch (err) {
    console.error("DELETE ITINERARY ERROR:", err);
    res.status(500).json({ message: "Error deleting itinerary" });
  }
};