import { Request, Response } from "express";
import { generateItinerary } from "./ai.service";
// 1. Import your AI validation schema
import { aiGenerationSchema } from "../../validations/ai.validation";

export const generate = async (req: Request, res: Response) => {
  try {
    // 2. Validate the incoming prompt payload
    const parsed = aiGenerationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid AI generation data",
        errors: parsed.error.flatten(),
      });
    }

    // 3. Pass the clean, validated data to your service layer
    const content = await generateItinerary(parsed.data);

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
