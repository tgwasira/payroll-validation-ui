"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useWebSocket } from "@/contexts/WebSocketContext";

interface ValidationProgress {
  validationProgress: number;
  validationRuleId?: string;
}

interface ValidationProgressContextType {
  validationProgresses: Map<string, ValidationProgress>;
  getProgress: (jobId: string) => ValidationProgress | undefined;
}

const ValidationProgressContext =
  createContext<ValidationProgressContextType | null>(null);

export function ValidationProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [validationProgresses, setValidationProgresses] = useState<
    Map<string, ValidationProgress>
  >(new Map());
  const { subscribe } = useWebSocket();

  useEffect(() => {
    console.log(
      "ValidationProgressProvider: Subscribing to validation_progress"
    );

    const unsubscribe = subscribe("validation_progress", (data) => {
      const { validationJobId, validationProgress, validationRuleId } = data;

      setValidationProgresses((prev) => {
        const newMap = new Map(prev);
        newMap.set(validationJobId, { validationProgress, validationRuleId });
        return newMap;
      });
    });

    return unsubscribe;
  }, [subscribe]);

  const getProgress = (jobId: string) => {
    console.log(validationProgresses);
    return validationProgresses.get(jobId);
  };

  return (
    <ValidationProgressContext.Provider
      value={{ validationProgresses, getProgress }}
    >
      {children}
    </ValidationProgressContext.Provider>
  );
}

export function useValidationProgress() {
  const context = useContext(ValidationProgressContext);
  if (!context) {
    throw new Error(
      "useValidationProgress must be used within ValidationProgressProvider"
    );
  }
  return context;
}
