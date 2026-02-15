import { idValidators } from "@sporty/validation";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/Api-response.js";

export default function paramsValidation(
  _req: Request,
  _res: Response,
  next: NextFunction,
  id: string | number,
) {
  const result = idValidators.safeParse({ id });
  if (!result.success) {
    throw new ApiError(400, "Invalid Id", {
      id: "Your Id are the wrong",
    });
  }
  next();
}
