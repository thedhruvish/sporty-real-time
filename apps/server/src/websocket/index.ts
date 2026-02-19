import type { Server } from "node:http";
import type { ServerWsMessage } from "@sporty/inter-types/ws";
import { WebSocketServer } from "ws";
import { handler } from "./handlers";
import { broadcast, sendToMatch } from "./helper";
import { parse } from "node:url";
import { verifySocketToken } from "@/services/auth.service";

export const createWsServer = (server: Server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", (socket, req) => {
    const { query } = parse(req.url!, true);
    const token = query.token as string;
    if (!token) {
      socket.close(1008, "Unauthorized");
      return;
    }

    try {
      verifySocketToken(token);
      socket.send("Connected successfully");
    } catch (error) {
      socket.close(1008, "Unauthorized");
      return;
    }
    // connect to the server
    setInterval(() => {
      wss.clients.forEach((ws) => {
        if (ws.readyState !== ws.OPEN) wss.clients.delete(ws);
      });
    }, 30000);

    handler(socket, req);
  });

  wss.on("error", (err) => {
    console.log("error to connect", err);
  });

  console.log("WebSocket initialized");

  return {
    sendToMatch: (matchId: string, payload: ServerWsMessage) => {
      sendToMatch(matchId, payload);
    },
    broadcast: (payload: ServerWsMessage) => {
      broadcast(wss.clients, payload);
    },
  };
};
