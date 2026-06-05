import { Request, Response } from "express";
import { createBooking } from "./booking.service";
import { prisma } from "../../shared/prisma/client";
import { sendEmail } from "../../shared/email";
import {bookingSchema} from "../../validations/booking.validation";

export const create = async (req: Request, res: Response) => {
  try {

    const parsed =
      bookingSchema.safeParse(
        req.body
      );

    if (!parsed.success) {

      return res.status(400).json({
        message:
          "Invalid booking data",

        errors:
          parsed.error.flatten(),
      });

    }
    
    const {
      itineraryId,
      requestId,
      tourId,
      travelDate,
      timeSlot,
      travelers,
      advanceAmount,
    } = parsed.data;

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

    console.log(
      "BOOKING BODY:",
      req.body
    );
    const booking = await createBooking({
      userId,
      itineraryId,
      requestId,
      tourId,
      travelDate:
        travelDate
          ? new Date(travelDate)
          : undefined,
      timeSlot,
      travelers,
      advanceAmount
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
        request: true,
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

    if (status === "CONFIRMED") {

    const updatedBooking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },

        include: {
          user: true,
          request: true,
        },
      });

    if (updatedBooking?.user?.email) {

      await sendEmail({
        to: updatedBooking.user.email,

        subject:
          "Booking Confirmed 🎉",

        html: `
          <h1>
            Booking Confirmed
          </h1>

          <p>
            Your travel booking has been officially confirmed.
          </p>

          <p>
            Our travel team looks forward to hosting your experience.
          </p>
        `,
      });

    }

  }

    return res.json(booking);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({
      message: "Failed to update booking",
    });
  }
};


export const updateTravelDate = async (
  req: Request,
  res: Response
) => {
  try {

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const { travelDate } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Invalid booking id",
      });
    }

    if (!travelDate) {
      return res.status(400).json({
        message: "travelDate is required",
      });
    }

    const booking =
      await prisma.booking.update({
        where: { id },

        data: {
          travelDate: new Date(
            travelDate
          ),
        },
      });

    res.json(booking);

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to update travel date",
    });

  }
};
