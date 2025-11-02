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
  prevValidationJobProgress?: number;
  validationJobProgress: number;
  validationRuleId?: string;
}

interface ValidationProgressContextType {
  validationJobProgresses: Map<string, ValidationProgress>;
  getProgress: (jobId: string) => ValidationProgress | undefined;
}

const ValidationProgressContext =
  createContext<ValidationProgressContextType | null>(null);

export function ValidationProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [validationJobProgresses, setValidationProgresses] = useState<
    Map<string, ValidationProgress>
  >(new Map());
  const { subscribe } = useWebSocket();

  useEffect(() => {
    console.log("ValidationProgressProvider: Subscribing to validation events");

    const unsubscribes = [
      subscribe("validation_started", (data) => {
        const { validationJobId } = data;
        console.log(`Validation job ${validationJobId} started`);

        // You could optionally reset progress or state here:
        setValidationProgresses((prev) => {
          const newMap = new Map(prev);
          newMap.set(validationJobId, {
            validationJobProgress: 0,
          });
          return newMap;
        });
      }),

      subscribe("validation_progress", (data) => {
        const { validationJobId, validationJobProgress, validationRuleId } =
          data;

        setValidationProgresses((prev) => {
          const newMap = new Map(prev);
          newMap.set(validationJobId, {
            prevValidationJobProgress:
              newMap.get(validationJobId)?.validationJobProgress, // Store previous progress. Undefined if not found. This is perfect because our progress bars handle undefined previous values by removing the animation.
            validationJobProgress,
            validationRuleId,
          });
          return newMap;
        });
      }),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [subscribe]);

  const getProgress = (jobId: string) => {
    // console.log(validationJobProgresses);
    return validationJobProgresses.get(jobId);
  };

  return (
    <ValidationProgressContext.Provider
      value={{ validationJobProgresses, getProgress }}
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
