import { createServer } from "node:http";
import app from "./app";
import { createWsServer } from "./websocket";

const server = createServer(app);
export const wsHelper = createWsServer(server);

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
