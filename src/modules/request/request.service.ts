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
      userId,
      itineraryId,
      status: "UNDER_REVIEW",
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