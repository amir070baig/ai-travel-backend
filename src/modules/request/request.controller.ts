import { Request, Response } from "express";
import { createRequest } from "./request.service";
import { prisma } from "../../shared/prisma/client";

export const submitRequest = async (req: Request, res: Response) => {
  try {
    const { itineraryId } = req.body;

    // TEMP: hardcoded user
    const userId = "test-user-id";

    const request = await createRequest(userId, itineraryId);

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Error creating request" });
  }
};


export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.request.findMany({
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