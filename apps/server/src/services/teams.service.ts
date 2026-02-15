import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "@/db/db.js";
import { teams } from "@/db/schema/teams.js";
import { ApiError } from "@/utils/Api-response.js";

export type Team = InferSelectModel<typeof teams>;
export type TeamCreate = InferInsertModel<typeof teams>;
export type TeamUpdate = Partial<Omit<TeamCreate, "id" | "createdAt">>;

const notFound = (id: string) => new ApiError(404, "Team not found", { id });

export const listTeams = async (): Promise<Team[]> => {
  return db.select().from(teams);
};

export const getTeamById = async (id: string): Promise<Team> => {
  const [team] = await db.select().from(teams).where(eq(teams.id, id));
  if (!team) {
    throw notFound(id);
  }
  return team;
};

export const createTeam = async (data: TeamCreate): Promise<Team> => {
  const [team] = await db.insert(teams).values(data).returning();
  if (!team) {
    throw notFound("Team not found");
  }
  return team;
};

export const updateTeam = async (
  id: string,
  data: TeamUpdate,
): Promise<Team> => {
  const [team] = await db
    .update(teams)
    .set(data)
    .where(eq(teams.id, id))
    .returning();
  if (!team) {
    throw notFound(id);
  }
  return team;
};

export const deleteTeam = async (id: string): Promise<Team> => {
  const [team] = await db.delete(teams).where(eq(teams.id, id)).returning();
  if (!team) {
    throw notFound(id);
  }
  return team;
};
