import { relations } from "drizzle-orm/relations";
import { sports, leagues, matches, teams, liveEvents } from "./schema";

export const leaguesRelations = relations(leagues, ({one, many}) => ({
	sport: one(sports, {
		fields: [leagues.sportId],
		references: [sports.id]
	}),
	matches: many(matches),
}));

export const sportsRelations = relations(sports, ({many}) => ({
	leagues: many(leagues),
	matches: many(matches),
	teams: many(teams),
}));

export const matchesRelations = relations(matches, ({one, many}) => ({
	sport: one(sports, {
		fields: [matches.sportId],
		references: [sports.id]
	}),
	league: one(leagues, {
		fields: [matches.leagueId],
		references: [leagues.id]
	}),
	team_teamAId: one(teams, {
		fields: [matches.teamAId],
		references: [teams.id],
		relationName: "matches_teamAId_teams_id"
	}),
	team_teamBId: one(teams, {
		fields: [matches.teamBId],
		references: [teams.id],
		relationName: "matches_teamBId_teams_id"
	}),
	liveEvents: many(liveEvents),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	matches_teamAId: many(matches, {
		relationName: "matches_teamAId_teams_id"
	}),
	matches_teamBId: many(matches, {
		relationName: "matches_teamBId_teams_id"
	}),
	sport: one(sports, {
		fields: [teams.sportId],
		references: [sports.id]
	}),
}));

export const liveEventsRelations = relations(liveEvents, ({one}) => ({
	match: one(matches, {
		fields: [liveEvents.matchId],
		references: [matches.id]
	}),
}));