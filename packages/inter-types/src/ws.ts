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
