import { useCallback, useEffect, useState } from "react";

import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import { ValidationJob } from "@/types/validationServiceTypes";

import { validationServiceApi } from "../../../../apiConfig";

/**
 * A hook to manage and fetch a validation job from the validation service API.
 *
 * @returns An object containing:
 *  - `loading`: Boolean indicating if the API request is in progress.
 *  - `error`: Any error encountered during the API request.
 *  - `validationJob`: The fetched validation job, or null if not found.
 *  - `getValidationJob`: Function to manually trigger fetching of a validation
 *      job.
 */
export function useValidationJobs() {
  const api = useApi(validationServiceApi, "/validation-jobs");

  const getValidationJob = useCallback(
    async (slug: string) => {
      // TODO: Go back to the overloaded format
      const result = await api.get({ path: slug });

      return result as ValidationJob;
    },
    [api],
  );

  const getValidationJobProgresses = useCallback(async () => {
    const result = await api.get({ path: "/progresses" });

    return result;
  }, [api]);

  return {
    loading: api.loading,
    error: api.error,
    validationJob: (api.data as ValidationJob | null) ?? null,
    getValidationJob,
    getValidationJobProgresses,
  };
}
