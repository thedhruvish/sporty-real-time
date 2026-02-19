import { authApi } from "@/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";
import type { ClientWsMessage, ServerWsMessage } from "@sporty/inter-types/ws";
import { useCallback, useEffect, useRef, useState } from "react";

const ENDPOINT = "ws://localhost:3000/ws";

type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSED" | "ERROR";

interface UseWebSocketOptions {
  reconnect?: boolean;
  reconnectInterval?: number;
  onMessage?: (data: ServerWsMessage) => void;
  wsToken?: string;
}

export const useWebSocket = ({
  reconnect = true,
  reconnectInterval = 5000,
  onMessage,
  wsToken,
}: UseWebSocketOptions) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>("CONNECTING");
  const { isAuthenticated } = useAuthStore();

  const connect = useCallback(async () => {
    if (socketRef.current || !isAuthenticated) {
      return;
    }

    const url = new URL(ENDPOINT);
    if (wsToken) {
      url.searchParams.append("token", wsToken);
    }

    const socket = new WebSocket(url.toString());
    socketRef.current = socket;

    setStatus(WebSocket.OPEN ? "OPEN" : "CONNECTING");
    socket.addEventListener("message", (event) => {
      let data: ServerWsMessage;
      try {
        data = JSON.parse(event.data);
      } catch {
        data = event.data as ServerWsMessage;
      }

      onMessage?.(data);
    });

    socket.addEventListener("open", () => {
      setStatus("OPEN");
    });

    socket.addEventListener("close", () => {
      setStatus("CLOSED");
      socketRef.current = null;
      if (reconnect) {
        reconnectTimeoutRef.current = setTimeout(
          () => connect(),
          reconnectInterval,
        );
      }
    });

    socket.addEventListener("error", (error) => {
      setStatus("ERROR");
      console.log(error);
    });
  }, [reconnect, reconnectInterval, onMessage, wsToken]);

  const sendMessage = useCallback((message: ClientWsMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  const close = useCallback(() => {
    reconnectTimeoutRef.current && clearTimeout(reconnectTimeoutRef.current);
    socketRef.current?.close();
    socketRef.current = null;
    setStatus("CLOSED");
  }, []);

  useEffect(() => {
    connect();
    return () => {
      close();
    };
  }, [wsToken]);
  return {
    status,
    sendMessage,
    close,
    isConnected: status === "OPEN",
  };
};
