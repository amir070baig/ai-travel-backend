import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import aiRoutes from "./modules/ai/ai.routes";
import requestRoutes from "./modules/request/request.routes";
import bookingRoutes from "./modules/booking/booking.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import adminRoutes from "./modules/admin/admin.routes";

const app = express();

app.use(cors({ origin: "*" })); // ✅ only once
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
app.use("/requests", requestRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

export default app;