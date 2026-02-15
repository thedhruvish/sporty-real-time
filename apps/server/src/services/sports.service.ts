import type { InferInsertModel, InferSelectModel } from "@sporty/db";
import { db, eq } from "@sporty/db";
import { sports } from "@sporty/db/schema";

import { ApiError } from "@/utils/Api-response";

export type Sport = InferSelectModel<typeof sports>;
export type SportCreate = InferInsertModel<typeof sports>;
export type SportUpdate = Partial<Omit<SportCreate, "id" | "createdAt">>;

const notFound = (id: string) => new ApiError(404, "Sport not found", { id });

export const listSports = async (): Promise<Sport[]> => {
  return db.select().from(sports);
};

export const getSportById = async (id: string): Promise<Sport> => {
  const [sport] = await db.select().from(sports).where(eq(sports.id, id));
  if (!sport) {
    throw notFound(id);
  }
  return sport;
};

export const createSport = async (data: SportCreate): Promise<Sport> => {
  const isExist = await db
    .select()
    .from(sports)
    .where(eq(sports.slug, data.slug));

  if (isExist.length > 0) {
    throw new ApiError(400, "Sport already slug exists");
  }

  const [sport] = await db.insert(sports).values(data).returning();

  if (!sport) {
    throw notFound("Sport not found");
  }
  return sport;
};

export const updateSport = async (
  id: string,
  data: SportUpdate,
): Promise<Sport> => {
  const [sport] = await db
    .update(sports)
    .set(data)
    .where(eq(sports.id, id))
    .returning();
  if (!sport) {
    throw notFound(id);
  }
  return sport;
};

export const deleteSport = async (id: string): Promise<Sport> => {
  const [sport] = await db.delete(sports).where(eq(sports.id, id)).returning();
  if (!sport) {
    throw notFound(id);
  }
  return sport;
};
