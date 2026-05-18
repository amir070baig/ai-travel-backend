import { z } from "zod";

export const bookingSchema =
  z.object({

    tourId:
      z.string().optional(),

    itineraryId:
      z.string().optional(),

    travelers:
      z.number().min(1),

    travelDate:
      z.string(),

    timeSlot:
      z.string().optional(),
  });