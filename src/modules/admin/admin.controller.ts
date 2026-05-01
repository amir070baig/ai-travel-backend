import { Request, Response } from "express";
import { approveRequest, rejectRequest } from "./admin.service";
import { getAllRequestsAdmin } from "./admin.service";
import { getAllBookingsAdmin } from "./admin.service";

export const approve = async (req: Request, res: Response) => {
  try {
    const { requestId, message } = req.body;

    const data = await approveRequest(requestId);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Approve error" });
  }
};

export const reject = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    const data = await rejectRequest(requestId);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Reject error" });
  }
};

import { prisma } from "../../shared/prisma/client";

export const sendRevision = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  try {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request || request.status !== "UNDER_REVIEW") {
      return res.status(400).json({
        message: "Invalid request state",
      });
    }

    await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "REVISION_SENT",
        revisionMessage: message,
      },
    });

    res.json({ message: "Revision sent" });
  } catch (err) {
    res.status(500).json({ message: "Error sending revision" });
  }
};


export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const data = await getAllRequestsAdmin();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};


export const getBookings = async (req: Request, res: Response) => {
  try {
    const data = await getAllBookingsAdmin();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};