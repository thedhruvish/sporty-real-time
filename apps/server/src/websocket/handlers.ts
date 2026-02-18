import type { IncomingMessage } from "node:http";
import { type ClientWsMessage, ClientWstEvent } from "@sporty/inter-types/ws";
import type { WebSocket } from "ws";

export const clients = new Map<string, Set<WebSocket>>();

export const handler = (ws: WebSocket, _req: IncomingMessage) => {
  ws.on("message", (raw) => {
    let msg: ClientWsMessage;
    try {
      msg = JSON.parse(raw.toString()) as ClientWsMessage;
    } catch {
      return;
    }

    if (msg.event === ClientWstEvent.SUBSCRIBE_MATCH) {
      const { matchId } = msg.data;
      if (!clients.has(matchId)) {
        clients.set(matchId, new Set());
      }
      clients.get(matchId)?.add(ws);
      ws.send(JSON.stringify({ event: "subscribed", data: { matchId } }));
    } else if (msg.event === ClientWstEvent.UNSUBSCRIBE_MATCH) {
      const { matchId } = msg.data;
      clients.get(matchId)?.delete(ws);
      ws.send(JSON.stringify({ event: "unsubscribed", data: { matchId } }));
    }
  });

  ws.on("close", () => {
    clients.forEach((matchClients) => {
      if (matchClients.has(ws)) {
        matchClients.delete(ws);
      }
    });
  });
};
