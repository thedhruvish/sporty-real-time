import { db, desc } from "@sporty/db";
import { liveEvents, matches } from "@sporty/db/schema";
import type { Request, Response } from "express";
import { sendResponse } from "@/utils/Api-response";

export const getHomeDashboardHandler = async (_req: Request, res: Response) => {
  // Fetch matches with relations
  const matchesData = await db.query.matches.findMany({
    with: {
      sport: true,
      league: true,
      teamA: true,
      teamB: true,
    },
    orderBy: [desc(matches.startTime)],
    limit: 50,
  });

  // Fetch latest live events
  const liveEventsData = await db
    .select()
    .from(liveEvents)
    .orderBy(desc(liveEvents.createdAt))
    .limit(50);

  return sendResponse(res, 200, "Dashboard data fetched", {
    matches: matchesData,
    liveEvents: liveEventsData,
  });
};
