import { z } from "zod";

const statusEnum = z.enum(["scheduled", "live", "completed"]);

export const createMatchSchema = z.object({
  sportId: z.uuid(),
  leagueId: z.uuid().nullable().optional(),
  teamAId: z.uuid(),
  teamBId: z.uuid(),
  status: statusEnum,
  startTime: z.iso.datetime().transform((str) => new Date(str)),
});

export const updateMatchSchema = createMatchSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
