import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrder = async (amount: number) => {
  return razorpay.orders.create({
    amount: amount * 100, // paise
    currency: "INR",
  });
};