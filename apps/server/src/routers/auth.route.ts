import { loginSchema } from "@sporty/validation";
import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  getCurrentUserHandler,
  tokenCreateForWebTokenHandler,
} from "@/constrollers/auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { requireAuth } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", validate({ body: loginSchema }), registerHandler);
router.post("/login", validate({ body: loginSchema }), loginHandler);

router.use(requireAuth);

router.get("/me", getCurrentUserHandler);
router.get("/token", tokenCreateForWebTokenHandler);

export default router;
