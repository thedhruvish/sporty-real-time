import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { matches } from "./matches";

/**
 *
 * Used for WebSocket real-time feeds
 */
export const liveEvents = pgTable(
  "live_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    matchId: uuid("match_id")
      .references(() => matches.id)
      .notNull(),

    eventSequence: integer("event_sequence").notNull(),

    eventType: varchar("event_type", { length: 50 }).notNull(),

    message: text("message").notNull(),

    meta: jsonb("meta"),

    isHighlight: boolean("is_highlight").default(false),

    deletedAt: timestamp("deleted_at"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_live_events_match_id").on(table.matchId),

    index("idx_live_events_created_at").on(table.createdAt),

    index("idx_live_events_match_sequence").on(
      table.matchId,
      table.eventSequence,
    ),
  ],
);
