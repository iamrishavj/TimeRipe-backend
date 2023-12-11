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

export const createSessionTask = async (
  sessionId: number,
  title: string,
  description: string,
  status: string,
  priority: string,
  order_index: number
) => {
  return await prisma.task.create({
    data: {
      session_id: sessionId,
      title,
      description,
      status,
      priority,
      order_index,
    },
  });
};

export const getTaskinSession = async (sessionId: number, taskId: number) => {
  return await prisma.task.findUnique({
    where: {
      task_id: taskId,
    },
  });
};

export const updateTaskinSession = async (
  sessionId: number,
  taskId: number,
  title: string,
  description: string,
  status: string,
  priority: string,
  order_index: number
) => {
  return await prisma.task.update({
    where: {
      task_id: taskId,
      session_id: sessionId,
    },
    data: {
      title,
      description,
      status,
      priority,
      order_index,
    },
  });
};

export const deleteTaskinSession = async (
  sessionId: number,
  taskId: number
) => {
  return await prisma.task.delete({
    where: {
      task_id: taskId,
      session_id: sessionId,
    },
  });
};
