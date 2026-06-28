import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({
      message: "Invalid email format",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({
      message: "Invalid email format",
    }),
  password: z.string(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});
