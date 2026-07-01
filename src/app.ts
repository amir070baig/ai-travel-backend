import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import aiRoutes from "./modules/ai/ai.routes";
import requestRoutes from "./modules/request/request.routes";
import bookingRoutes from "./modules/booking/booking.routes";
import adminRoutes from "./modules/admin/admin.routes";
import itineraryRoutes from "./modules/itinerary/itinerary.routes";
import tourRoutes from "./modules/tour/tour.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import pdfRoutes from "./modules/pdf/pdf.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import reviewRoutes from "./modules/review/review.routes";
import settingsRoutes from "./modules/settings/settings.routes";
import leadRoutes from "./modules/lead/lead.routes";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// @ts-ignore: no declaration file for cookie-parser
import cookieParser from "cookie-parser";

const app = express();
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message:
    "Too many requests. Please try again later.",
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/payments/webhook", express.raw({type: "*/*",}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
app.use("/requests", requestRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/admin", adminRoutes);
app.use("/itineraries", itineraryRoutes);
app.use("/tours", tourRoutes);
app.use("/notifications", notificationRoutes);
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});
// app.use("/payments", paymentRoutes);
app.use("/pdf", pdfRoutes);
app.use("/upload", uploadRoutes);
app.use("/reviews", reviewRoutes);
app.use("/settings", settingsRoutes);
app.use("/leads", leadRoutes);
// app.use("/ai", aiRoutes);
export default app;