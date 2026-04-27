import { prisma } from "../../shared/prisma/client";

export const createBooking = async (
  userId: string,
  itineraryId?: string,
  requestId?: string,
  tourId?: string
) => {
  return prisma.booking.create({
    data: {
      userId,
      itineraryId: itineraryId || null,
      tourId: tourId || null,
      requestId: requestId || null,
      advanceAmount: 1000,
    },
  });
};