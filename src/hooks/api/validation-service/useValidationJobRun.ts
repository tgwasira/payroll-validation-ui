import { useCallback, useEffect, useState } from "react";

import { useWebSocket } from "@/contexts/WebSocketContext";

// TODO: Review all this code with ChatGPT. This was Claude generated.
interface ValidationResult {
  jobId: string;
  status: string;
  progress?: number;
  errors?: string[];
}

export function useValidationJobRun() {
  const { isConnected, subscribe, send } = useWebSocket();
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe(
      "validation_result",
      (data: ValidationResult) => {
        setResults((prev) => [...prev, data]);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [subscribe]);

  const runValidationJob = useCallback(
    (id) => {
      setIsLoading(true);
      send("start_validation", { id });
      return id;
    },
    [send]
  );

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isLoading,
    isConnected,
    runValidationJob,
    clearResults,
  };
}
