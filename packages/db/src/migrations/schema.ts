import { pgTable, uniqueIndex, uuid, text, timestamp, unique, varchar, boolean, foreignKey, index, integer, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("users_email_unique").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const sports = pgTable("sports", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	slug: varchar({ length: 50 }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("sports_slug_unique").on(table.slug),
]);

export const leagues = pgTable("leagues", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sportId: uuid("sport_id").notNull(),
	name: varchar({ length: 100 }).notNull(),
	country: varchar({ length: 50 }),
	slug: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.sportId],
			foreignColumns: [sports.id],
			name: "leagues_sport_id_sports_id_fk"
		}),
]);

export const matches = pgTable("matches", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sportId: uuid("sport_id").notNull(),
	leagueId: uuid("league_id"),
	teamAId: uuid("team_a_id").notNull(),
	teamBId: uuid("team_b_id").notNull(),
	status: varchar({ length: 20 }).notNull(),
	startTime: timestamp("start_time", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.sportId],
			foreignColumns: [sports.id],
			name: "matches_sport_id_sports_id_fk"
		}),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "matches_league_id_leagues_id_fk"
		}),
	foreignKey({
			columns: [table.teamAId],
			foreignColumns: [teams.id],
			name: "matches_team_a_id_teams_id_fk"
		}),
	foreignKey({
			columns: [table.teamBId],
			foreignColumns: [teams.id],
			name: "matches_team_b_id_teams_id_fk"
		}),
]);

export const liveEvents = pgTable("live_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	matchId: uuid("match_id").notNull(),
	eventSequence: integer("event_sequence").notNull(),
	eventType: varchar("event_type", { length: 50 }).notNull(),
	message: text().notNull(),
	meta: jsonb(),
	isHighlight: boolean("is_highlight").default(false),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_live_events_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_live_events_match_id").using("btree", table.matchId.asc().nullsLast().op("uuid_ops")),
	index("idx_live_events_match_sequence").using("btree", table.matchId.asc().nullsLast().op("int4_ops"), table.eventSequence.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.id],
			name: "live_events_match_id_matches_id_fk"
		}),
]);

export const teams = pgTable("teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sportId: uuid("sport_id").notNull(),
	name: varchar({ length: 100 }).notNull(),
	shortCode: varchar("short_code", { length: 10 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.sportId],
			foreignColumns: [sports.id],
			name: "teams_sport_id_sports_id_fk"
		}),
]);
