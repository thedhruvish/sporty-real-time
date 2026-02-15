import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { leagues } from "./leagues";
import { sports } from "./sports";
import { teams } from "./teams";

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),

  sportId: uuid("sport_id")
    .references(() => sports.id)
    .notNull(),

  leagueId: uuid("league_id").references(() => leagues.id),

  teamAId: uuid("team_a_id")
    .references(() => teams.id)
    .notNull(),

  teamBId: uuid("team_b_id")
    .references(() => teams.id)
    .notNull(),

  status: varchar("status", { length: 20 }).notNull(),
  // scheduled | live | completed

  startTime: timestamp("start_time"),
  createdAt: timestamp("created_at").defaultNow(),
});
