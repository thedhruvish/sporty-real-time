import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "@/utils/Api-response";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { token } = req.cookies;
  
  if (!token) {
    return next(new ApiError(401, "Unauthorized..."));
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ApiError(500, "JWT secret not configured"));
  }

  try {
    const payload = (await jwt.verify(token, secret)) as {
      sub: string;
      email: string;
    };
    req.user = payload;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid token"));
  }
};
