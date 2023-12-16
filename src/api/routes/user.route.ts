import express from "express";

import * as UserController from "../controllers/user.controller";
import validate from "../middleware/validateSchema";
import { createUserSchema } from "../models/user.model";

const router = express.Router();

router.post("/signup", validate(createUserSchema), UserController.registerUser);

router.post("/login", UserController.loginUser);

router.get("/verify/:userId/:token", UserController.verifyUser);

export default router;
