import { Request, Response } from "express";
import { approveRequest, rejectRequest } from "./admin.service";

export const approve = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

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
    await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "REVISION_SENT",
      },
    });

    res.json({ message: "Revision sent" });
  } catch (err) {
    res.status(500).json({ message: "Error sending revision" });
  }
};