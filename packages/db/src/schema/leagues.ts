import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { sports } from "./sports.js";

export const leagues = pgTable("leagues", {
  id: uuid("id").defaultRandom().primaryKey(),
  sportId: uuid("sport_id")
    .references(() => sports.id)
    .notNull(),

  name: varchar("name", { length: 100 }).notNull(), // IPL, EPL
  country: varchar("country", { length: 50 }),
  slug: varchar("slug", { length: 100 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
