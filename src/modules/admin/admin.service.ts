import { prisma } from "../../shared/prisma/client";
import { createBooking } from "../booking/booking.service";
import { sendEmail } from "../../shared/email";

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


  const updatedRequest = await prisma.request.findUnique({
    where: {
      id: requestId,
    },

    include: {
      user: true,
      itinerary: true,
    },
  });

  if (updatedRequest?.user?.email) {

    await sendEmail({
      to: updatedRequest.user.email,

      subject:
        "Your Travel Request Has Been Approved ✅",

      html: `
        <h1>
          Request Approved
        </h1>

        <p>
          Your itinerary request has been approved successfully.
        </p>

        <p>
          Our travel team will contact you shortly.
        </p>

        <p>
          Thank you for choosing AI Travel Planner.
        </p>
      `,
    });

  }

  
  // ✅ prevent duplicate bookings
  const existingBooking = await prisma.booking.findFirst({
    where: {
      requestId: request.id,
    },
  });

  if (!existingBooking) {

    const budgetValue = Number(
      request.itinerary.budget.replace(/[^\d]/g, "")
    );

    const calculatedAdvance =
      Math.floor(budgetValue * 0.15);

    const advanceAmount = Math.min(
      5000,
      Math.max(499, calculatedAdvance)
    );

    await prisma.booking.create({
      data: {
        userId: request.userId,
        itineraryId: request.itineraryId,
        requestId: request.id,
        status: "CONFIRMED",
        advanceAmount,
        travelers:
          request.itinerary.groupSize,
      },
    });

  }

  return {
    success: true,
  };
};


export const rejectRequest = async (requestId: string) => {
  // Fetch request along with user email before updating
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true },
  });

  if (!request || request.status !== "UNDER_REVIEW") {
    throw new Error("Invalid request state");
  }

  // Send the rejection email
  if (request.user?.email) {
    await sendEmail({
      to: request.user.email,
      subject: "Update regarding your Travel Request ❌",
      html: `
        <h1>Request Update</h1>
        <p>We regret to inform you that your itinerary request has been rejected.</p>
        <p>If you have any questions or would like to submit a new layout, please reach out to our team.</p>
        <p>Thank you for using AI Travel Planner.</p>
      `,
    }).catch(err => console.error("Rejection email failed:", err));
  }

  return prisma.request.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });
};


export const getAllRequestsAdmin = async () => {
  return prisma.request.findMany({
    include: {
      user: true,
      itinerary: true,
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