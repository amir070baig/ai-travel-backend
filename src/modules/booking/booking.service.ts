import { prisma } from "../../shared/prisma/client";

export const createBooking = async (
  userId: string,
  itineraryId?: string,
  requestId?: string,
  tourId?: string
) => {
  let amount = 1000; // default for AI bookings

  // 🔥 IF TOUR BOOKING → USE REAL PRICE
  if (tourId) {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      throw new Error("Tour not found");
    }

    amount = tour.price;
  }

  return prisma.booking.create({
    data: {
      userId,
      itineraryId: itineraryId || null,
      tourId: tourId || null,
      requestId: requestId || null,
      advanceAmount: amount,
    },
  });
};