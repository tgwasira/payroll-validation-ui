import React, { useCallback } from "react";

import { useApi } from "@/react-ui-library/hooks/useApi";

import { ragServiceApi } from "../../../../apiConfig";

export function useIndexFile() {
  const api = useApi(ragServiceApi, ragServiceApi.endpoints.indexFile);

  const indexFile = useCallback(
    async (data) => {
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
    [api]
  );

  return {
    indexFile,
    indexInfo: api.data,
    loading: api.loading,
    error: api.error,
  };
}
