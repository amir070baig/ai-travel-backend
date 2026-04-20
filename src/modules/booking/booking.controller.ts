import { Request, Response } from "express";
import { createBooking } from "./booking.service";

export const create = async (req: Request, res: Response) => {
  try {
    const { itineraryId, requestId } = req.body;

    const userId = (req as any).user.userId;

    const booking = await createBooking(userId, itineraryId, requestId);

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Booking error" });
  }
};