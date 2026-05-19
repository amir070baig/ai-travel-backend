import { Request, Response } from "express";

import crypto from "crypto";

import { prisma } from "../../shared/prisma/client";

export const razorpayWebhook = async (
  req: Request,
  res: Response
) => {

  try {

    const secret =
      process.env
        .RAZORPAY_WEBHOOK_SECRET!;

    const signature =
      req.headers[
        "x-razorpay-signature"
      ] as string;

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(
          JSON.stringify(req.body)
        )
        .digest("hex");

    if (
      generatedSignature !==
      signature
    ) {

      return res.status(400).json({
        message:
          "Invalid webhook signature",
      });

    }

    const event =
      req.body.event;

    if (
      event ===
      "payment.captured"
    ) {

      const payment =
        req.body.payload.payment.entity;

      const bookingId =
        payment.notes.bookingId;

      await prisma.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          paymentStatus:
            "PAID",
        },
      });

    }

    res.json({
      status: "ok",
    });

  } catch (err) {

    console.error(
      "WEBHOOK ERROR:",
      err
    );

    res.status(500).json({
      message:
        "Webhook error",
    });

  }

};