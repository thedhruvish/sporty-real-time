import type { IdType } from "@sporty/validation";
import type { Request, Response } from "express";
import {
  createMatch,
  deleteMatch,
  getMatchById,
  listMatches,
  updateMatch,
} from "@/services/matches.service.js";
import { sendResponse } from "@/utils/Api-response.js";

export const createMatchHandler = async (req: Request, res: Response) => {
  const match = await createMatch(req.body);
  return sendResponse(res, 201, "Match created", match);
};

export const listMatchesHandler = async (_req: Request, res: Response) => {
  const matches = await listMatches();
  return sendResponse(res, 200, "Matches fetched", matches);
};

export const getMatchByIdHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const match = await getMatchById(req.params.id);
  return sendResponse(res, 200, "Match fetched", match);
};

export const updateMatchHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const match = await updateMatch(req.params.id, req.body);
  return sendResponse(res, 200, "Match updated", match);
};

export const deleteMatchHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const match = await deleteMatch(req.params.id);
  return sendResponse(res, 200, "Match deleted", match);
};
