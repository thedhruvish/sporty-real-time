import { loginSchema } from "@sporty/validation";
import { Router } from "express";
import {
  loginHandler,
  registerHandler,
} from "@/constrollers/auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router: Router = Router();

router.post("/register", validate({ body: loginSchema }), registerHandler);
router.post("/login", validate({ body: loginSchema }), loginHandler);

export default router;
