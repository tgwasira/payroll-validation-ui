// @ts-nocheck
import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import { useCallback } from "react";
import { toast } from "sonner";

import { validationServiceApi } from "../../../../apiConfig";

export default function useValidationJobMutations() {
  const api = useApi(validationServiceApi, "/validation-jobs");

  const createValidationJob = useCallback(
    async (data: Partial<ValidationJob>) => {
      // console.log(data);
      const promise = api.post(data);

      // TODO: Failed to create
      const result = await toast.promise(promise, {
        // loading: "Do translation: Creating validation job...",
        // success: (data) =>
        //   `Validation job "${data.name || "Untitled"}" created successfully!`,
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create validation job",
      });

      return result.unwrap();
    },
    [api],
  );

  return {
    createValidationJob,
    validationJob: (api.data as ValidationJob) ?? null,
    loading: api.loading,
    error: api.error,
  };
}
