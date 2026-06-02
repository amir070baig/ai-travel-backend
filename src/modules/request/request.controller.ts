import { Request, Response } from "express";
import { createRequest } from "./request.service";
import { prisma } from "../../shared/prisma/client";
import { getUserRequests } from "./request.service";
import { createNotification } from "../notification/notification.service";
import {  createRequestMessage, getRequestMessages,} from "./request-message.service";

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
        status: "UNDER_REVIEW",
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

export const sendMessage = async (
  req: Request,
  res: Response
) => {

  try {

    const userId =
      (req as any).user.userId;

    const {
      requestId,
      message,
    } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message required",
      });
    }

    const request =
      await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const currentUser =
      await prisma.user.findUnique({
        where: {
          id: (req as any).user.userId,
        },
      });

    const senderType =
      currentUser?.role === "ADMIN"
        ? "ADMIN"
        : "USER";

    const result =
      await createRequestMessage(
        requestId,
        senderType,
        message
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to send message",
    });

  }

};

export const getMessages = async (
  req: Request,
  res: Response
) => {

  try {

    const { requestId } =
      req.params;

    const messages =
      await getRequestMessages(
        Array.isArray(requestId) ? requestId[0] : requestId
      );

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to load messages",
    });

  }

};