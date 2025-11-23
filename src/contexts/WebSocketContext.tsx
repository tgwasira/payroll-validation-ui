"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { snakeToCamelCase } from "@/react-ui-library/utils/stringUtils";

import { validationServiceApi } from "../../apiConfig";

type MessageHandler = (data: any) => void;
type Unsubscribe = () => void;

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (type: string, handler: MessageHandler) => Unsubscribe;
  send: (type: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, Set<MessageHandler>>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    // Only run on client side
    // Refer to: https://stackoverflow.com/a/68345557/16627522
    if (typeof window === "undefined") return;

    const ws = new WebSocket(validationServiceApi.webSocketURL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = snakeToCamelCase(JSON.parse(event.data));
        const { type, payload } = message;

        console.log("WebSocket received:", { type, payload });

        // Call all handlers subscribed to this message type
        const handlers = handlersRef.current.get(type);
        if (handlers) {
          handlers.forEach((handler) => handler(payload));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);

      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("Attempting to reconnect...");
        connect();
      }, 3000);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const subscribe = useCallback(
    (type: string, handler: MessageHandler): Unsubscribe => {
      if (!handlersRef.current.has(type)) {
        handlersRef.current.set(type, new Set());
      }
      handlersRef.current.get(type)!.add(handler);

      return () => {
        const handlers = handlersRef.current.get(type);
        if (handlers) {
          handlers.delete(handler);
          if (handlers.size === 0) {
            handlersRef.current.delete(type);
          }
        }
      };
    },
    []
  );

  const send = useCallback((type: string, payload: any) => {
    console.log("WebSocket send called");
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket sending:", { type, payload });
      wsRef.current.send(JSON.stringify({ type, payload }));
    } else {
      console.warn("WebSocket not connected");
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, send }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
}
