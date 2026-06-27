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
      itineraryId,
      rating,
      comment,
    } = req.body;

    if (!tourId && !itineraryId) {
      return res.status(400).json({
        message:
          "Tour ID or Itinerary ID is required",
      });
    }

    const completedBooking =
      await prisma.booking.findFirst({
        where: {
          userId,

          status: "COMPLETED",

          ...(tourId
            ? { tourId }
            : { itineraryId }),
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

          ...(tourId
            ? { tourId }
            : { itineraryId }),
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

          tourId:
            tourId || null,

          itineraryId:
            itineraryId || null,

        },
      });

    const createdReview =
      await prisma.review.findUnique({
        where: {
          id: review.id,
        },
        include: {
          user: true,
        },
      });

    res.json(createdReview);

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


export const getItineraryReviews = async (
  req: Request,
  res: Response
) => {

  try {

    const itineraryId =
      req.params.itineraryId as string;

    const reviews =
      await prisma.review.findMany({

        where: {
          itineraryId,
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
        "Failed to fetch itinerary reviews",
    });

  }

};


export const getFeaturedAIReviews = async (req: Request, res: Response) => {

  try {
    const allReviews = await prisma.review.findMany();
    console.log("ALL REVIEWS");
    console.log(allReviews)

    // const reviews =
    //   await prisma.review.findMany({

    //     where: {
    //       itineraryId: {
    //         not: null,
    //       },
    //     },

    //     include: {
    //       itinerary: {
    //         select: {
    //           city: true,
    //           days: true,
    //           groupSize: true,
    //           createdAt: true,
    //         },
    //       },
    //     },

    //     orderBy: {
    //       createdAt: "desc",
    //     },

    //   });
    const reviews = await prisma.review.findMany();

    console.log(reviews);

    res.json(reviews);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Failed to fetch AI reviews",
    });

  }

};