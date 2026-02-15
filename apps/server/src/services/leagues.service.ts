import type { InferInsertModel, InferSelectModel } from "@sporty/db";
import { db, eq } from "@sporty/db";
import { leagues } from "@sporty/db/schema";
import { ApiError } from "@/utils/Api-response";

export type League = InferSelectModel<typeof leagues>;
export type LeagueCreate = InferInsertModel<typeof leagues>;
export type LeagueUpdate = Partial<Omit<LeagueCreate, "id" | "createdAt">>;

const notFound = (id: string) => new ApiError(404, "League not found", { id });

export const listLeagues = async (): Promise<League[]> => {
  return db.select().from(leagues);
};

export const getLeagueById = async (id: string): Promise<League> => {
  const [league] = await db.select().from(leagues).where(eq(leagues.id, id));
  if (!league) {
    throw notFound(id);
  }
  return league;
};

export const createLeague = async (data: LeagueCreate): Promise<League> => {
  const [league] = await db.insert(leagues).values(data).returning();
  if (!league) {
    throw notFound("League not found");
  }
  return league;
};

export const updateLeague = async (
  id: string,
  data: LeagueUpdate,
): Promise<League> => {
  const [league] = await db
    .update(leagues)
    .set(data)
    .where(eq(leagues.id, id))
    .returning();
  if (!league) {
    throw notFound(id);
  }
  return league;
};

export const deleteLeague = async (id: string): Promise<League> => {
  const [league] = await db
    .delete(leagues)
    .where(eq(leagues.id, id))
    .returning();
  if (!league) {
    throw notFound(id);
  }
  return league;
};
