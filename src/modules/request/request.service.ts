import { prisma } from "../../shared/prisma/client";

export const createRequest = async (
  userId: string,
  itineraryId: string
) => {

  // CHECK EXISTING REQUEST
  const existingRequest =
    await prisma.request.findFirst({
      where: {
        userId,
        itineraryId,
        status: {
          not: "REJECTED",
        },
      },
    });

  if (existingRequest) {
    throw new Error(
      "You already submitted this itinerary"
    );
  }

  return prisma.request.create({
    data: {

      status: "UNDER_REVIEW",

      user: {
        connect: {
          id: userId,
        },
      },

      itinerary: {
        connect: {
          id: itineraryId,
        },
      },
    },
  });
};

export const getUserRequests = async (userId: string) => {
  return prisma.request.findMany({
    where: {
      userId: userId,
    },
    include: {
      itinerary: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};