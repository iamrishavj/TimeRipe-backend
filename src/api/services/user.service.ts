// user.service.ts
import { PublicUser, CreateUserInput } from "../models/user.model";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (userData: CreateUserInput["body"]) => {
  const { username, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password_hash: hashedPassword,
    },
  });
  return user;
};

export const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) return null;
  return {
    userId: user.user_id,
    username: user.username,
    email: user.email,
    password: user.password_hash,
  };
};
