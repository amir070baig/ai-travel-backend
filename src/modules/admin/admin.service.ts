import { prisma } from "../../shared/prisma/client";
import { createBooking } from "../booking/booking.service";

export const approveRequest = async (requestId: string) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request || request.status !== "UNDER_REVIEW") {
    throw new Error("Invalid request state");
  }

  return prisma.request.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });
};

export const rejectRequest = async (requestId: string) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request || request.status !== "UNDER_REVIEW") {
    throw new Error("Invalid request state");
  }

  return prisma.request.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });
};

export const getAllRequestsAdmin = async () => {
  return prisma.request.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const getAllBookingsAdmin = async () => {
  return prisma.request.findMany({
    include: {
      user: true,        // ✅ who made request
      itinerary: true,   // ✅ actual itinerary
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};