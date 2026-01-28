// @ts-nocheck
import { useApi } from "@algion-co/react-ui-library/hooks/useApi";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { validationServiceApi } from "../../../../apiConfig";

// TODO: Review all this code with ChatGPT. This was Claude generated.
interface ValidationResult {
  jobId: string;
  status: string;
  progress?: number;
  errors?: string[];
}

export default function useValidationJobRun() {
  const t = useTranslations();

  const api = useApi(validationServiceApi);

  const runValidationJob = useCallback(
    async (validationJob) => {
      const validationJobId = validationJob.id;
      const validationJobSlug = validationJob.slug;

      // console.log(data);
      const promise = api.post(null, {
        path: validationServiceApi.endpoints.validationJobRun(validationJobId),
      });

      const result = await toast.promise(promise, {
        // loading: t("validation_jobs.new.running_validation_job_toast_message", {
        //   id: validationJobSlug,
        // }),
        success: (data) =>
          t("validation_jobs.new.validation_job_run_started_toast_message", {
            id: validationJobSlug,
          }),
        // TODO: Should ew toast the raw error message from backend?
        error: (err) =>
          err?.response?.data?.message ||
          err?.message ||
          t("validation_jobs.new.validation_job_run_error_toast_message", {
            id: validationJobSlug,
          }),
      });

      return result.unwrap();
    },
    [api],
  );

  return {
    runValidationJob,
    runValidationJobData: (api.data as ValidationJob) ?? null,
    loading: api.loading,
    error: api.error,
  };
}
