// @ts-nocheck
import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import React, { useCallback } from "react";

import { validationServiceApi } from "../../../../apiConfig";

export function useValidationDataSourceMutations() {
  const api = useApi(validationServiceApi, "/validation-data-sources");

  const createValidationDataSource = useCallback(
    async (data: Partial<ValidationDataSource>) => {
      const result = await api.post(data);

      //   return toast.promise(promise, {
      //     loading: "Do translation: Creating validation rule...",
      //     success: (data) =>
      //       `Validation rule "${data.name || "Untitled"}" created successfully!`,
      //     error: (err) =>
      //       err?.response?.data?.message ||
      //       err?.message ||
      //       "Failed to create validation rule",
      //   });

      return result;
    },
    [api],
  );

  return {
    createValidationDataSource,
    validationDataSource: (api.data as ValidationDataSource) ?? null,
    loading: api.loading,
    error: api.error,
  };
}
