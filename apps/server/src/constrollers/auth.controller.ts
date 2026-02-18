import type { Request, Response } from "express";
import {
  loginUser,
  registerUser,
  getUser,
  generateSocketToken,
} from "@/services/auth.service.js";
import { ApiError, sendResponse } from "@/utils/Api-response";

export const registerHandler = async (req: Request, res: Response) => {
  const result = await registerUser(req.body.email, req.body.password);
  res.cookie("token", result.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return sendResponse(res, 201, "User registered", result);
};

export const loginHandler = async (req: Request, res: Response) => {
  const result = await loginUser(req.body.email, req.body.password);

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return sendResponse(res, 200, "Login successful", result);
};

export const getCurrentUserHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await getUser(req.user.sub);
  return sendResponse(res, 200, "User fetched", result);
};

export const logoutHandler = async (_req: Request, res: Response) => {
  return sendResponse(res, 200, "Logout successful", {});
};

export const tokenCreateForWebTokenHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const token = generateSocketToken(req.user);
  return sendResponse(res, 200, "Token created", { token });
};
