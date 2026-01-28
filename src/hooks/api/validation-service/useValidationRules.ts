// @ts-nocheck
import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type { ValidationRule } from "@/types/validationServiceTypes";

import { validationServiceApi } from "../../../../apiConfig";

interface UseValidationRulesOptions {
  page?: number;
  limit?: number;
  userId?: string;
}

export function useValidationRules(options: UseValidationRulesOptions = {}) {
  console.log("useValidationRules");
  const api = useApi(validationServiceApi, "/validation-rules");
  const { page = 1, limit = 10, userId } = options;

  // State for pagination metadata
  const [pagination, setPagination] = useState({
    currentPage: page,
    totalItems: 0,
    totalPages: 0,
    itemsPerPage: limit,
  });

  const fetchValidationRules = useCallback(
    async (customPage?: number, customLimit?: number) => {
      const currentPage = customPage ?? pagination.currentPage;
      const currentLimit = customLimit ?? pagination.itemsPerPage;

      const queryParams = {
        _page: currentPage,
        _limit: currentLimit,
      };
      const result = await api.get({ queryParams });

      // Assume backend returns data in format: { items: [], total: number }
      // If it returns array directly, this will handle it too
      let items: ValidationRule[];
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
    fetchValidationRules();
  }, []);

  return {
    validationRules: (api.data as ValidationRule[] | null) ?? [],
    loading: api.loading === null ? true : api.loading,
    error: api.error,
    pagination,
    fetchValidationRules,
  };
}

// TODO: Use translations
export function useValidationRuleMutations() {
  const api = useApi(validationServiceApi, "/validation-rules");

  const createValidationRule = useCallback(
    async (ruleData: Partial<ValidationRule>) => {
      const promise = api.post(ruleData);
      console.log("Creating validation rule with data:", ruleData);

      const result = await toast.promise(promise, {
        loading: "Do translation: Creating validation rule...",
        success: (data) =>
          `Validation rule "${data.name || "Untitled"}" created successfully!`,
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create validation rule",
      });

      return result.unwrap();
    },
    [api],
  );

  return {
    createValidationRule,
    validationRule: api.data ? (api.data as ValidationRule) : null,
    loading: api.loading,
    error: api.error,
  };
}
