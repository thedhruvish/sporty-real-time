import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { sports } from "./sports.js";

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  sportId: uuid("sport_id")
    .references(() => sports.id)
    .notNull(),

  name: varchar("name", { length: 100 }).notNull(), // India, RCB
  shortCode: varchar("short_code", { length: 10 }), // IND, RCB
  createdAt: timestamp("created_at").defaultNow(),
});
