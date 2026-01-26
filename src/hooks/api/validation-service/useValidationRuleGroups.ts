import { useCallback, useEffect, useState } from "react";

import { useApi } from "@algion/react-ui-library/hooks/useApi";
import type { ValidationRuleGroup } from "@/types/validationServiceTypes";

import { validationServiceApi } from "../../../../apiConfig";

interface UseValidationRuleGroupsOptions {
  page?: number;
  limit?: number;
}

/**
 * A hook to manage and fetch validation rule groups from the validation service API.
 *
 * @param options - Optional: A configuration object for the API requests.
 * @param options.page - The page number to fetch (default is 1).
 * @param options.limit - The maximum number of rule groups to fetch per page (default is 10).
 *
 * @returns An object containing:
 * - `loading`: Boolean indicating if the API request is in progress.
 * - `error`: Any error encountered during the API request.
 * - `validationRuleGroups`: Array of fetched validation rule groups, or an empty array if none.
 * - `fetchValidationRuleGroups`: Function to manually trigger fetching of validation rule groups.
 * - `pagination`: Object containing pagination metadata.
 */
export function useValidationRuleGroups(
  options: UseValidationRuleGroupsOptions = {},
) {
  const api = useApi(validationServiceApi, "/validation-rule-groups");
  const { page = 1, limit = 10 } = options;

  // State for pagination metadata
  const [pagination, setPagination] = useState({
    currentPage: page,
    totalItems: 0,
    totalPages: 0,
    itemsPerPage: limit,
  });

  const fetchValidationRuleGroups = useCallback(
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
      let items: ValidationRuleGroup[];
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

      return items;
    },
    [api, pagination.currentPage, pagination.itemsPerPage],
  );

  useEffect(() => {
    fetchValidationRuleGroups();
  }, []);

  return {
    validationRuleGroups: (api.data as ValidationRuleGroup[] | null) ?? [],
    loading: api.loading === null ? true : api.loading,
    error: api.error,
    pagination,
    fetchValidationRuleGroups,
  };
}
