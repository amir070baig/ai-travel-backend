import { z } from "zod";

export const bookingSchema = z.object({
  tourId: z.string().optional(),
  itineraryId: z.string().optional(),
  requestId: z.string().optional(),

  travelers: z.number()
    .min(1)
    .max(20)
    .default(1),

  travelDate: z.string().optional(),

  timeSlot: z.string().optional(),

  advanceAmount: z.number().int().min(0).default(0),

  guideLanguage: z.string().optional(),

  fullName: z.string().min(2).max(100),

  email: z.string().email(),

  country: z.string().min(2).max(100),

  whatsapp: z.string().optional(),

  hotelPickup: z.string().optional(),

  specialRequests: z.string().optional(),
});