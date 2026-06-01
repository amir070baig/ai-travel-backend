import { Request, Response } from "express";
import { prisma } from "../../shared/prisma/client";
import {sendEmail} from "../../shared/email";
import {
  approveRequest,
  rejectRequest,
  getAllRequestsAdmin,
  getAllBookingsAdmin,
} from "./admin.service";



// APPROVE REQUEST
export const approve = async (req: Request, res: Response) => {
  try {
    const { requestId, finalPrice } = req.body;
    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({
        message: "Final price is required",
      });
    }

    if (!requestId) {
      return res.status(400).json({
        message: "Request ID is required",
      });
    }

    const result = await approveRequest(requestId, Number(finalPrice));

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Approve Error:", error);

    return res.status(500).json({
      message: error.message || "Failed to approve request",
    });
  }
};



// REJECT REQUEST
export const reject = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        message: "Request ID is required",
      });
    }

    const result = await rejectRequest(requestId);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Reject Error:", error);

    return res.status(500).json({
      message: error.message || "Failed to reject request",
    });
  }
};



// SEND REVISION
export const sendRevision = async (req: Request, res: Response) => {
  try {
    const { requestId, message } = req.body;

    if (!requestId || !message) {
      return res.status(400).json({
        message: "Request ID and message are required",
      });
    }

    const request = await prisma.request.update({
      where: {
        id: requestId,
      },

      data: {
        status: "REVISION_SENT",
        revisionMessage: message,
        revisionStatus: "PENDING",
      },

      include: {
        user: true,
        itinerary: true,
      },
    });



    // CREATE NOTIFICATION
    await prisma.notification.create({
      data: {
        userId: request.userId,
        title: "Revision Requested ✏️",
        message,
      },
    });


    // SEND EMAIL TO USER
    await sendEmail({
      to: request.user.email,

      subject: "Your Itinerary Needs Revision ✏️",

      html: `
        <h1>Revision Requested</h1>

        <p>
          Our travel concierge team reviewed your itinerary request.
        </p>

        <p>
          Revision Notes:
        </p>

        <p>
          ${message}
        </p>

        <p>
          Please review your dashboard for updated guidance and next steps.
        </p>
      `,
    });


    return res.status(200).json({
      success: true,
      message: "Revision sent successfully",
      request,
    });
  } catch (error: any) {
    console.error("Revision Error:", error);

    return res.status(500).json({
      message: error.message || "Failed to send revision",
    });
  }
};




// GET ALL REQUESTS
export const getAllRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const requests = await getAllRequestsAdmin();

    return res.status(200).json(requests);
  } catch (error: any) {
    console.error("Get Requests Error:", error);

    return res.status(500).json({
      message: error.message || "Failed to fetch requests",
    });
  }
};



// GET ALL BOOKINGS
export const getBookings = async (
  req: Request,
  res: Response
) => {
  try {
    const bookings = await getAllBookingsAdmin();

    return res.status(200).json(bookings);
  } catch (error: any) {
    console.error("Get Bookings Error:", error);

    return res.status(500).json({
      message: error.message || "Failed to fetch bookings",
    });
  }
};