import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {

  // GET TOKEN FROM COOKIE
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }
};