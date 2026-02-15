import type { Server } from "node:http";
import { WebSocketServer } from "ws";
import { handler } from "./handlers.js";

export const createWsServer = (server: Server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", (socket, req) => {
    // connect to the server
    handler(socket, req);
  });

  wss.on("error", (err) => {
    console.log("error to connect", err);
  });
  console.log("WebSocket initialized");
};
