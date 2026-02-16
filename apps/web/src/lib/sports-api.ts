// API Service for Sports Backend
import type {
  ApiResponse,
  League,
  LiveEvent,
  Match,
  PaginatedResponse,
  Sport,
  Team,
} from "@/types/sports";

const API_BASE_URL = "/api";

// Helper function for API calls
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ==================== SPORTS ====================
export async function getSports(): Promise<Sport[]> {
  const response = await fetchApi<PaginatedResponse<Sport>>("/sports");
  return response.data || [];
}

export async function getSport(id: string): Promise<Sport | null> {
  try {
    const response = await fetchApi<ApiResponse<Sport>>(`/sports/${id}`);
    return response.data || null;
  } catch {
    return null;
  }
}

// ==================== LEAGUES ====================
export async function getLeagues(): Promise<League[]> {
  const response = await fetchApi<PaginatedResponse<League>>("/leagues");
  return response.data || [];
}

export async function getLeague(id: string): Promise<League | null> {
  try {
    const response = await fetchApi<ApiResponse<League>>(`/leagues/${id}`);
    return response.data || null;
  } catch {
    return null;
  }
}

// ==================== TEAMS ====================
export async function getTeams(): Promise<Team[]> {
  const response = await fetchApi<PaginatedResponse<Team>>("/teams");
  return response.data || [];
}

export async function getTeam(id: string): Promise<Team | null> {
  try {
    const response = await fetchApi<ApiResponse<Team>>(`/teams/${id}`);
    return response.data || null;
  } catch {
    return null;
  }
}

// ==================== MATCHES ====================
export async function getMatches(): Promise<Match[]> {
  const response = await fetchApi<PaginatedResponse<Match>>("/matches");
  return response.data || [];
}

export async function getMatch(id: string): Promise<Match | null> {
  try {
    const response = await fetchApi<ApiResponse<Match>>(`/matches/${id}`);
    return response.data || null;
  } catch {
    return null;
  }
}

export async function getLiveMatches(): Promise<Match[]> {
  const allMatches = await getMatches();
  return allMatches.filter(
    (match) => match.status === "live" || match.status === "halftime",
  );
}

export async function getMatchesByStatus(
  status: Match["status"],
): Promise<Match[]> {
  const allMatches = await getMatches();
  return allMatches.filter((match) => match.status === status);
}

// ==================== LIVE EVENTS ====================
export async function getLiveEvents(matchId?: string): Promise<LiveEvent[]> {
  const response = await fetchApi<PaginatedResponse<LiveEvent>>("/live-events");
  const events = response.data || [];

  if (matchId) {
    return events.filter((event) => event.matchId === matchId);
  }

  return events;
}

export async function getLiveEvent(id: string): Promise<LiveEvent | null> {
  try {
    const response = await fetchApi<ApiResponse<LiveEvent>>(
      `/live-events/${id}`,
    );
    return response.data || null;
  } catch {
    return null;
  }
}

// ==================== HEALTH CHECK ====================
export async function healthCheck(): Promise<{ message: string }> {
  return fetchApi<{ message: string }>("/");
}
