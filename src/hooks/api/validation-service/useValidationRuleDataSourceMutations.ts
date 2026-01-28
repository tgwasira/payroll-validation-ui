// @ts-nocheck
import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import { useMultipartFileUpload } from "@algion-co/react-ui-library/hooks/useMultipartFileUpload";
import React, { useCallback } from "react";

import { validationServiceApi } from "../../../../apiConfig";

export function useValidationRuleDataSourceMutations() {
  const { uploadFile, data, loading, error } = useMultipartFileUpload({
    apiService: validationServiceApi,
    endpoint: validationServiceApi.endpoints.validationRuleDataSources,
  });

  const createValidationRuleDataSource = useCallback(
    async (file: File, uuid: string) => {
      return await uploadFile(file, { uuid });
    },
    [uploadFile],
  );

  return {
    createValidationRuleDataSource,
    validationRuleDataSource: data as ValidationRuleDataSource | undefined,
    loading,
    error,
  };
}
