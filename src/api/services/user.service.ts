// user.service.ts
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (userData: User) => {
  // Hash password, save user to DB using Prisma
};

export const findUserByUsername = async (username: string) => {
  // Logic to find a user by username
};

// Other service functions...
