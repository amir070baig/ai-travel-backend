import { Request, Response, NextFunction } from "express";
import { prisma } from "../shared/prisma/client";

export const adminMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};