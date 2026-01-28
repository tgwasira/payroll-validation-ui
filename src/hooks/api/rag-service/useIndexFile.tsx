// @ts-nocheck
import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import React, { useCallback } from "react";

import { ragServiceApi } from "../../../../apiConfig";

export function useIndexFile() {
  const api = useApi(ragServiceApi, ragServiceApi.endpoints.indexFile);

  const indexFile = useCallback(
    async (data) => {
      const result = await api.post(data);

      console.log("Index file result:", result);

      return result;
    },
    [api],
  );

  return {
    indexFile,
    indexInfo: api.data,
    loading: api.loading,
    error: api.error,
  };
}
