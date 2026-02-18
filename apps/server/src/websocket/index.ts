import type { Server } from "node:http";
import { WebSocketServer } from "ws";
import { handler } from "./handlers";
import { broadcast, sendToMatch } from "./helper";

export const createWsServer = (server: Server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", (socket, req) => {
    // connect to the server

    socket.send("Server connected");

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
    sendToMatch: (matchId: string, payload: any) => {
      sendToMatch(matchId, payload);
    },
    broadcast: (payload: any) => {
      broadcast(wss.clients, payload);
    },
  };
};
