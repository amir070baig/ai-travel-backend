import { Request, Response } from "express";
import crypto from "crypto";
import { razorpay } from "../payment/payment.service";
import { prisma } from "../../shared/prisma/client";
import { createNotification } from "../notification/notification.service";
import { sendEmail } from "../../shared/email"; 

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const order = await razorpay.orders.create({
      amount: booking.advanceAmount * 100,
      currency: "INR",
      notes: {
        bookingId,
      },
      receipt: `receipt_${booking.id}`,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        orderId: order.id,
      },
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    const bookingData = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "PAID",
        paymentId: razorpay_payment_id,
      },
    });

    await createNotification(
      bookingData.userId,
      "Payment Successful",
      "Your advance payment has been received successfully."
    );

    // === NEW CODE ADDED HERE ===
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        user: true,
      },
    });

    if (booking?.user?.email) {
      await sendEmail({
        to: booking.user.email,
        subject: "Payment Successful 💳",
        html: `
          <h1>Payment Received</h1>
          <p>Your payment was received successfully.</p>
          <p>Your booking is now confirmed.</p>
        `,
      });
    }
    // ===========================

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Payment verification failed",
    });
  }
};
