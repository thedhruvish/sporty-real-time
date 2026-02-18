import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "@/utils/Api-response";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ApiError(500, "JWT secret not configured"));
  }

  try {
    const payload = jwt.verify(token, secret) as { id: string; email: string };
    req.user = payload;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid token"));
  }
};
