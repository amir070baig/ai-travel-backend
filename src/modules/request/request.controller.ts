import { Request, Response } from "express";
import { createRequest } from "./request.service";
import { prisma } from "../../shared/prisma/client";
import { getUserRequests } from "./request.service";

export const submitRequest = async (req: Request, res: Response) => {
  try {
    const { itineraryId } = req.body;

    // TEMP: hardcoded user
    const userId = (req as any).user.userId;

    const request = await createRequest(userId, itineraryId);

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Error creating request" });
  }
};


export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const requests = await prisma.request.findMany({
      where: {
        userId: userId, // ✅ CRITICAL
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};

export const acceptRevision = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  try {
    await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
      },
    });

    res.json({ message: "Revision accepted" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting revision" });
  }
};

export const rejectRevision = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  try {
    await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "UNDER_REVIEW", // back to admin
      },
    });

    res.json({ message: "Revision rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting revision" });
  }
};