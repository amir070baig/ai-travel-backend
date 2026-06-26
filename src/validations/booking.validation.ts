import { z } from "zod";

export const bookingSchema = z.object({
  tourId: z.string().optional(),
  itineraryId: z.string().optional(),
  requestId: z.string().optional(),
  // Give travelers a default of 1 if not provided
  travelers: z.number()
    .min(1)
    .max(20)
    .default(1),
  // Make travelDate optional so bookings from the list view don't fail validation
  travelDate: z.string().optional(),
  timeSlot: z.string().optional(),
  // Add advanceAmount to satisfy your Prisma schema requirements
  advanceAmount: z.number().int().min(0).default(0),
  guideLanguage: z.string().optional(),
});
