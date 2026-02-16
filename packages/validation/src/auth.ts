import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2).max(100).optional(),
});
