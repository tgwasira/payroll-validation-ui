import { useCallback, useEffect, useRef, useState } from "react";

import { useSSE } from "@/react-ui-library/contexts/SSEContext";

export function useStreamingText(jobId?: string) {
  const { subscribe } = useSSE();
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamingRef = useRef(true);

  useEffect(() => {
    setText("");
    setIsStreaming(false);
    setError(null);

    const unsubscribeToken = subscribe("token", (data) => {
      if (!streamingRef.current) return;
      console.log(data.payload);
      if (!jobId || data.payload.jobId === jobId) {
        console.log("Received token:", data.payload.content);
        setIsStreaming(true);
        setText((prev) => prev + (data.payload.content || ""));
      }
    });

    const unsubscribeDone = subscribe("done", (data) => {
      if (!jobId || data.payload.jobId === jobId) {
        streamingRef.current = false;
        setIsStreaming(false);
      }
    });

    const unsubscribeError = subscribe("error", (data) => {
      if (!jobId || data.payload.jobId === jobId) {
        setIsStreaming(false);
        setError(data.payload.content || "An error occurred");
      }
    });

    return () => {
      unsubscribeToken();
      unsubscribeDone();
      unsubscribeError();
    };
  }, [subscribe, jobId]);

  const reset = useCallback(() => {
    setText("");
    setIsStreaming(false);
    setError(null);
    streamingRef.current = true;
  }, []);

  return { text, isStreaming, error, reset };
}
