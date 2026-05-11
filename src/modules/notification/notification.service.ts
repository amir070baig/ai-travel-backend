import { prisma } from "../../shared/prisma/client";

export const createNotification = async (
  userId: string,
  title: string,
  message: string
) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
};