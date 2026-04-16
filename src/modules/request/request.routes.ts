import { Router } from "express";
import { submitRequest } from "./request.controller";
import { getAllRequests } from "./request.controller";
import { acceptRevision } from "./request.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, submitRequest);
router.get("/", authMiddleware, getAllRequests);
router.post("/accept", acceptRevision);

export default router;