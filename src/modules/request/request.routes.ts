import { Router } from "express";
import { submitRequest } from "./request.controller";
import { getAllRequests } from "./request.controller";
import { acceptRevision } from "./request.controller";

const router = Router();

router.post("/", submitRequest);
router.get("/", getAllRequests);
router.post("/accept", acceptRevision);

export default router;