import { eq } from "drizzle-orm";
import { db } from "@/db/db.js";
import { users } from "@/db/schema/users.js";
import { ApiError } from "@/utils/Api-response.js";

export type PublicUser = {
  id: string;
  email: string;
  createdAt: Date;
};

const notFound = (id: string) => new ApiError(404, "User not found", { id });

export const listUsers = async (): Promise<PublicUser[]> => {
  return db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users);
};

export const getUserById = async (id: string): Promise<PublicUser> => {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id));
  if (!user) {
    throw notFound(id);
  }
  return user;
};
