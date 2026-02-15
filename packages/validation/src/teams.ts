import { z } from "zod";

export const createTeamSchema = z.object({
  sportId: z.uuid(),
  name: z.string().min(1).max(100),
  shortCode: z.string().min(1).max(10).optional(),
});

export const updateTeamSchema = createTeamSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
