import { Router } from "express";
import { register, login, resetPassword, me } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, me);

export default router;
