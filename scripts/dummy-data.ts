const BASE_URL = "http://localhost:3000/api";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createSlug = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, "-");

const postRequest = async <T>(
  urlPath: string,
  body: any,
  timeout = 5000,
  method = "POST",
): Promise<T> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${BASE_URL}/${urlPath}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `Request to "${urlPath}" failed: ${response.status} ${response.statusText} - ${text}`,
      );
    }

    const json = JSON.parse(text);
    return json.data ?? (json as T);
  } finally {
    clearTimeout(id);
  }
};

const createSport = (name: string) =>
  postRequest("sports", {
    name,
    slug: createSlug(name),
    isActive: true,
  });

const createLeague = (name: string, sportId: string, country: string) =>
  postRequest("leagues", {
    name,
    country,
    sportId,
    slug: createSlug(name),
  });

const createTeam = (name: string, sportId: string, shortCode: string) =>
  postRequest("teams", {
    name,
    sportId,
    shortCode,
  });

const createMatch = (
  sportId: string,
  leagueId: string,
  teamAId: string,
  teamBId: string,
  startTime: string,
) =>
  postRequest("matches", {
    sportId,
    leagueId,
    teamAId,
    teamBId,
    startTime,
    status: "live",
  });

const matchStatusChange = (matchId: string, status: string) =>
  postRequest(
    `matches/${matchId}`,
    {
      status,
    },
    5000,
    "PATCH",
  );

const createLiveEvent = (
  matchId: string,
  eventSequence: number,
  eventType: string,
  message: string,
  meta: Record<string, unknown>,
  isHighlight: boolean,
) =>
  postRequest<void>("live-events", {
    matchId,
    eventSequence,
    eventType,
    message,
    meta,
    isHighlight,
  });

const EVENTS = [
  "MATCH_UPDATE",
  "GOAL",
  "RED_CARD",
  "YELLOW_CARD",
  "PENALTY",
  "SUBSTITUTION",
  "VAR_DECISION",
  "MATCH_START",
  "MATCH_END",
  "HALFTIME",
  "SECOND_HALF_START",
  "OWN_GOAL",
  "SCORE_UPDATE",
] as const;

const EVENT_MESSAGES: Record<string, string> = {
  MATCH_UPDATE: "Match Updated",
  GOAL: "Goal Scored",
  RED_CARD: "Red Card Issued",
  YELLOW_CARD: "Yellow Card Issued",
  PENALTY: "Penalty Awarded",
  SUBSTITUTION: "Substitution Made",
  VAR_DECISION: "VAR Decision",
  MATCH_START: "Match Started",
  MATCH_END: "Match Ended",
  HALFTIME: "Halftime",
  SECOND_HALF_START: "Second Half Started",
  OWN_GOAL: "Own Goal",
  SCORE_UPDATE: "Score Update",
};

const SCORE_META = Array.from({ length: 10 }, (_, i) => ({
  score: `${i + 1}-${Math.floor(Math.random() * 10)}`,
}));

const main = async () => {
  const sports = await Promise.all([
    createSport("Cricket"),
    createSport("Football"),
    createSport("Basketball"),
    createSport("Tennis"),
    createSport("Volleyball"),
  ]);

  const leagues = await Promise.all([
    createLeague("Premier League", sports[0].id, "England"),
    createLeague("La Liga", sports[1].id, "Spain"),
    createLeague("Serie A", sports[2].id, "Italy"),
    createLeague("Bundesliga", sports[3].id, "Germany"),
    createLeague("Ligue 1", sports[4].id, "France"),
  ]);

  const teams = await Promise.all([
    createTeam("Team A", sports[0].id, "TA"),
    createTeam("Team B", sports[1].id, "TB"),
    createTeam("Team C", sports[2].id, "TC"),
    createTeam("Team D", sports[3].id, "TD"),
    createTeam("Team E", sports[4].id, "TE"),
    createTeam("Team F", sports[0].id, "TF"),
    createTeam("Team G", sports[1].id, "TG"),
    createTeam("Team H", sports[2].id, "TH"),
    createTeam("Team I", sports[3].id, "TI"),
    createTeam("Team J", sports[4].id, "TJ"),
  ]);

  const startTime = new Date().toISOString();

  const matches = await Promise.all([
    createMatch(
      sports[0].id,
      leagues[0].id,
      teams[0].id,
      teams[1].id,
      startTime,
    ),
    createMatch(
      sports[1].id,
      leagues[1].id,
      teams[2].id,
      teams[3].id,
      startTime,
    ),
    createMatch(
      sports[2].id,
      leagues[2].id,
      teams[4].id,
      teams[5].id,
      startTime,
    ),
    createMatch(
      sports[3].id,
      leagues[3].id,
      teams[6].id,
      teams[7].id,
      startTime,
    ),
    createMatch(
      sports[4].id,
      leagues[4].id,
      teams[8].id,
      teams[9].id,
      startTime,
    ),
  ]);

  console.log("Data seeded. Starting live events...");

  process.on("SIGINT", () => {
    console.log("\n Live events stopped.");
    process.exit(0);
  });

  const blackListedMatches = new Set<string>();

  while (true) {
    const activeMatches = matches.filter((m) => !blackListedMatches.has(m.id));

    if (activeMatches.length === 0) {
      console.log("All matches completed. Exiting...");
      break;
    }

    const eventType = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    const match =
      activeMatches[Math.floor(Math.random() * activeMatches.length)];
    console.log("Evenet Added......", eventType);
    await createLiveEvent(
      match.id,
      Math.floor(Math.random() * 100),
      eventType,
      EVENT_MESSAGES[eventType],
      SCORE_META[Math.floor(Math.random() * SCORE_META.length)],
      Math.random() > 0.5,
    );

    if (eventType === "MATCH_END") {
      await matchStatusChange(match.id, "completed");
      blackListedMatches.add(match.id);
      console.log(`Match Completed: ${match.id}`);
    }

    await sleep(500 + Math.random() * 1000);
  }
};

const resetDB = async () => {
  await fetch(`${BASE_URL}/dashboard/reset`, {
    method: "DELETE",
  });
};

resetDB().then(main).catch(console.error);
