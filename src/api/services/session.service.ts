import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSessionsByUserId = async (user_id: number) => {
  return await prisma.session.findMany({
    where: {
      user_id,
    },
  });
};

export const createSessionForUserId = async (
  user_id: number,
  title?: string
) => {
  return await prisma.session.create({
    data: {
      user_id,
      title: Date.now().toString(),
    },
  });
};

export const getSessionTasks = async (sessionId: number) => {
  return await prisma.task.findMany({
    where: {
      session_id: sessionId,
    },
  });
};
