import React, { useCallback } from "react";

import { useApi } from "@algion/react-ui-library/hooks/useApi";

import { ragServiceApi } from "../../../../apiConfig";

export function useGenerateContext() {
  const api = useApi(ragServiceApi, ragServiceApi.endpoints.generateContext);

  const generateContext = useCallback(
    async (data) => {
      const result = await api.post(data);
      return result;
    },
    [api],
  );

  return {
    generateContext,
    contextData: api.data,
    loading: api.loading,
    error: api.error,
  };
}
