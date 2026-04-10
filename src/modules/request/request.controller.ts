import { Request, Response } from "express";
import { createRequest } from "./request.service";

export const submitRequest = async (req: Request, res: Response) => {
  try {
    const { itineraryId } = req.body;

    // TEMP: hardcoded user
    const userId = "test-user-id";

    const request = await createRequest(userId, itineraryId);

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Error creating request" });
  }
};