import WebSocket from "ws";
import { clients } from "./handlers";

export const sendToMatch = (matchId: string, payload: any) => {
  const matchClients = clients.get(matchId);
  if (matchClients) {
    matchClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  }
};

export const broadcast = (allClients: Set<WebSocket>, payload: any) => {
  allClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
};
