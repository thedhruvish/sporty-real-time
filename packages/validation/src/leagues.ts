import { z } from "zod";

export const createLeagueSchema = z.object({
  sportId: z.uuid(),
  name: z.string().min(1).max(100),
  country: z.string().min(1).max(50).optional(),
  slug: z.string().min(1).max(100),
});

export const updateLeagueSchema = createLeagueSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
