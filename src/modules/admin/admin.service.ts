import { prisma } from "../../shared/prisma/client";
import { createBooking } from "../booking/booking.service";

export const approveRequest = async (requestId: string) => {
  const request = await prisma.request.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });

  const booking = await createBooking(
    request.userId,
    request.itineraryId,
    request.id
  );

  return { request, booking };
};

export const rejectRequest = async (requestId: string) => {
  return prisma.request.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });
};