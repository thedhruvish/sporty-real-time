import { createSportSchema } from "@sporty/validation";
import { Router } from "express";
import {
  createSportHandler,
  deleteSportHandler,
  getSportByIdHandler,
  listSportsHandler,
  updateSportHandler,
} from "@/constrollers/sports.controller.js";
import paramsValidation from "@/middlewares/params-validation.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router: Router = Router();

router
  .route("/")
  .get(listSportsHandler)
  .post(validate({ body: createSportSchema }), createSportHandler);

router.param("id", paramsValidation);

router
  .route("/:id")
  .get(getSportByIdHandler)
  .patch(validate({ body: updateSportSchema }), updateSportHandler)
  .delete(deleteSportHandler);

export default router;
