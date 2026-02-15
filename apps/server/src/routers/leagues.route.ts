import { createLeagueSchema, updateLeagueSchema } from "@sporty/validation";
import { Router } from "express";
import {
  createLeagueHandler,
  deleteLeagueHandler,
  getLeagueByIdHandler,
  listLeaguesHandler,
  updateLeagueHandler,
} from "@/constrollers/leagues.controller.js";
import paramsValidation from "@/middlewares/params-validation.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router: Router = Router();

router
  .route("/")
  .get(listLeaguesHandler)
  .post(validate({ body: createLeagueSchema }), createLeagueHandler);

router.param("id", paramsValidation);

router
  .route("/:id")
  .get(getLeagueByIdHandler)
  .patch(validate({ body: updateLeagueSchema }), updateLeagueHandler)
  .delete(deleteLeagueHandler);

export default router;
