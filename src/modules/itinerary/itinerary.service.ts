import { prisma } from "../../shared/prisma/client";

export const getMyItineraries = async (userId: string) => {
  return prisma.itinerary.findMany({
    where: {
      userId: userId,
      sourceType: "AI",

      // ✅ only show itineraries
      // that are NOT already requested
      requests: {
        none: {},
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};