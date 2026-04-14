import { prisma } from "../../shared/prisma/client";

export const createRequest = async (userId: string, itineraryId: string) => {
  return prisma.request.create({
    data: {
      userId,
      itineraryId,
      status: "UNDER_REVIEW",
    },
  });
};