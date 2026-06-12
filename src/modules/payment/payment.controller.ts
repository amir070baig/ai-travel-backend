import { Request, Response } from "express";
import crypto from "crypto";
import { razorpay } from "./payment.service";
import { prisma } from "../../shared/prisma/client";
import { createNotification } from "../notification/notification.service";
import { sendEmail } from "../../shared/email"; // Ensure this import matches your project structure
// 1. Import payment validation schemas
import { createOrderSchema, verifyPaymentSchema } from "../../validations/payment.validation";
import { notifyAdmins } from "../notification/notification.service";

export const createOrder = async (req: Request, res: Response) => {
  try {
    // 2. Validate create order payload
    const parsed = createOrderSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid order data",
        errors: parsed.error.flatten(),
      });
    }

    const { bookingId } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    console.log("BOOKING AMOUNT:", booking.advanceAmount);
    
    const order = await razorpay.orders.create({
      amount: booking.advanceAmount * 100,
      currency: "INR",
      notes: {
        bookingId,
      },
      receipt: `rcpt_${booking.id.slice(0, 10)}`,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        orderId: order.id,
      },
    });

    res.json(order);
  } catch (err) {
    console.error(
      "RAZORPAY ERROR:",
      JSON.stringify(err, null, 2)
    );
    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    // 3. Validate signature webhook / return payload
    const parsed = verifyPaymentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid payment verification data",
        errors: parsed.error.flatten(),
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = parsed.data;

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
      // data: {
      //   paymentStatus: "PAID",
      //   paymentId: razorpay_payment_id,
      // },
      data: {
        paymentStatus: "PAID",

        paymentId:
          razorpay_payment_id,

        status: "CONFIRMED",
      },
    });

    await createNotification(
      bookingData.userId,
      "Booking Confirmed 🎉",
      "Your booking has been confirmed successfully."
    );

    // === Email Logic ===
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        user: true,
      },
    });

    await notifyAdmins(
      "Payment Received 💰",
      `${booking?.user?.email} completed advance payment.`,
      "/admin"
    );

    const admin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (admin?.email) {

      await sendEmail({
        to: admin.email,

        subject: "Payment Received 💰",

        html: `
          <h1>
            Payment Received
          </h1>

          <p>
            ${booking?.user?.email} completed an advance payment.
          </p>

          <p>
            Please review the booking details in the admin dashboard.
          </p>
        `,
      });

    }

    if (booking?.user?.email) {
      await sendEmail({
        to: booking.user.email,
        subject: "Payment Received ✅",
        html: `
          <h1>Payment Successful</h1>
          <p>We have received your payment successfully.</p>
          <p>Your booking is now confirmed.</p>
        `,
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(
      "RAZORPAY ERROR:",
      JSON.stringify(err, null, 2)
    );
    res.status(500).json({
      message: "Payment verification failed",
    });
  }
};
