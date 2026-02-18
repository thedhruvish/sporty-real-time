import type { InferInsertModel, InferSelectModel } from "@sporty/db";
import { and, db, eq, isNull } from "@sporty/db";
import { liveEvents } from "@sporty/db/schema";
import { ServerWsEvent } from "@sporty/inter-types/ws";
import { wsHelper } from "@/index";
import { ApiError } from "@/utils/Api-response";
import { sendToMatch } from "@/websocket/helper";

export type LiveEvent = InferSelectModel<typeof liveEvents>;
export type LiveEventCreate = InferInsertModel<typeof liveEvents>;
export type LiveEventUpdate = Partial<
  Omit<LiveEventCreate, "id" | "createdAt">
>;

const notFound = (id: string) =>
  new ApiError(404, "Live event not found", { id });

export const listLiveEvents = async (): Promise<LiveEvent[]> => {
  wsHelper.broadcast({
    event: ServerWsEvent.CONNECTION_ESTABLISHED,
    data: {
      matchId: "system",

      isHighlight: false,
      payload: {
        random: Math.random(),
      },
    },
  });

  return db.select().from(liveEvents).where(isNull(liveEvents.deletedAt));
};

export const getLiveEventById = async (id: string): Promise<LiveEvent> => {
  const [event] = await db
    .select()
    .from(liveEvents)
    .where(and(eq(liveEvents.id, id), isNull(liveEvents.deletedAt)));
  if (!event) {
    throw notFound(id);
  }
  return event;
};

export const createLiveEvent = async (
  data: LiveEventCreate,
): Promise<LiveEvent> => {
  const [event] = await db.insert(liveEvents).values(data).returning();
  if (!event) {
    throw notFound("Live event not found");
  }

  if (event.eventType === "SCORE_UPDATE") {
    wsHelper.broadcast({
      event: ServerWsEvent.SCORE_UPDATE,
      data: {
        matchId: event.matchId,
        payload: event,
        isHighlight: event.isHighlight ?? false,
      },
    });
  } else {
    sendToMatch(event.matchId, {
      event: event.eventType as ServerWsEvent,
      data: {
        matchId: event.matchId,
        payload: event,
        isHighlight: event.isHighlight ?? false,
      },
    });
  }

  return event;
};

export const updateLiveEvent = async (
  id: string,
  data: LiveEventUpdate,
): Promise<LiveEvent> => {
  const [event] = await db
    .update(liveEvents)
    .set(data)
    .where(and(eq(liveEvents.id, id), isNull(liveEvents.deletedAt)))
    .returning();
  if (!event) {
    throw notFound(id);
  }

  sendToMatch(event.matchId, {
    event: ServerWsEvent.MATCH_UPDATE,
    data: {
      matchId: event.matchId,
      payload: event,
      isHighlight: event.isHighlight ?? false,
    },
  });

  return event;
};

export const deleteLiveEvent = async (id: string): Promise<LiveEvent> => {
  const [event] = await db
    .update(liveEvents)
    .set({ deletedAt: new Date() })
    .where(and(eq(liveEvents.id, id), isNull(liveEvents.deletedAt)))
    .returning();
  if (!event) {
    throw notFound(id);
  }

  sendToMatch(event.matchId, {
    event: ServerWsEvent.MATCH_UPDATE,

    data: {
      matchId: event.matchId,
      isHighlight: event.isHighlight ?? false,
      payload: { id, deleted: true },
    },
  });

  return event;
};
