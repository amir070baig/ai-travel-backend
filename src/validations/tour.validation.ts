import { z } from "zod";

export const tourSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  imageUrl: z.string().url({ message: "Invalid image URL" }),
  gallery: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  duration: z.string().min(1, { message: "Duration is required" }),
  pickupPoint: z.string().min(1, { message: "Pickup point is required" }),
  pickupTime: z.string().optional(),
  availabilityNote: z.string().optional(),
});
