import { Request, Response } from "express";
import { registerUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await registerUser(email, password);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role, // ✅ ADD THIS
    },
  });
};


import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma/client";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

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

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    },
  });
};