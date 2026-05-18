import { Router } from "express";

import {
  createLead,
  getLeads,
  updateLeadStatus,
} from "./lead.controller";

const router = Router();

router.post("/", createLead);

router.get("/", getLeads);

router.patch("/", updateLeadStatus);

export default router;