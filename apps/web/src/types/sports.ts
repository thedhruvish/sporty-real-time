// Sports API Types based on Postman collection

export interface Sport {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface League {
  id: string;
  sportId: string;
  name: string;
  country: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  id: string;
  sportId: string;
  name: string;
  shortCode: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "postponed"
  | "cancelled";

export interface MatchScore {
  teamA: number;
  teamB: number;
}

export interface Match {
  id: string;
  sportId: string;
  leagueId: string;
  teamAId: string;
  teamBId: string;
  status: MatchStatus;
  startTime: string;
  score?: MatchScore;
  currentMinute?: number;
  createdAt?: string;
  updatedAt?: string;
  // Populated fields
  sport?: Sport;
  league?: League;
  teamA?: Team;
  teamB?: Team;
}

export type EventType =
  | "goal"
  | "penalty"
  | "own_goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "var_decision"
  | "match_start"
  | "halftime"
  | "second_half_start"
  | "match_end"
  | "other";

export interface LiveEvent {
  id: string;
  matchId: string;
  eventSequence: number;
  eventType: EventType;
  message: string;
  meta?: Record<string, unknown>;
  isHighlight: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Populated fields
  match?: Match;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}
