import { Router } from "express";
import { deleteItineraryController, submitRequest } from "./request.controller";
import { getAllRequests } from "./request.controller";
import { acceptRevision } from "./request.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rejectRevision } from "./request.controller";
import {  sendMessage,  getMessages,} from "./request.controller";


const router = Router();

router.post("/", authMiddleware, submitRequest);
router.get("/", authMiddleware, getAllRequests);
router.post("/accept", acceptRevision);
router.post("/reject-revision", authMiddleware, rejectRevision);
router.post(  "/message",  authMiddleware,  sendMessage);
router.get(  "/:requestId/messages",  authMiddleware,  getMessages);
router.delete("/delete/:id", authMiddleware, deleteItineraryController);

export default router;