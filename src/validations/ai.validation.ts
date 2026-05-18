import { z } from "zod";

export const aiGenerationSchema = z.object({
  days: z.number().min(1, { message: "Days must be at least 1" }),
  budget: z.string().min(1, { message: "Budget tier is required" }),
  groupSize: z.number().min(1, { message: "Group size must be at least 1" }),
  travelStyle: z.string().min(1, { message: "Travel style is required" }),
  tripType: z.string().min(1, { message: "Trip type is required" }),
  interests: z.string().min(1, { message: "Interests description is required" }),
});
