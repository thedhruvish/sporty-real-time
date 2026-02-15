import { z } from "zod";

export const createLiveEventSchema = z.object({
  matchId: z.uuid(),
  eventSequence: z.number().int().nonnegative(),
  eventType: z.string().min(1).max(50),
  message: z.string().min(1),
  meta: z.record(z.any(), z.unknown()).optional(),
  isHighlight: z.boolean().optional(),
});

export const updateLiveEventSchema = createLiveEventSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
