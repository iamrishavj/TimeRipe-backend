// user.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

import * as UserService from "../services/user.service";
import { CreateUserInput, PublicUser } from "../models/user.model";
import { isPrismaError } from "../../utils/errorTypeGaurd";
import exp from "constants";

export const registerUser = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  const { username, email, password } = req.body;
  try {
    await UserService.createUser({
      username,
      email,
      password,
    });
  } catch (error) {
    if (isPrismaError(error) && error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.json({ message: "User created successfully!" });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await UserService.findUserByUsername(username);

  if (!user) {
    return res.status(403).json({ message: "Invalid Credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { id: user.userId },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "4h",
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 3600000,
  });

  return res.status(200).json({ accessToken: accessToken });
};
