// src/api/controllers/session.controller.ts
import { Request, Response } from "express";
import * as SessionService from "../services/session.service";

export const getSessionsByUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const sessions = await SessionService.getSessionsByUserId(+user_id);
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSessionForUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSessionTask = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { title, description, status, order_index, priority } = req.body;
  try {
    const task = await SessionService.createSessionTask(
      +sessionId,
      title,
      description,
      status,
      order_index,
      priority
    );
    return res.json(task);
  } catch (error) {
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
  try {
    const task = await SessionService.updateTaskinSession(
      +sessionId,
      +taskId,
      title,
      description,
      status,
      order_index,
      priority
    );
    return res.json(task);
  } catch (error) {
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
