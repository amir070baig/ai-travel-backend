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
  advanceAmount,
}: BookingInput) => {
  let amount = 1000;

  if (tourId) {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      throw new Error("Tour not found");
    }

    amount = tour.price;
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

      requestId: requestId || null,

      advanceAmount: advanceAmount || amount,

      status: tourId
        ? "CONFIRMED"
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
      subject: "Booking Confirmation - AI Travel Planner",
      html: `
        <h1>Booking Confirmed ✅</h1>
        <p>Your booking has been received successfully.</p>
        <p>Our travel team will contact you shortly.</p>
        <p>Thank you for choosing AI Travel Planner.</p>
      `,
    });
  }

  // 4. Return the original booking data to the caller
  return booking;
};
