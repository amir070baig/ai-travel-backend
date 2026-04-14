import { Router } from "express";
import { approve, reject } from "./admin.controller";
import { sendRevision } from "./admin.controller";


const router = Router();

router.post("/approve", approve);
router.post("/reject", reject);
router.post("/revision", sendRevision);

export default router;