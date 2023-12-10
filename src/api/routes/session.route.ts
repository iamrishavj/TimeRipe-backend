import express from "express";

import * as SessionController from "../controllers/session.controller";
import authenticateToken from "../middleware/authenticateToken";

const router = express.Router();

router.get("/", authenticateToken, SessionController.getSessionsByUserId);

router.post("/", authenticateToken, SessionController.createSessionForUserId);

router.get("/:sessionId/tasks", SessionController.getSessionTasks);

//router.post("/:sessionId/tasks", SessionController.createTasksForSessionId);

export default router;
