import {
  createLiveEventSchema,
  updateLiveEventSchema,
} from "@sporty/validation";
import { Router } from "express";
import {
  createLiveEventHandler,
  deleteLiveEventHandler,
  getLiveEventByIdHandler,
  listLiveEventsHandler,
  updateLiveEventHandler,
} from "@/constrollers/live-devents.controller.js";
import paramsValidation from "@/middlewares/params-validation.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router: Router = Router();

router
  .route("/")
  .get(listLiveEventsHandler)
  .post(validate({ body: createLiveEventSchema }), createLiveEventHandler);

router.param("id", paramsValidation);
router
  .route("/:id")
  .get(getLiveEventByIdHandler)
  .patch(validate({ body: updateLiveEventSchema }), updateLiveEventHandler)
  .delete(deleteLiveEventHandler);

export default router;
