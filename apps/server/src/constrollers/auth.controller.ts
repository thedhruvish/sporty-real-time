import type { Request, Response } from "express";
import { loginUser, registerUser } from "@/services/auth.service.js";
import { sendResponse } from "@/utils/Api-response.js";

export const registerHandler = async (req: Request, res: Response) => {
  const result = await registerUser(req.body.email, req.body.password);
  return sendResponse(res, 201, "User registered", result);
};

export const loginHandler = async (req: Request, res: Response) => {
  const result = await loginUser(req.body.email, req.body.password);
  return sendResponse(res, 200, "Login successful", result);
};
