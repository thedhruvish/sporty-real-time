import type { IdType } from "@sporty/validation";
import type { Request, Response } from "express";
import {
  createLeague,
  deleteLeague,
  getLeagueById,
  listLeagues,
  updateLeague,
} from "@/services/leagues.service.js";
import { sendResponse } from "@/utils/Api-response.js";

export const createLeagueHandler = async (req: Request, res: Response) => {
  const league = await createLeague(req.body);
  return sendResponse(res, 201, "League created", league);
};

export const listLeaguesHandler = async (_req: Request, res: Response) => {
  const leagues = await listLeagues();
  return sendResponse(res, 200, "Leagues fetched", leagues);
};

export const getLeagueByIdHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const league = await getLeagueById(req.params.id);
  return sendResponse(res, 200, "League fetched", league);
};

export const updateLeagueHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const league = await updateLeague(req.params.id, req.body);
  return sendResponse(res, 200, "League updated", league);
};

export const deleteLeagueHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const league = await deleteLeague(req.params.id);
  return sendResponse(res, 200, "League deleted", league);
};
