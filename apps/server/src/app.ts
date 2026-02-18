import { env } from "@sporty/env/server";
import cors from "cors";
import express, { type Express } from "express";
import { errorMiddleware } from "@/middlewares/globe-error.middleware.js";
import authRouter from "@/routers/auth.route.js";
import dashboardRouter from "@/routers/dashboard.route.js";
import leaguesRouter from "@/routers/leagues.route.js";
import liveEventsRouter from "@/routers/live-devents.route.js";
import matchesRouter from "@/routers/matches.route.js";
import sportsRouter from "@/routers/sports.route.js";
import teamsRouter from "@/routers/teams.route.js";
import usersRouter from "@/routers/users.route.js";

const app: Express = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    statusCode: 200,
    message: "Ok",
  });
});

app.use("/api/auth", authRouter);

app.use("/api/users", usersRouter);
app.use("/api/sports", sportsRouter);
app.use("/api/leagues", leaguesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/live-events", liveEventsRouter);

app.use(errorMiddleware);

export default app;
