import { Router } from "express";
import { approve, reject } from "./admin.controller";
import { sendRevision } from "./admin.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";


const router = Router();

router.post("/approve", authMiddleware, adminMiddleware, approve);
router.post("/reject", authMiddleware, adminMiddleware, reject);
router.post("/revision", authMiddleware, adminMiddleware, sendRevision);

export default router;