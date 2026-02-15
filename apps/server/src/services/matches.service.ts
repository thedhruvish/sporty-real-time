import type { InferInsertModel, InferSelectModel } from "@sporty/db";
import { db, eq } from "@sporty/db";
import { matches } from "@sporty/db/schema";
import { ApiError } from "@/utils/Api-response";

export type Match = InferSelectModel<typeof matches>;
export type MatchCreate = InferInsertModel<typeof matches>;
export type MatchUpdate = Partial<Omit<MatchCreate, "id" | "createdAt">>;

const notFound = (id: string) => new ApiError(404, "Match not found", { id });

export const listMatches = async (): Promise<Match[]> => {
  return db.select().from(matches);
};

export const getMatchById = async (id: string): Promise<Match> => {
  const [match] = await db.select().from(matches).where(eq(matches.id, id));
  if (!match) {
    throw notFound(id);
  }
  return match;
};

export const createMatch = async (data: MatchCreate): Promise<Match> => {
  const [match] = await db.insert(matches).values(data).returning();
  if (!match) {
    throw notFound("Match not found");
  }
  return match;
};

export const updateMatch = async (
  id: string,
  data: MatchUpdate,
): Promise<Match> => {
  const [match] = await db
    .update(matches)
    .set(data)
    .where(eq(matches.id, id))
    .returning();
  if (!match) {
    throw notFound(id);
  }
  return match;
};

export const deleteMatch = async (id: string): Promise<Match> => {
  const [match] = await db
    .delete(matches)
    .where(eq(matches.id, id))
    .returning();
  if (!match) {
    throw notFound(id);
  }
  return match;
};
