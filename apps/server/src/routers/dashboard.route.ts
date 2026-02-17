import { Router } from "express";
import {
  getHomeDashboardHandler,
  resetDBHandler,
} from "@/constrollers/dashboard.controller.js";

const router: Router = Router();

router.get("/home", getHomeDashboardHandler);

router.delete("/reset", resetDBHandler);

export default router;
