import { prisma } from "../../shared/prisma/client";

interface BookingInput {
  userId: string;
  itineraryId?: string;
  requestId?: string;
  tourId?: string;
  travelDate: Date;
  timeSlot: string;
  travelers: number;
}

export const createBooking = async ({
  userId,
  itineraryId,
  requestId,
  tourId,
  travelDate,
  timeSlot,
  travelers,
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

  return prisma.booking.create({
    data: {
      userId,
      itineraryId: itineraryId || null,
      tourId: tourId || null,
      travelDate,
      timeSlot,
      travelers,
      requestId: requestId || null,
      advanceAmount: amount,
    },
  });
};
