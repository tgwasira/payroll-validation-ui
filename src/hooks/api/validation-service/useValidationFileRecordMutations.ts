// @ts-nocheck
import { useApi } from "@algion-co/react-ui-library";
import React, { useCallback } from "react";

import { validationServiceApi } from "../../../../apiConfig";

export function useValidationJobFileMutations() {
  const api = useApi(
    validationServiceApi,
    validationServiceApi.endpoints.validationFileRecords,
  );

  const createValidationFileRecord = useCallback(
    async (file: File, extraData?: Record<string, any>) => {
      // Prepare multipart form data
      const formData = new FormData();
      formData.append("file", file);
      if (extraData) {
        Object.entries(extraData).forEach(([key, value]) => {
          formData.append(key, value as any);
        });
      }

      const result = await api.post(formData);

      return result;
    },
    [api],
  );

  return {
    createValidationFileRecord,
    validationJobFile: (api.data as ValidationJobFile) ?? null,
    loading: api.loading,
    error: api.error,
  };
}
