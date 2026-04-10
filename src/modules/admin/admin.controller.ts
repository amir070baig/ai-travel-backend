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