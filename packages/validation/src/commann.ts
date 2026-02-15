import z from "zod";

export const idValidators = z.object({
  id: z.string({ error: "Id is required" }),
});

export type IdType = z.infer<typeof idValidators>;
