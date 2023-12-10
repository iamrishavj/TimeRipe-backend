// src/api/controllers/session.controller.ts
import { Request, Response } from "express";
import * as SessionService from "../services/session.service";

export const getSessionsByUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const sessions = await SessionService.getSessionsByUserId(+user_id);
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSessionForUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const session = await SessionService.createSessionForUserId(+user_id);
    return res.json(session);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// src/api/controllers/session.controller.ts
export const getSessionTasks = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  try {
    const tasks = await SessionService.getSessionTasks(+sessionId);
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
