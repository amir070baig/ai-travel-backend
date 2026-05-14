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

const app = express();

app.use(cors({ origin: "*" })); // ✅ only once
app.use(express.json());

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
app.use("/payments", paymentRoutes);
app.use("/pdf", pdfRoutes);
app.use("/upload", uploadRoutes);
app.use("/reviews", reviewRoutes);

export default app;