import { z } from "zod";

export const tourSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),

  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),

  price: z.number().positive({
    message: "Price must be positive",
  }),

  imageUrl: z.string().url({
    message: "Invalid image URL",
  }),

  gallery: z.array(z.string()).default([]),

  highlights: z.array(z.string()).default([]),

  inclusions: z.array(z.string()).default([]),

  exclusions: z.array(z.string()).default([]),

  duration: z.string().optional(),

  pickupPoint: z.string().optional(),

  pickupTime: z.string().optional(),

  availabilityNote: z.string().optional(),

  itinerary: z.array(z.string()).optional(),

  faq: z.array(z.string()).optional(),
});