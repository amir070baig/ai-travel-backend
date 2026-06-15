import { prisma } from "../../shared/prisma/client";
import { createBooking } from "../booking/booking.service";
import { sendEmail } from "../../shared/email";
import { createNotification } from "../notification/notification.service";

export const approveRequest = async (requestId: string, finalPrice: number) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      itinerary: true,
    },
  });

  if (
    !request ||
    !["UNDER_REVIEW", "REVISION_SENT"].includes(
      request.status
    )
  ) {
    throw new Error("Invalid request state");
  }

  // ✅ approve request
  const effectivePrice =
    finalPrice ||
    Number(
      request.itinerary.budget.replace(/[^\d]/g, "")
    );

  await prisma.request.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      finalPrice: effectivePrice,
    },
  });

  await createNotification(
    request.userId,
    "Package Approved ✅",
    `Your personalized travel package is ready. Final package price: ₹${effectivePrice}`,
    "/my-requests"
  );

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
      subject: "Your Travel Request Has Been Approved ✅",
      html: `
        <h1>
          Request Approved
        </h1>

        <p>
          Your itinerary request has been approved successfully.
        </p>

        <p>
          Final Package Price: ₹${effectivePrice}
        </p>

        <p>
          Please log in to complete your advance payment and reserve your personalized travel package.
        </p>

        <p>
          Our travel team will contact you shortly.
        </p>

        <p>
          Thank you for choosing TourGen.
        </p>
      `,
    });
  }

  // ✅ prevent duplicate bookings
  const existingBooking = await prisma.booking.findFirst({
    where: {
      requestId,
    },
  });

  if (!existingBooking && updatedRequest) {
    const calculatedAdvance = Math.floor(effectivePrice * 0.30);
    const advanceAmount = Math.min(5000, Math.max(499, calculatedAdvance));

    await prisma.booking.create({
      data: {
        userId: updatedRequest.userId,
        itineraryId: updatedRequest.itineraryId,
        requestId,
        status: "PENDING_PAYMENT",
        advanceAmount,
        travelers: updatedRequest.itinerary.groupSize,
      },
    });
    console.log("BOOKING CREATED");

    if (updatedRequest?.user?.email) {

      await sendEmail({
        to: updatedRequest.user.email,

        subject: "Booking Created 📅",

        html: `
          <h1>
            Booking Created
          </h1>

          <p>
            Your personalized travel package is ready.
          </p>

          <p>
            Please log in and complete your advance payment.
          </p>
        `,
      });

    }

    await createNotification(
      updatedRequest.userId,
      "Booking Created 📅",
      "Please select your travel date and complete advance payment.",
      "/my-requests"
    );
  }

  return {
    success: true,
  };
};


export const rejectRequest = async (requestId: string) => {

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true },
  });

  if (
    !request ||
    !["UNDER_REVIEW", "REVISION_SENT"].includes(request.status)
  ) {
    throw new Error("Invalid request state");
  }

  if (request.user?.email) {
    await sendEmail({
      to: request.user.email,
      subject: "Update regarding your Travel Request ❌",
      html: `
        <h1>Request Update</h1>
        <p>We regret to inform you that your itinerary request has been rejected.</p>
        <p>If you have any questions or would like to submit a new request, please reach out to our team.</p>
        <p>Thank you for using TourGen.</p>
      `,
    }).catch(err =>
      console.error("Rejection email failed:", err)
    );
  }

  await createNotification(
    request.userId,
    "Request Rejected ❌",
    "Your travel request could not be approved. Please review the details or submit a new request.",
    "/my-requests"
  );

  return prisma.request.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
    },
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