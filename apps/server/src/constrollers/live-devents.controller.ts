import type { IdType } from "@sporty/validation";
import type { Request, Response } from "express";
import {
  createLiveEvent,
  deleteLiveEvent,
  getLiveEventById,
  listLiveEvents,
  updateLiveEvent,
} from "@/services/live-devents.service.js";
import { sendResponse } from "@/utils/Api-response.js";

export const createLiveEventHandler = async (req: Request, res: Response) => {
  const event = await createLiveEvent(req.body);
  return sendResponse(res, 201, "Live event created", event);
};

export const listLiveEventsHandler = async (_req: Request, res: Response) => {
  const events = await listLiveEvents();
  return sendResponse(res, 200, "Live events fetched", events);
};

export const getLiveEventByIdHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const event = await getLiveEventById(req.params.id);
  return sendResponse(res, 200, "Live event fetched", event);
};

export const updateLiveEventHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const event = await updateLiveEvent(req.params.id, req.body);
  return sendResponse(res, 200, "Live event updated", event);
};

export const deleteLiveEventHandler = async (
  req: Request<IdType>,
  res: Response,
) => {
  const event = await deleteLiveEvent(req.params.id);
  return sendResponse(res, 200, "Live event deleted", event);
};
