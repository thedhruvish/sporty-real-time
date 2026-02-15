import type { IdType } from "@sporty/validation";
import type { Request, Response } from "express";
import { getUserById, listUsers } from "@/services/users.service.js";
import { sendResponse } from "@/utils/Api-response";

export const listUsersHandler = async (_req: Request, res: Response) => {
  const users = await listUsers();
  return sendResponse(res, 200, "Users fetched", users);
};

export const getUserByIdHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const user = await getUserById(req.params.id);
  return sendResponse(res, 200, "User fetched", user);
};
