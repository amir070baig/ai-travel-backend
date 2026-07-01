import { Request, Response } from "express";
import { prisma } from "../../shared/prisma/client";

export const getSettings = async (
  req: Request,
  res: Response
) => {

  try {

    const settings =
      await prisma.siteSettings.findUnique({
        where: {
          id: 1,
        },
      });

    return res.json(settings);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message: "Failed to fetch settings",
    });

  }

};

export const toggleAIBookings = async (
  req: Request,
  res: Response
) => {

  try {

    const settings =
      await prisma.siteSettings.findUnique({
        where: {
          id: 1,
        },
      });

    if (!settings) {

      return res.status(404).json({
        message: "Settings not found",
      });

    }

    const updated =
      await prisma.siteSettings.update({

        where: {
          id: 1,
        },

        data: {
          aiBookingsEnabled:
            !settings.aiBookingsEnabled,
        },

      });

    return res.json(updated);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message: "Failed to update settings",
    });

  }

};