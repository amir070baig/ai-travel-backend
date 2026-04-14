import { prisma } from "../../shared/prisma/client";

export const createBooking = async (
  userId: string,
  itineraryId: string,
  requestId?: string
) => {
  return prisma.booking.create({
    data: {
      userId,
      itineraryId,
      requestId: requestId || null,
      advanceAmount: 1000,
    },
  });
};