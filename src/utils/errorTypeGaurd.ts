import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function isPrismaError(
  error: unknown
): error is PrismaClientKnownRequestError {
  return (error as PrismaClientKnownRequestError).code !== undefined;
}
