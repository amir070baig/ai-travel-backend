import { prisma } from "../../shared/prisma/client";

export const createNotification = async (userId: string, title: string, message: string) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
};

export const notifyAdmins = async (
  title: string,
  message: string
) => {

  const admins = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
  });

  await Promise.all(
    admins.map((admin) =>
      prisma.notification.create({
        data: {
          userId: admin.id,
          title,
          message,
        },
      })
    )
  );

};