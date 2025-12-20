import { useCallback, useEffect, useRef, useState } from "react";

import { useSSE } from "@/react-ui-library/contexts/SSEContext";

export function useStreamingText(jobID?: string) {
  const { subscribe } = useSSE();
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamingRef = useRef(true);

  useEffect(() => {
    setText("");
    setIsStreaming(false);
    setError(null);

    const unsubscribeToken = subscribe("token", (event) => {
      if (!streamingRef.current) return;
      if (!jobID || event.job_id === jobID) {
        setIsStreaming(true);
        setText((prev) => prev + (event.content || ""));
      }
    });

    const unsubscribeDone = subscribe("done", (event) => {
      if (!jobID || event.job_id === jobID) {
        streamingRef.current = false;
        setIsStreaming(false);
      }
    });

    const unsubscribeError = subscribe("error", (event) => {
      if (!jobID || event.job_id === jobID) {
        setIsStreaming(false);
        setError(event.content || "An error occurred");
      }
    });

    return () => {
      unsubscribeToken();
      unsubscribeDone();
      unsubscribeError();
    };
  }, [subscribe, jobID]);

  const reset = useCallback(() => {
    setText("");
    setIsStreaming(false);
    setError(null);
    streamingRef.current = true;
  }, []);

  return { text, isStreaming, error, reset };
}
