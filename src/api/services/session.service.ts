import { PrismaClient, Task } from "@prisma/client";

const prisma = new PrismaClient();

export const getSessionsByUserId = async (user_id: number) => {
  return await prisma.session.findMany({
    where: {
      user_id,
    },
    orderBy: [
      {
        updated_at: "desc",
      },
      {
        created_at: "desc",
      },
    ],
  });
};

export const createSessionForUserId = async (
  user_id: number,
  title?: string
) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return await prisma.session.create({
    data: {
      user_id,
      title: title || formattedDate,
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

export const deleteAllStatusTasksinSession = async (
  sessionId: number,
  status: string
) => {
  return await prisma.task.deleteMany({
    where: {
      session_id: sessionId,
      status,
    },
  });
};
export const bulkUploadTasksInSession = async (
  sessionId: number,
  tasks: Task[]
) => {
  for (const task of tasks) {
    await prisma.task.upsert({
      where: { task_id: task.task_id, session_id: sessionId },
      update: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        order_index: task.order_index,
      },
      create: {
        session_id: sessionId,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        order_index: task.order_index,
      },
    });
  }
};
