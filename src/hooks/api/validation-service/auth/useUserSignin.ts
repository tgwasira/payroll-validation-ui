import { useApi } from "@algion-co/react-ui-library";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";

import { validationServiceApi } from "@/apiConfig";

export function useUserSignin() {
  const t = useTranslations();

  const api = useApi(
    validationServiceApi,
    validationServiceApi.endpoints.signIn,
  );

  const signInUser = useCallback(
    async (data: Partial<User>) => {
      const promise = api.post(data);

      toast.promise(promise, {
        error: (err) => {
          console.error("Error signing in user:", err);
          return t("signin.error_toast_message");
        },
      });

      // Await the original promise directly, not the toast wrapper so that
      // signInUser throws on failure regardless of what toast.promise does with
      // the error
      const result = await promise;
      return result;
    },
    [api],
  );

  return {
    signInUser,
    user: (api.data as User) ?? null,
    loading: api.loading,
    error: api.error,
  };
}
