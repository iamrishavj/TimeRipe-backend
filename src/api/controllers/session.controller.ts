// src/api/controllers/session.controller.ts
import { Request, Response } from "express";
import * as SessionService from "../services/session.service";
import { stat } from "fs";

interface CustomRequest extends Request {
  user_id?: string;
}

export const getSessionsByUserId = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { user_id } = req;
    if (!user_id) return res.status(401).json({ message: "No token provided" });
    console.log(user_id);
    const sessions = await SessionService.getSessionsByUserId(+user_id);
    return res.json(sessions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSessionForUserId = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { user_id } = req;
    if (!user_id) return res.status(401).json({ message: "No token provided" });
    const session = await SessionService.createSessionForUserId(+user_id);
    return res.json(session);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSessionTasks = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  try {
    const tasks = await SessionService.getSessionTasks(+sessionId);
    return res.json(tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSessionTask = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { title, description, status, order_index, priority } = req.body;
  console.log(req.body);
  try {
    const task = await SessionService.createSessionTask(
      +sessionId,
      title,
      description,
      status,
      priority,
      +order_index
    );

    return res.json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskinSession = async (req: Request, res: Response) => {
  const { sessionId, taskId } = req.params;
  try {
    const task = await SessionService.getTaskinSession(+sessionId, +taskId);
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskinSession = async (req: Request, res: Response) => {
  const { sessionId, taskId } = req.params;
  const { title, description, status, order_index, priority } = req.body;
  console.log(req.body);
  try {
    const task = await SessionService.updateTaskinSession(
      +sessionId,
      +taskId,
      title,
      description,
      status,
      priority,
      +order_index
    );
    return res.json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTaskinSession = async (req: Request, res: Response) => {
  const { sessionId, taskId } = req.params;
  try {
    const task = await SessionService.deleteTaskinSession(+sessionId, +taskId);
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAllStatusTasksinSession = async (
  req: Request,
  res: Response
) => {
  const { sessionId } = req.params;
  const { status } = req.body;

  try {
    const task = await SessionService.deleteAllStatusTasksinSession(
      +sessionId,
      status
    );
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const bulkUploadTasksInSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { tasks } = req.body;
  try {
    const tasksInSession = await SessionService.bulkUploadTasksInSession(
      +sessionId,
      tasks
    );
    return res.json(tasksInSession);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
