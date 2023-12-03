// user.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import * as UserService from "../services/user.service";
import { CreateUserInput, PublicUser } from "../models/user.model";

export const registerUser = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  // Your logic here, with req.body being already validated
  // Extract user data from req.body
  // Call UserService.createUser with the data
  // Return the response
  const { username, email, password } = req.body;
  try {
    await UserService.createUser({
      username,
      email,
      password,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.json({ message: "User created successfully!" });
};

export const loginUser = async (req: Request, res: Response) => {
  // Process login request
  const { username, password } = req.body;
  // Extract user data from req.body
  // Call UserService.findUserByUsername with the username
  const user = await UserService.findUserByUsername(username);

  if (!user) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
  // Compare the password with the hashed password from the DB
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  // Return the response
  return res.json({
    userId: user.userId,
    username: user.username,
  } as PublicUser);
};
