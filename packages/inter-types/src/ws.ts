export enum ClientWstEvent {
  SUBSCRIBE_MATCH = "SUBSCRIBE_MATCH",
  UNSUBSCRIBE_MATCH = "UNSUBSCRIBE_MATCH",
}

export type ClientWsMessage = {
  event: ClientWstEvent;
  data: {
    matchId: string;
  };
};

export enum ServerWsEvent {
  MATCH_UPDATE = "MATCH_UPDATE",
  CONNECTION_ESTABLISHED = "CONNECTION_ESTABLISHED",
  ERROR = "ERROR",
  GOAL = "GOAL",
  RED_CARD = "RED_CARD",
  YELLOW_CARD = "YELLOW_CARD",
  PENALTY = "PENALTY",
  SUBSTITUTION = "SUBSTITUTION",
  VAR_DECISION = "VAR_DECISION",
  MATCH_START = "MATCH_START",
  MATCH_END = "MATCH_END",
  HALFTIME = "HALFTIME",
  SECOND_HALF_START = "SECOND_HALF_START",
  OWN_GOAL = "OWN_GOAL",
  SCORE_UPDATE = "SCORE_UPDATE",
}

export type ServerWsMessage = {
  event: ServerWsEvent;
  data: {
    matchId: string;
    payload: any;
    isHighlight: boolean;
  };
};

