import type { RequestHandler } from "express";
import z, { type ZodType } from "zod";
import { ApiError } from "@/utils/Api-response.js";

type ValidationSchema = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validate = (schema: ValidationSchema): RequestHandler => {
  return (req, _res, next) => {
    if (schema.body) {
      const result = schema.body.safeParse(req.body);
      if (!result.success) {
        const flattened = z.flattenError(result.error);

        return next(new ApiError(400, "Validation error", flattened));
      }
      req.body = result.data;
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params);
      if (!result.success) {
        const flattened = z.flattenError(result.error);

        return next(new ApiError(400, "Validation error", flattened));
      }
      // biome-ignore lint/suspicious/noExplicitAny: it ok
      req.params = result.data as any;
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query);
      if (!result.success) {
        const flattened = z.flattenError(result.error);

        return next(new ApiError(400, "Validation error", flattened));
      }
      // biome-ignore lint/suspicious/noExplicitAny: it ok
      req.query = result.data as any;
    }

    next();
  };
};
