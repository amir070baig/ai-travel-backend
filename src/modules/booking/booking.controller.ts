import { Request, Response } from "express";
import { createBooking } from "./booking.service";
import { prisma } from "../../shared/prisma/client";
import { sendEmail } from "../../shared/email";
import {bookingSchema} from "../../validations/booking.validation";
import { createNotification, notifyAdmins } from "../notification/notification.service";

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
      guideLanguage,
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
      guideLanguage,
      advanceAmount
    });

      return res.json({
        message: "Booking successful",
        booking,
      });
    } catch (err: any) {

      console.error(
        "BOOKING ERROR:",
        err
      );

      return res.status(400).json({
        message:
          err.message ||
          "Booking error",
      });

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

export const requestRefund = async (req: Request,res: Response) => {
  try {
    const idParam = req.params.id;

    const bookingId = Array.isArray(idParam)
      ? idParam[0]
      : idParam;

    if (!bookingId) {
    return res.status(400).json({
      message: "Invalid booking id",
    });
  }
    const userId = (req as any).user.userId;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        request: true,
        user: true,
        tour: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (booking.refundRejectedAt) {
      return res.status(400).json({
        message:
          "Refund request has already been reviewed",
      });
    }

    if (booking.paymentStatus !== "PAID") {
      return res.status(400).json({
        message:
          "Only paid bookings can request refunds",
      });
    }

    if (booking.status === "REFUND_PENDING") {
      return res.status(400).json({
        message:
          "Refund request already exists",
      });
    }

    if (booking.status === "REFUNDED") {
      return res.status(400).json({
        message:
          "Booking already refunded",
      });
    }

    if (booking.status !== "CONFIRMED") {
      return res.status(400).json({
        message:
          "Only confirmed bookings can request cancellation",
      });
    }

    let refundPercentage = 0;

    // PRE-BUILT TOUR
    if (booking.tourId && booking.travelDate) {
      const hoursUntilTravel =
        (new Date(booking.travelDate).getTime() - Date.now()) /
        (1000 * 60 * 60);

      if (hoursUntilTravel >= 72) {

        refundPercentage = 100;

      } else if (
        hoursUntilTravel >= 24
      ) {

        refundPercentage = 50;

      } else {

        return res.status(400).json({
          message:
            "This booking is no longer eligible for refund under the cancellation policy.",
        });

      }
    }

    
    // AI CUSTOM TRIP
    else {

      if (
        booking.supplierBookingStarted
      ) {

        return res.status(400).json({
          message:
            "Supplier bookings have already been initiated. This booking is no longer eligible for refund.",
        });

      }

      refundPercentage = 80;

    }

    const refundAmount =
      Math.round(
        booking.advanceAmount *
        (refundPercentage / 100)
      );

    const updatedBooking =
      await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          status: "REFUND_PENDING",
          refundRequestedAt: new Date(),
          refundPercentage,
          refundAmount,
        },
      });

      await notifyAdmins(
        "Refund Request Received 💰",
        `${booking.user?.email} requested a refund.`,
        "/admin"
      );

      const admin = await prisma.user.findFirst({
        where: {
          role: "ADMIN",
        },
      });

      if (admin?.email) {

        await sendEmail({
          to: admin.email,

          subject: "Refund Request Received 💰",

          html: `
            <h1>
              Refund Request Received
            </h1>

            <p>
              A customer has submitted a refund request.
            </p>

            <p>
              Please review it in the admin dashboard.
            </p>
          `,
        });

      }

    return res.json({
      message:
        "Refund request submitted successfully",
      booking: updatedBooking,
    });

  } catch (err) {

    console.error(
      "REFUND REQUEST ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to request refund",
    });

  }
};


export const processRefundRequest = async (req: Request, res: Response) => {
  try {

    // const user = (req as any).user;

    // if (!user || user.role !== "ADMIN") {
    //   return res.status(403).json({
    //     message: "Admin access required",
    //   });
    // }

    const {
      bookingId,
      action,
    } = req.body;

    if (!bookingId || !action) {
      return res.status(400).json({
        message:
          "bookingId and action are required",
      });
    }

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found",
      });
    }

    if (
      booking.status !==
      "REFUND_PENDING"
    ) {
      return res.status(400).json({
        message:
          "Booking is not awaiting refund review",
      });
    }

    if (action === "APPROVE") {

      const updated =
        await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: "REFUNDED",
            refundProcessedAt:
              new Date(),
          },
          include: {
            user: true,
          },
        });

        await createNotification(
          updated.userId,
          "Refund Approved ✅",
          `Your refund request has been approved. Refund Amount: ₹${updated.refundAmount ?? 0}`,
          "/my-requests"
        );

        if (updated.user?.email) {

          await sendEmail({
            to: updated.user.email,

            subject: "Refund Approved ✅",

            html: `
              <h1>Refund Approved</h1>

              <p>Your refund request has been approved.</p>

              <p>
                Refund Amount:
                ₹${updated.refundAmount ?? 0}
              </p>

              <p>
                The refund has been initiated and may take
                7-10 business days depending on your bank
                and payment provider.
              </p>

              <p>
                Thank you for choosing TourGen.
              </p>
            `,
          });

        }

      return res.json(updated);
    }


    if (action === "CANCEL_NO_REFUND") {

      const updated =
        await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: "CANCELLED",
            refundProcessedAt: new Date(),
          },
          include: {
            user: true,
          },
        });

      await createNotification(
        updated.userId,
        "Booking Cancelled",
        "Your booking has been cancelled. No refund was applicable under the cancellation policy.",
        "/my-requests"
      );

      if (updated.user?.email) {

        await sendEmail({
          to: updated.user.email,

          subject: "Booking Cancelled",

          html: `
            <h1>Booking Cancelled</h1>

            <p>
              Your booking has been cancelled.
            </p>

            <p>
              According to the cancellation policy,
              no refund was applicable for this booking.
            </p>

            <p>
              If you have questions, please contact support.
            </p>
          `,
        });

      }

      return res.json(updated);
    }

    if (action === "REJECT") {

      const updated =
        await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: "CONFIRMED",
            refundRejectedAt: new Date(),
          },
          include: {
            user: true,
          },
        });

        await createNotification(
          updated.userId,
          "Refund Request Update",
          "Your refund request was not approved. Your booking remains confirmed.",
          "/my-requests"
        );

        if (updated.user?.email) {

          await sendEmail({
            to: updated.user.email,

            subject: "Refund Request Update",

            html: `
              <h1>Refund Request Update</h1>

              <p>
                After reviewing your request,
                we are unable to approve the refund.
              </p>

              <p>
                Your booking remains confirmed.
              </p>

              <p>
                If you believe there are exceptional
                circumstances, please contact support.
              </p>
            `,
          });

        }

      return res.json(updated);
    }

    return res.status(400).json({
      message:
        "Invalid action",
    });

  } catch (err) {

    console.error(
      "REFUND PROCESS ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to process refund",
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


export const startSupplierBooking = async (req: Request, res: Response) => {
  try {

    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "bookingId is required",
      });
    }

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.supplierBookingStarted) {
      return res.status(400).json({
        message:
          "Supplier booking already started",
      });
    }

    if (booking.tourId) {
      return res.status(400).json({
        message:
          "Supplier booking tracking is only for AI trips",
      });
    }

    const updated =
      await prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          supplierBookingStarted: true,
        },
        include: {
          user: true,
        },
      });

      await createNotification(
        updated.userId,
        "Travel Arrangements Started ✈️",
        "Your travel arrangements are now being finalized. Supplier bookings have been initiated and cancellation may no longer be eligible for refund.",
        "/my-bookings"
      );

      if (updated.user?.email) {

        await sendEmail({
          to: updated.user.email,

          subject:
            "Travel Arrangements Started ✈️",

          html: `
            <h1>
              Travel Arrangements Started
            </h1>

            <p>
              Your travel arrangements are now being finalized.
            </p>

            <p>
              Our team has started supplier bookings and travel coordination for your trip.
            </p>

            <p>
              As supplier bookings have now been initiated,
              cancellation may no longer be eligible for refund according to our cancellation policy.
            </p>

            <p>
              If you have any questions, please contact TourGen support.
            </p>
          `,
        });

      }

    return res.json(updated);

  } catch (err) {

    console.error(
      "SUPPLIER BOOKING ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to start supplier booking",
    });

  }
};