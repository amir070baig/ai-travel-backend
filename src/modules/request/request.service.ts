import { prisma } from "../../shared/prisma/client";

export const createRequest = async (userId: string, itineraryId: string) => {

  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: 1,
    },
  });

  if (!settings?.aiBookingsEnabled) {
    throw new Error(
      "AI Concierge is temporarily unavailable. Please try again later."
    );
  }

  const existingRequest =
    await prisma.request.findFirst({
      where: {
        userId,
        itineraryId,
      },
    });

  if (existingRequest) {
    throw new Error(
      "You have already submitted a request for this itinerary."
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
      userId,
    },

    include: {
      itinerary: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

};