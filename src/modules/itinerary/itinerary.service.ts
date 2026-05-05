import { prisma } from "../../shared/prisma/client";

export const getMyItineraries = async (userId: string) => {
  return prisma.itinerary.findMany({
    where: {
      userId: userId, // 🔥 IMPORTANT
      sourceType: "AI",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};