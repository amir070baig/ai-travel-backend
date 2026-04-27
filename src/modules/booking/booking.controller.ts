import { Request, Response } from "express";
import { createBooking } from "./booking.service";
import { prisma } from "../../shared/prisma/client";

export const create = async (req: Request, res: Response) => {
  try {
    const { itineraryId, requestId } = req.body;

    const userId = (req as any).user.userId;

    // ✅ BASIC VALIDATION
    if (!itineraryId) {
      return res.status(400).json({ message: "itineraryId required" });
    }

    const booking = await createBooking(userId, itineraryId, requestId);

    res.json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: "Booking error" });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};