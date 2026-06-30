import { prisma } from "../../shared/prisma/client";
import { sendEmail } from "../../shared/email";

interface BookingInput {
  userId: string;
  itineraryId?: string;
  requestId?: string;
  tourId?: string;
  travelDate?: Date;
  timeSlot?: string;
  travelers: number;
  guideLanguage?: string;
  advanceAmount: number;
}

export const createBooking = async ({
  userId,
  itineraryId,
  requestId,
  tourId,
  travelDate,
  timeSlot,
  travelers,
  guideLanguage,
  advanceAmount,
}: BookingInput) => {
  let amount = 1000;

  if (tourId) {

    const tour =
      await prisma.tour.findUnique({
        where: {
          id: tourId,
        },
      });

    if (!tour) {
      throw new Error(
        "Tour not found"
      );
    }

    if (!tour.isActive) {

      throw new Error(
        "This tour is temporarily unavailable."
      );

    }

    if (travelDate) {

      let tourHour = 6;

      if (timeSlot === "Morning") {
        tourHour = 9;
      }

      if (timeSlot === "Afternoon") {
        tourHour = 14;
      }

      if (timeSlot === "Sunset") {
        tourHour = 17;
      }

      const selectedTourDateTime =
        new Date(
          `${travelDate.toISOString().split("T")[0]}T${String(tourHour).padStart(2, "0")}:00:00`
        );

      const hoursUntilTour =
        (
          selectedTourDateTime.getTime() -
          Date.now()
        ) /
        (1000 * 60 * 60);

      if (hoursUntilTour < 12) {
        throw new Error(
          "This tour requires at least 12 hours advance notice"
        );
      }

    }

    const totalPrice =
      tour.price * travelers;

    amount =
      Math.floor(
        totalPrice * 0.3
      );

  }

  // 1. Save the created booking to a variable
  const booking = await prisma.booking.create({
    data: {
      userId,

      itineraryId: itineraryId || null,

      tourId: tourId || null,

      travelDate,

      timeSlot,

      travelers,

      guideLanguage,

      requestId: requestId || null,

      advanceAmount:
        tourId
          ? amount
          : advanceAmount,

      // status: tourId
      //   ? "CONFIRMED"
      //   : "PENDING",
      status: tourId
      ? "PENDING_PAYMENT"
      : "PENDING",
    },
  });

  // 2. Fetch user details using the provided userId
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  // 3. Trigger email if user has a valid email address
  if (user?.email) {
    await sendEmail({
      to: user.email,

      subject:
        "Booking Request Received 📋 - TourGen",

      html: `
        <h1>
          Booking Request Received 📋
        </h1>

        <p>
          We have received your booking request.
        </p>

        <p>
          Your reservation will be confirmed only after the required advance payment is completed.
        </p>

        <p>
          Please complete payment to secure your booking.
        </p>

        <p>
          Thank you for choosing TourGen.
        </p>
      `,
    });
  }

  // 4. Return the original booking data to the caller
  return booking;
};
