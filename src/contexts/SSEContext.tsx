"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type CounterEvent = {
  type: "counter";
  value: number;
};

type SSEContextValue = {
  connected: boolean;
  lastEvent?: CounterEvent;
};

const SSEContext = createContext<SSEContextValue | undefined>(undefined);

// const SSE_URL =
//   process.env.NEXT_PUBLIC_SSE_URL ?? "http://localhost:8000/events";

export function SSEProvider({ url, children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<CounterEvent | undefined>();

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) return;

    const es = new EventSource(url, { withCredentials: false });
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
      console.info("SSE connected");
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as CounterEvent;
        console.log(data);
        setLastEvent(data);
      } catch (err) {
        console.error("Invalid SSE payload", err);
      }
    };

    es.addEventListener("heartbeat", () => {
      // heartbeat received
    });

    es.onerror = () => {
      console.warn("SSE error – reconnecting");
      setConnected(false);
      es.close();
      eventSourceRef.current = null;

      // Exponential-ish backoff
      retryTimeoutRef.current = setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [connect]);

  return (
    <SSEContext.Provider value={{ connected, lastEvent }}>
      {children}
    </SSEContext.Provider>
  );
}

export function useSSE() {
  const ctx = useContext(SSEContext);
  if (!ctx) {
    throw new Error("useSSE must be used inside SSEProvider");
  }
  return ctx;
}
