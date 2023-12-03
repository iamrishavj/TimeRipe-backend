// user.routes.ts
import express from "express";
import * as UserController from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", UserController.registerUser);
router.post("/login", UserController.loginUser);

export default router;
