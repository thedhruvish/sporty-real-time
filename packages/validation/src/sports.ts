import { z } from "zod";

export const createSportSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  isActive: z.boolean().optional(),
});

export const updateSportSchema = createSportSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
