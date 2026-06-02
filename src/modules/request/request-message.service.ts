import { prisma } from "../../shared/prisma/client";

// prisma client may not have the generated property on the static type
// cast to any to access generated model properties at runtime
const db = prisma as any;

export const createRequestMessage = async (
  requestId: string,
  senderType: "USER" | "ADMIN",
  message: string
) => {

  return db.requestMessage.create({
    data: {
      requestId,
      senderType,
      message,
    },
  });

};

export const getRequestMessages = async (
  requestId: string
) => {

  return db.requestMessage.findMany({
    where: {
      requestId,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

};