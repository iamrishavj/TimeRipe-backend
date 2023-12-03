// user.model.ts
import { z } from "zod";

export interface PublicUser {
  userId: number;
  username: string;
}
export interface PrivateUser extends PublicUser {
  email: string;
  password: string;
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
