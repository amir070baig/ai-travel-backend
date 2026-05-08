import { prisma } from "../../shared/prisma/client";
import { createBooking } from "../booking/booking.service";

export const approveRequest = async (requestId: string) => {

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      itinerary: true,
    },
  });

  if (!request || request.status !== "UNDER_REVIEW") {
    throw new Error("Invalid request state");
  }

  // ✅ approve request
  await prisma.request.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
    },
  });

  // ✅ prevent duplicate bookings
  const existingBooking = await prisma.booking.findFirst({
    where: {
      requestId: request.id,
    },
  });

  if (!existingBooking) {

    await prisma.booking.create({
      data: {
        userId: request.userId,
        itineraryId: request.itineraryId,
        requestId: request.id,
        status: "CONFIRMED",
        advanceAmount: 2000,
      },
    });

  }

  return {
    success: true,
  };
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
    include: {
      user: true,        // ✅ WHO
      itinerary: true,   // ✅ WHAT (THIS FIXES YOUR ISSUE)
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const getAllBookingsAdmin = async () => {
  return prisma.booking.findMany({
    include: {
      user: true,
      itinerary: true, // for AI bookings
      tour: true,      // 🔥 THIS IS THE FIX
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};