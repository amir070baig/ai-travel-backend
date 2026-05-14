import { Request, Response } from "express";
import { createBooking } from "./booking.service";
import { prisma } from "../../shared/prisma/client";

export const create = async (req: Request, res: Response) => {
  try {
    const { itineraryId, requestId, tourId, travelDate, timeSlot, travelers } = req.body;

    const userId = (req as any).user.userId;

    // ✅ BASIC VALIDATION
    if (!itineraryId && !tourId) {
      return res.status(400).json({
        message: "Either itineraryId or tourId is required",
      });
    }

    if (itineraryId && tourId) {
      return res.status(400).json({
        message: "Send only one: itineraryId OR tourId",
      });
    }

    // ✅ FIX: Passed variables inside a single object argument
    const booking = await createBooking({
      userId,
      itineraryId,
      requestId,
      tourId,
      travelDate,
      timeSlot,
      travelers
    });

    return res.json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    return res.status(500).json({ message: "Booking error" });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        tour: true,       
        itinerary: true,  
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookings);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({
        message: "Both bookingId and status are required",
      });
    }

    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status,
      },
    });

    return res.json(booking);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({
      message: "Failed to update booking",
    });
  }
};
