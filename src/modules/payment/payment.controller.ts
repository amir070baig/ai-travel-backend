import { Request, Response } from "express";
import { createOrder } from "./payment.service";

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    const order = await createOrder(amount);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Payment error" });
  }
};