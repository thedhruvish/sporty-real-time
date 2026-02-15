import type { IdType } from "@sporty/validation";
import type { Request, Response } from "express";
import {
  createSport,
  deleteSport,
  getSportById,
  listSports,
  updateSport,
} from "@/services/sports.service.js";
import { sendResponse } from "@/utils/Api-response.js";

export const createSportHandler = async (req: Request, res: Response) => {
  const sport = await createSport(req.body);
  return sendResponse(res, 201, "Sport created", sport);
};

export const listSportsHandler = async (_req: Request, res: Response) => {
  const sports = await listSports();
  return sendResponse(res, 200, "Sports fetched", sports);
};

export const getSportByIdHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const sport = await getSportById(req.params.id);
  return sendResponse(res, 200, "Sport fetched", sport);
};

export const updateSportHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const sport = await updateSport(req.params.id, req.body);
  return sendResponse(res, 200, "Sport updated", sport);
};

export const deleteSportHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const sport = await deleteSport(req.params.id);
  return sendResponse(res, 200, "Sport deleted", sport);
};
