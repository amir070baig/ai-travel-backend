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

export default router;