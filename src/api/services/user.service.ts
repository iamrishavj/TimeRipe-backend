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
  return user.user_id;
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
    isUserVerified: user.verified,
  };
};

export const createVerificationToken = async (
  userId: number,
  token: string,
  expiresIn: number
) => {
  await prisma.userVerification.create({
    data: {
      user_id: userId,
      token,
      expires_at: new Date(Date.now() + expiresIn), // 24 hours
    },
  });
};

export const findUserVerification = async (userId: number) => {
  const userVerification = await prisma.userVerification.findFirst({
    where: {
      user_id: userId,
    },
  });
  if (!userVerification) return null;
  return {
    userId: userVerification.user_id,
    token: userVerification.token,
    expiresAt: userVerification.expires_at,
  };
};

export const isTokenExpired = async (userId: number) => {
  const userVerification = await prisma.userVerification.findFirst({
    where: {
      user_id: userId,
    },
  });
  if (!userVerification) return true;
  return userVerification.expires_at < new Date();
};

export const verifyUser = async (userId: number) => {
  await prisma.user.update({
    where: {
      user_id: userId,
    },
    data: {
      verified: true,
    },
  });
};

export const deleteUserVerification = async (userId: number) => {
  await prisma.userVerification.delete({
    where: {
      user_id: userId,
    },
  });
};
