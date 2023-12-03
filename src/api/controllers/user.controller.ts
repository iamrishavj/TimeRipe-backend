// user.controller.ts
import { Request, Response } from "express";
import * as UserService from "../services/user.service";

export const registerUser = async (req: Request, res: Response) => {
  // Extract user data from req.body
  // Call UserService.createUser with the data
  // Return the response
};

export const loginUser = async (req: Request, res: Response) => {
  // Process login request
};
