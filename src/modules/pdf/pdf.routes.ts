import { Router } from "express";
import { generatePDF } from "./pdf.controller";

const router = Router();

router.post("/generate", generatePDF);

export default router;