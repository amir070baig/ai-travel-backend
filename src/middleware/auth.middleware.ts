import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {

  // GET TOKEN FROM COOKIE
  const cookieToken = req.cookies?.token;

  const bearerToken =
    req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

  const token = cookieToken || bearerToken;

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
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
      });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      message: "Authentication failed.",
    });
  }
};