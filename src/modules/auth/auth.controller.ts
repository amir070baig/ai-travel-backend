import { Request, Response } from "express";
import { registerUser } from "./auth.service";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma/client";
import bcrypt from "bcrypt";
// Updated to import both schemas
import { registerSchema, loginSchema } from "../../validations/auth.validation";

export const register = async (req: Request, res: Response) => {
  // 1. Validate registration inputs
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid registration data",
      errors: parsed.error.flatten(),
    });
  }

  // 2. Use validated data
  const { email, password } = parsed.data;

  const user = await registerUser(email, password);

  // ✅ CREATE TOKEN (THIS WAS MISSING)
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  // 1. Validate login inputs
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid login data",
      errors: parsed.error.flatten(),
    });
  }

  // 2. Use validated data
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.cookie(
    "token",
    token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  );

  res.json({
    user,
  });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({
    message: "Logged out",
  });
};
