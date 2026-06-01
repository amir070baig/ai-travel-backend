import { Request, Response } from "express";
import { createRequest } from "./request.service";
import { prisma } from "../../shared/prisma/client";
import { getUserRequests } from "./request.service";
import { createNotification } from "../notification/notification.service";

export const submitRequest = async (
  req: Request,
  res: Response
) => {
  try {

    const { itineraryId } = req.body;

    const userId =
      (req as any).user.userId;

    if (!itineraryId) {
      return res.status(400).json({
        message: "Itinerary ID is required",
      });
    }

    const itinerary =
      await prisma.itinerary.findUnique({
        where: {
          id: itineraryId,
        },
      });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary not found",
      });
    }

    const request =
      await createRequest(
        userId,
        itineraryId
      );

    await createNotification(
      userId,
      "Request Submitted",
      "Your itinerary request has been submitted successfully."
    );

    res.json(request);

  } catch (err: any) {

    res.status(400).json({
      message:
        err.message ||
        "Error creating request",
    });

  }
};


export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const requests = await getUserRequests(userId); // 🔥 USE SERVICE

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};

export const acceptRevision = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  try {
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        revisionStatus: "ACCEPTED_BY_USER"
      },
    });

    await createNotification(
      updatedRequest.userId,
      "Revision Accepted",
      "You accepted the updated itinerary revision."
    );

    res.json({ message: "Revision accepted" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting revision" });
  }
};

export const rejectRevision = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  try {
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "UNDER_REVIEW",
        revisionStatus: "REJECTED_BY_USER"
      },
    });

    await createNotification(
      updatedRequest.userId,
      "Revision Rejected",
      "Your itinerary revision was sent back for further review."
    );

    res.json({ message: "Revision rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting revision" });
  }
};