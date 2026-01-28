import { useCallback, useEffect, useState } from "react";

import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import {
  GetValidationJobsOptions,
  ValidationJob,
} from "@/types/validationServiceTypes";

import { validationServiceApi } from "../../../../apiConfig";

interface UseValidationJobsOptions {
  page?: number;
  limit?: number;
}

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
 * - `fetchValidationJobs`: Function to manually trigger fetching of validation jobs.
 * - `pagination`: Object containing pagination metadata.
 */
export function useValidationJobs(options: UseValidationJobsOptions = {}) {
  const api = useApi(validationServiceApi, "/validation-jobs");
  const { page = 1, limit = 10 } = options;

  // State for pagination metadata
  const [pagination, setPagination] = useState({
    currentPage: page,
    totalItems: 0,
    totalPages: 0,
    itemsPerPage: limit,
  });

  // <<<<<<< HEAD
  const fetchValidationJobs = useCallback(
    async (customPage?: number, customLimit?: number) => {
      const currentPage = customPage ?? pagination.currentPage;
      const currentLimit = customLimit ?? pagination.itemsPerPage;

      const queryParams = {
        _page: currentPage,
        _limit: currentLimit,
      };
      const result = await api.get({ queryParams });

      // Assume backend returns data in format: { items: [], total: number }
      // If it returns array directly, we'll handle that too
      let items: ValidationJob[];
      let total: number;

      if (Array.isArray(result)) {
        items = result;
        total = result.length; // Fallback if no total provided
      } else {
        items = result.items || result.data || [];
        total = result.total || result.totalItems || items.length;
      }

      setPagination({
        currentPage,
        totalItems: total,
        totalPages: Math.ceil(total / currentLimit),
        itemsPerPage: currentLimit,
      });
    },
  );
  // =======
  // const getValidationJobs = useCallback(
  //   async (options: GetValidationJobsOptions = {}) => {
  //     const { page = 1, limit = 100, status } = options;

  //     const params: Record<string, any> = {
  //       _page: page,
  //       _limit: limit,
  //     };

  //     // Add status filter if provided
  //     if (status) {
  //       params.status = status;
  //     }

  //     const result = await api.get(params);
  //     // >>>>>>> main

  //     return items;
  //   },
  //   [api, pagination.currentPage, pagination.itemsPerPage]
  // );

  useEffect(() => {
    fetchValidationJobs();
  }, []);

  return {
    validationJobs: (api.data as ValidationJob[] | null) ?? [],
    loading: api.loading === null ? true : api.loading,
    error: api.error,
    // <<<<<<< HEAD
    pagination,
    fetchValidationJobs,
    // =======
    // validationJobs: (api.data as ValidationJob[] | null) ?? [],
    // setValidationJobs: api.setData,
    // getValidationJobs,
    // >>>>>>> main
  };
}
