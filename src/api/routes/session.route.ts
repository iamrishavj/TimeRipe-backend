import express from "express";

import * as SessionController from "../controllers/session.controller";
import authenticateToken from "../middleware/authenticateToken";

const router = express.Router();

router.get("/", authenticateToken, SessionController.getSessionsByUserId);

router.post("/", authenticateToken, SessionController.createSessionForUserId);

router.get(
  "/:sessionId/tasks",
  authenticateToken,
  SessionController.getSessionTasks
);

router.post(
  "/:sessionId/tasks",
  authenticateToken,
  SessionController.createSessionTask
);

router.get("/:sessionId/tasks/:taskId", SessionController.getTaskinSession);

router.put("/:sessionId/tasks/:taskId", SessionController.updateTaskinSession);

router.delete(
  "/:sessionId/tasks/:taskId",
  SessionController.deleteTaskinSession
);

router.post(
  "/:sessionId/tasks/bulk",
  SessionController.bulkUploadTasksInSession
);

export default router;
