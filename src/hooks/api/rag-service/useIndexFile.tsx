// @ts-nocheck
import { useApi } from "@algion-co/react-ui-library";
import React, { useCallback } from "react";

import { validationServiceApi } from "../../../apiConfig";

export function useIndexFile() {
  const api = useApi(
    validationServiceApi,
    validationServiceApi.endpoints.indexFile,
  );

  const indexFile = useCallback(
    async (data) => {
      const result = await api.post(data);

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
