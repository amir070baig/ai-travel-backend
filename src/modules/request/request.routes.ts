import { Router } from "express";
import { submitRequest } from "./request.controller";
import { getAllRequests } from "./request.controller";

const router = Router();

router.post("/", submitRequest);
router.get("/", getAllRequests);

export default router;