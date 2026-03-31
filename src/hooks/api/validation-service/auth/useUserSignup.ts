import { useApi } from "@algion-co/react-ui-library";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";

import { validationServiceApi } from "@/apiConfig";

export function useUserSignup() {
  const t = useTranslations();

  const api = useApi(
    validationServiceApi,
    validationServiceApi.endpoints.signUp,
  );

  const createUser = useCallback(
    async (data: Partial<User>) => {
      const promise = api.post(data);
      console.log(data);

      toast.promise(promise, {
        error: (err) => {
          console.error("Error creating user:", err);
          return t("signup.error_toast_message");
        },
      });

      // Await the original promise directly, not the toast wrapper so that
      // createUser throws on failure regardless of what toast.promise does with
      // the error
      const result = await promise;
      return result;
    },
    [api],
  );

  return {
    createUser,
    user: (api.data as User) ?? null,
    loading: api.loading,
    error: api.error,
  };
}
