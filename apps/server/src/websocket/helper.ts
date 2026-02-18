import WebSocket from "ws";
import { clients } from "./handlers";
import type { ServerWsMessage } from "@sporty/inter-types/ws";

export const sendToMatch = (matchId: string, payload: ServerWsMessage) => {
  const matchClients = clients.get(matchId);
  if (matchClients) {
    matchClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  }
};

export const broadcast = (
  allClients: Set<WebSocket>,
  payload: ServerWsMessage,
) => {
  allClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
};
