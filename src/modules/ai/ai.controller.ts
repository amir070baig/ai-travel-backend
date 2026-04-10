import { Request, Response } from "express";
import { generateItinerary } from "./ai.service";
import { saveItinerary } from "./ai.service";

export const generate = async (req: Request, res: Response) => {
  try {
    const content = await generateItinerary(req.body);

    const itinerary = await saveItinerary(req.body, content);

    res.json({ itinerary });
  } catch (err) {
    res.status(500).json({ message: "AI error" });
  }
};