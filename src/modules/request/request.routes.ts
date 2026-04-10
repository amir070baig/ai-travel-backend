import { Router } from "express";
import { submitRequest } from "./request.controller";

const router = Router();

router.post("/", submitRequest);

export default router;