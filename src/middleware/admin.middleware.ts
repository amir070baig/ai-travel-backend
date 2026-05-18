import {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../shared/prisma/client";

export const adminMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {

  try {

    const userId =
      req?.user?.userId;

    if (!userId) {

      return res.status(401).json({
        message: "Unauthorized",
      });

    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (
      !user ||
      user.role !== "ADMIN"
    ) {

      return res.status(403).json({
        message:
          "Access denied",
      });

    }

    next();

  } catch (err) {

    console.error(
      "ADMIN MIDDLEWARE ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};