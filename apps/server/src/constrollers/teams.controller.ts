import type { IdType } from "@sporty/validation";
import type { Request, Response } from "express";
import {
  createTeam,
  deleteTeam,
  getTeamById,
  listTeams,
  updateTeam,
} from "@/services/teams.service.js";
import { sendResponse } from "@/utils/Api-response.js";

export const createTeamHandler = async (req: Request, res: Response) => {
  const team = await createTeam(req.body);
  return sendResponse(res, 201, "Team created", team);
};

export const listTeamsHandler = async (_req: Request, res: Response) => {
  const teams = await listTeams();
  return sendResponse(res, 200, "Teams fetched", teams);
};

export const getTeamByIdHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const team = await getTeamById(req.params.id);
  return sendResponse(res, 200, "Team fetched", team);
};

export const updateTeamHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const team = await updateTeam(req.params.id, req.body);
  return sendResponse(res, 200, "Team updated", team);
};

export const deleteTeamHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const team = await deleteTeam(req.params.id);
  return sendResponse(res, 200, "Team deleted", team);
};
