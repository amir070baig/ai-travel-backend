import { Request, Response } from "express";
import { prisma } from "../../shared/prisma/client";
import { leadSchema } from "../../validations/lead.validation";
import { sendEmail } from "../../shared/email";

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

    // 4. Trigger emails in the background using your Resend utility
    try {
      // Email A: Notify the Admin Team
      await sendEmail({
        to: "tourgenteam@gmail.com", 
        subject: `🚨 New Lead Received: ${name}`,
        html: `
          <h3>New Trip Consultation Requested</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Message:</strong> ${message || "No custom message provided"}</p>
        `,
      });

      // Email B: Send Confirmation to the Customer
      await sendEmail({
        to: email,
        subject: `Thank you for contacting TourGen, ${name}!`,
        html: `
          <h3>Hello ${name},</h3>
          <p>We've successfully received your trip specs regarding your itinerary planning!</p>
          <p>One of our seasoned travel specialists is checking local timing windows, crowd paths, and slots right now. We will contact you shortly.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>The TourGen Team</strong></p>
        `,
      });
    } catch (emailErr) {
      // Wrapped in a try/catch so that even if Resend encounters an error (e.g., API key issue),
      // the API doesn't crash, and the customer still gets a successful response since their lead saved to the database.
      console.error("Failed to process background email dispatches:", emailErr);
    }

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