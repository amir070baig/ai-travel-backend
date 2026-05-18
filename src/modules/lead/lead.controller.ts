import { Request, Response } from "express";
import { prisma } from "../../shared/prisma/client";
// 1. Import your lead validation schema
import { leadSchema } from "../../validations/lead.validation";

export const createLead = async (req: Request, res: Response) => {
  try {
    // 2. Validate the incoming request body
    const parsed = leadSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid lead data",
        errors: parsed.error.flatten(),
      });
    }

    // 3. Use the clean, structured data validated by Zod
    const { name, email, phone, message } = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create lead",
    });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { leadId, status, notes } = req.body;

    const lead = await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        status,
        notes,
      },
    });

    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update lead",
    });
  }
};
