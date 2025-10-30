import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useApi } from "@/react-ui-library/hooks/useApi";
import type { ValidationRule } from "@/types/validationServiceTypes";

import { validationServiceApi } from "../../../../apiConfig";

export function useValidationRules(options = {}) {
  const api = useApi(validationServiceApi, "/validation-rules");
  const { page = 1, limit = 10, userId } = options;

  const fetchValidationRules = useCallback(async () => {
    const params = {
      _page: page,
      _limit: limit,
    };
    const result = await api.get(params);

    return result as ValidationRule[];
  }, [page, limit, api]);

  useEffect(() => {
    fetchValidationRules();
  }, []);

  return {
    validationRules: (api.data as ValidationRule[] | null) ?? [],
    loading: api.loading === null ? true : api.loading,
    error: api.error,
    fetchValidationRules,
  };
}

// TODO: Use translations
export function useValidationRuleMutations() {
  const api = useApi(validationServiceApi, "/validation-rules");

  const createValidationRule = useCallback(
    async (ruleData: Partial<ValidationRule>) => {
      const promise = api.post(ruleData);

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
    [api]
  );

  return {
    createValidationRule,
    validationRule: (api.data as ValidationRule) ?? null,
    loading: api.loading,
    error: api.error,
  };
}
