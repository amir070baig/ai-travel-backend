import { Request, Response } from "express";

import { prisma } from "../../shared/prisma/client";

export const createReview = async (
  req: Request,
  res: Response
) => {
  try {

    const userId =
      (req as any).user.userId;

    const {
      tourId,
      rating,
      comment,
    } = req.body;

    const completedBooking =
      await prisma.booking.findFirst({
        where: {
          userId,
          tourId,
          status: "COMPLETED",
        },
      });

    if (!completedBooking) {
      return res.status(403).json({
        message:
          "You can only review tours you have completed",
      });
    }

    const existingReview =
      await prisma.review.findFirst({
        where: {
          userId,
          tourId,
        },
      });

    if (existingReview) {
      return res.status(400).json({
        message:
          "You have already reviewed this tour",
      });
    }

    const review =
      await prisma.review.create({
        data: {
          rating,
          comment,
          userId,
          tourId,
        },
      });

    res.json(review);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Failed to create review",
    });

  }
};

export const getTourReviews = async (
  req: Request,
  res: Response
) => {
  try {
    // Cast the parameter to a string explicitly
    const tourId = req.params.tourId as string;

    const reviews =
      await prisma.review.findMany({
        where: {
          tourId: tourId, 
        },

        include: {
          user: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(reviews);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Failed to fetch reviews",
    });

  }
};
