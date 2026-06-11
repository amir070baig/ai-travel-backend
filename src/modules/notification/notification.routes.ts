import { Router } from "express";
import { prisma } from "../../shared/prisma/client";
import { authMiddleware } from "../../middleware/auth.middleware"

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = (req as any).user.userId;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(notifications);
});

router.patch(
  "/:id/read",
  authMiddleware,
  async (req, res) => {

    const notification =
      await prisma.notification.update({
        where: {
          id: req.params.id,
        },
        data: {
          isRead: true,
        },
      });

    res.json(notification);

  }
);

router.patch(
  "/read-all",
  authMiddleware,
  async (req, res) => {

    const userId =
      (req as any).user.userId;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json({
      success: true,
    });

  }
);

export default router;