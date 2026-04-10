import { Router } from "express";
import { approve, reject } from "./admin.controller";

const router = Router();

router.post("/approve", approve);
router.post("/reject", reject);

export default router;