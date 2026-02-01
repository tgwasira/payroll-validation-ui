// @ts-nocheck
"use client";

import { useSSE } from "@algion-co/react-ui-library";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useValidationJobs } from "@/hooks/api/validation-service/useValidationJob";

interface ValidationProgress {
  prevValidationJobProgress?: number;
  validationJobProgress: number;
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
  // TODO: Ensure that this is never created from some other place it should always come from the backend
  const { connect, subscribe } = useSSE();
  const { getValidationJobProgresses } = useValidationJobs();

  // This should always be initialised from the backend on load because that
  // would make the jobs list have correct progresses for all the jobs.
  // Each ID in the map is then updated via SSE events while the backend also
  // updates its record of the map. We do this so that in the unlikely event of having a million progresses, we don't have to keep sending the full map each time.
  const [validationJobProgresses, setValidationProgresses] = useState<
    Map<number, ValidationProgress>
  >(new Map());
  const [updatedValidationJobs, setUpdatedValidationJobs] = useState<
    Map<number, AdditionalValidationJob>
  >(new Map());

  // Connect to SSE on mount
  useEffect(() => {
    // TODO: Make the URL configurable
    connect("http://localhost:8000/events/validation");
  }, []);

  const loadInitialProgresses = useCallback(async () => {
    const progresses = await getValidationJobProgresses();

    const map = new Map<number, ValidationProgress>(
      Object.entries(progresses).map(([jobId, progress]) => [
        Number(jobId),
        {
          prevValidationJobProgress: undefined,
          validationJobProgress: progress,
        },
      ]),
    );

    setValidationProgresses(map);
  }, []);

  // Call once on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled) return;
      await loadInitialProgresses();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribes = [
      subscribe("validation_started", (event) => {
        const { validationJobId } = event.payload;

        // You could optionally reset progress or state here:
        setValidationProgresses((prev) => {
          const newMap = new Map(prev);
          newMap.set(validationJobId, {
            validationJobProgress: 0,
          });
          return newMap;
        });
      }),

      subscribe("validation_progress", (event) => {
        // TODO: Add logging
        const { validationJobId, validationJobProgress, validationRuleId } =
          event.payload;

        setValidationProgresses((prevMap) => {
          const newMap = new Map(prevMap);

          const previous = prevMap.get(validationJobId);

          newMap.set(validationJobId, {
            prevValidationJobProgress: previous?.validationJobProgress,
            validationJobProgress,
          });

          return newMap;
        });
      }),

      subscribe("validation_completed", (event) => {
        console.log(event.payload);
        setUpdatedValidationJobs((prevMap) => {
          // Create a new Map based on the previous one
          const newMap = new Map(prevMap);
          // Set or overwrite the value
          newMap.set(event.payload.id, event.payload);
          console.log("Updated validation jobs map: ", newMap);
          return newMap;
        });
      }),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [subscribe]);

  const getProgress = (jobId: number) => {
    // console.log(validationJobProgresses);
    return validationJobProgresses.get(jobId);
  };

  return (
    <ValidationProgressContext.Provider
      value={{
        validationJobProgresses,
        loadInitialProgresses,
        getProgress,
        updatedValidationJobs,
      }}
    >
      {children}
    </ValidationProgressContext.Provider>
  );
}

export function useValidationProgress() {
  const context = useContext(ValidationProgressContext);
  if (!context) {
    throw new Error(
      "useValidationProgress must be used within ValidationProgressProvider",
    );
  }
  // TODO: Should we return named values
  return context;
}
