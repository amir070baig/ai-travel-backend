import { Request, Response } from "express";
import { generateItinerary } from "./ai.service";

export const generate = async (req: Request, res: Response) => {
  try {
    const content = await generateItinerary(req.body);

    res.json({
      content,
    });

  } catch (err) {
    console.error("AI ERROR:", err);

    res.status(500).json({
      message: "AI error",
    });
  }
};