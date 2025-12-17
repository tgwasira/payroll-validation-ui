import React, { useCallback } from "react";

import { useApi } from "@/react-ui-library/hooks/useApi";
import { useMultipartFileUpload } from "@/react-ui-library/hooks/useMultipartFileUpload";

import { validationServiceApi } from "../../../../apiConfig";

export function useValidationRuleDataSourceMutations() {
  const { uploadFile, data, loading, error } = useMultipartFileUpload({
    apiService: validationServiceApi,
    endpoint: validationServiceApi.endpoints.validationRuleDataSources,
  });

  const createValidationRuleDataSource = useCallback(
    async (file: File) => {
      return await uploadFile(file);
    },
    [uploadFile]
  );

  return {
    createValidationRuleDataSource,
    validationRuleDataSource: data as ValidationRuleDataSource | undefined,
    loading,
    error,
  };
}
