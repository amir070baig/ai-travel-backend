import { z } from "zod";

export const createOrderSchema = z.object({
  bookingId: z.string().min(1, { message: "Booking ID is required" }),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, { message: "Order ID is required" }),
  razorpay_payment_id: z.string().min(1, { message: "Payment ID is required" }),
  razorpay_signature: z.string().min(1, { message: "Signature is required" }),
  bookingId: z.string().min(1, { message: "Booking ID is required" }),
});
