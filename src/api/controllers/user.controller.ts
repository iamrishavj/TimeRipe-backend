// user.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import "dotenv/config";

import * as UserService from "../services/user.service";
import { CreateUserInput } from "../models/user.model";
import { isPrismaError } from "../../utils/errorTypeGaurd";

const sendVerificationEmail = async (
  userId: number,
  email: string,
  token: string
) => {
  const transporter = await import("nodemailer").then((module) =>
    module.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      },
    })
  );

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "TimeRipe - Email Verification",
    html: `<h1>Click the link below to verify your email</h1>
    <a href="${process.env.BACKEND_URL}/api/user/verify/${userId}/${token}">Verify Email</a>`,
  };
  await transporter.sendMail(mailOptions);
};

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
    await UserService.createVerificationToken(
      newUserId,
      token,
      1000 * 60 * 60 * 24 // 24 hours
    );

    await sendVerificationEmail(newUserId, email, token);
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

  if (!user) {
    return res.status(403).json({ message: "Invalid Credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ message: "Invalid Credentials" });
  }

  if (!user.isUserVerified) {
    if (await UserService.isTokenExpired(user.userId)) {
      await UserService.deleteUserVerification(user.userId);

      const token = uuidV4();
      await UserService.createVerificationToken(
        user.userId,
        token,
        1000 * 60 * 60 * 24 // 24 hours
      );
      await sendVerificationEmail(user.userId, user.email, token);
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

    if (!userVerification) {
      return res
        .status(403)
        .sendFile("errorVerification.html", { root: "./src/templates" });
    }

    if (userVerification.expiresAt < new Date()) {
      await UserService.deleteUserVerification(parseInt(userId));
      return res
        .status(403)
        .sendFile("errorVerification.html", { root: "./src/templates" });
    }

    if (userVerification.token !== token) {
      return res
        .status(403)
        .sendFile("errorVerification.html", { root: "./src/templates" });
    }
    //Verify user
    await UserService.verifyUser(parseInt(userId));

    //Delete verification token
    await UserService.deleteUserVerification(parseInt(userId));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.sendFile("userVerified.html", { root: "./src/templates" });
};
