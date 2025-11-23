import { useCallback, useEffect, useState } from "react";

import { useApi } from "@/react-ui-library/hooks/useApi";
import { ValidationJob, GetValidationJobsOptions } from "@/types/validationServiceTypes";

import { validationServiceApi } from "../../../../apiConfig";

/**
 * A hook to manage and fetch validation jobs from the validation service API.
 *
 * @param options - Optional: A configuration object for the API requests.
 * @param options.page - The page number to fetch (default is 1).
 * @param options.limit - The maximum number of jobs to fetch per page (default is 100).
 * @param options.status - Filter by validation job status.
 *
 * @returns An object containing:
 * - `loading`: Boolean indicating if the API request is in progress.
 * - `error`: Any error encountered during the API request.
 * - `validationJobs`: Array of fetched validation jobs, or an empty array if none.
 * - `getValidationJobs`: Function to manually trigger fetching of validation jobs.
 */
export function useValidationJobs() {
  const api = useApi(
    validationServiceApi,
    "/validation-jobs"
  );

  const getValidationJobs = useCallback(
    async (options: GetValidationJobsOptions = {}) => {
      const { page = 1, limit = 100, status } = options;

      const params: Record<string, any> = {
        _page: page,
        _limit: limit,
      };
      
      // Add status filter if provided
      if (status) {
        params.status = status;
      }

      const result = await api.get(params);

      return result as ValidationJob[];
    },
    [api]
  );

  return {
    loading: api.loading === null ? true : api.loading,
    error: api.error,
    validationJobs: (api.data as ValidationJob[] | null) ?? [],
    setValidationJobs: api.setData,
    getValidationJobs,
  };
}
