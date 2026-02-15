import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/Api-response.js";

const isDev = process.env.NODE_ENV === "development";

export const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  const message =
    err instanceof ApiError ? err.message : "Internal Server Error";

  const errors = err instanceof ApiError ? err.errors : null;

  const response: Record<string, unknown> = {
    statusCode,
    message,
    errors,
  };

  if (isDev) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
