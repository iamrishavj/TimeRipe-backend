// user.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import "dotenv/config";

import * as UserService from "../services/user.service";
import { CreateUserInput } from "../models/user.model";
import { isPrismaError } from "../../utils/errorTypeGaurd";
import { sendVerificationEmail } from "../services/mail.service";

const emailTokenExpirationTime = 1000 * 60 * 60 * 24; // 24 hours

export const registerUser = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  const { username, email, password } = req.body;
  try {
    const newUserId = await UserService.createUser({
      username,
      email,
      password,
    });

    const token = uuidV4();
    await Promise.all([
      UserService.createVerificationToken(
        newUserId,
        token,
        emailTokenExpirationTime
      ),
      sendVerificationEmail(newUserId, email, token),
    ]);
  } catch (error) {
    if (isPrismaError(error) && error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.json({ message: "Verification mail sent to your email" });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await UserService.findUserByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(403).json({ message: "Invalid Credentials" });
  }

  if (!user.isUserVerified) {
    if (await UserService.isTokenExpired(user.userId)) {
      await UserService.deleteUserVerification(user.userId);

      const token = uuidV4();

      await Promise.all([
        UserService.createVerificationToken(
          user.userId,
          token,
          emailTokenExpirationTime
        ),
        sendVerificationEmail(user.userId, user.email, token),
      ]);
      return res
        .status(403)
        .json({ message: "Token Expired. Verification Email sent again!" });
    }
    return res.status(403).json({ message: "User not verified" });
  }

  const accessToken = jwt.sign(
    { id: user.userId },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "4h",
    }
  );

  return res
    .status(200)
    .json({ accessToken: accessToken, message: "Login Success" });
};

export const verifyUser = async (req: Request, res: Response) => {
  const { userId, token } = req.params;
  try {
    const userVerification = await UserService.findUserVerification(
      parseInt(userId)
    );

    if (
      !userVerification ||
      userVerification.expiresAt < new Date() ||
      userVerification.token !== token
    ) {
      return res
        .status(403)
        .sendFile("errorVerification.html", { root: "./src/templates" });
    }

    // Verify user
    await UserService.verifyUser(parseInt(userId));

    // Delete verification token
    await UserService.deleteUserVerification(parseInt(userId));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.sendFile("userVerified.html", { root: "./src/templates" });
};
