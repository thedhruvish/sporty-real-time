import { createMatchSchema, updateMatchSchema } from "@sporty/validation";
import { Router } from "express";
import {
  createMatchHandler,
  deleteMatchHandler,
  getMatchByIdHandler,
  listMatchesHandler,
  updateMatchHandler,
} from "@/constrollers/matches.controller.js";
import paramsValidation from "@/middlewares/params-validation.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router: Router = Router();

router
  .route("/")
  .get(listMatchesHandler)
  .post(validate({ body: createMatchSchema }), createMatchHandler);

router.param("id", paramsValidation);

router
  .route("/:id")
  .get(getMatchByIdHandler)
  .patch(validate({ body: updateMatchSchema }), updateMatchHandler)
  .delete(deleteMatchHandler);

export default router;
