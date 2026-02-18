import { useCallback, useEffect, useRef, useState } from "react";
import { type ClientWsMessage } from "@sporty/inter-types/ws";
const ENDPOINT = "ws://localhost:3000/ws";

type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSED" | "ERROR";

interface UseWebSocketOptions {
  reconnect?: boolean;
  reconnectInterval?: number;
  onMessage?: (data: any) => void;
}

export const useWebSocket = ({
  reconnect = true,
  reconnectInterval = 5000,
  onMessage,
}: UseWebSocketOptions) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>("CONNECTING");

  const connect = useCallback(() => {
    if (socketRef.current) {
      return;
    }
    const socket = new WebSocket(ENDPOINT);
    socketRef.current = socket;

    setStatus("OPEN");
    socket.addEventListener("message", (event) => {
      console.log(event);
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        data = event.data;
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
  }, [reconnect, reconnectInterval, onMessage]);

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
  }, []);
  return {
    status,
    sendMessage,
    close,
    isConnected: status === "OPEN",
  };
};
