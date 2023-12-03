// user.model.ts
import { z } from "zod";

export interface User {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
}

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password should be at least 6 characters long"),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
