import { Router } from "express";
import { getHomeDashboardHandler } from "@/constrollers/dashboard.controller.js";

const router: Router = Router();

router.get("/home", getHomeDashboardHandler);

export default router;
