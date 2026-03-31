// @ts-nocheck
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import routes from "@/app/routes";
import { HTTP_STATUS } from "@/constants/httpStatus";

export function useUserLogin() {
  const t = useTranslations();
  const [errors, setErrors] = useState([]);

  const loginUser = useCallback(async (data: Partial<User>) => {
    try {
      const promise = fetch(routes.nextServer.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (!res.ok) {
          const err: any = new Error("Login failed");
          err.status = res.status;
          throw err;
        }

        return res.json();
      });

      //toast.promise(promise, {
      // success: ,
      //});

      const result = await promise;

      return result;
    } catch (err: any) {
      console.error("Error logging in user:", err);

      if (err?.status === HTTP_STATUS.UNAUTHORIZED) {
        setErrors([{ message: t("login.errors.email_or_password_incorrect") }]);
      } else {
        toast.error(t("login.error_toast_message"));
      }

      throw err;
    }
  }, []);

  return {
    loginUser,
    loading: false,
    errors,
  };
}

// import { useApi } from "@algion-co/react-ui-library";
// import { useTranslations } from "next-intl";
// import { useCallback, useState } from "react";
// import { toast } from "sonner";

// import { validationServiceApi } from "@/apiConfig";
// import { HTTP_STATUS } from "@/app/constants/httpStatus";

// export function useUserLogin() {
//   const t = useTranslations();

//   // TODO: Should we rename because very similar to error state from useApi
//   const [errors, setErrors] = useState([]);

//   const api = useApi(
//     validationServiceApi,
//     validationServiceApi.endpoints.login,
//   );

//   const loginUser = useCallback(
//     async (data: Partial<User>) => {
//       try {
//         const promise = api.post(data);

// toast.promise(promise, {
//   // success: ,
// });

//         // Await the original promise directly, not the toast wrapper so that
//         // loginUser throws on failure regardless of what toast.promise does with
//         // the error
//         const result = await promise;
//         return result;
//       } catch (err) {
//         console.error("Error logging in user:", err);
//         if (err?.status === HTTP_STATUS.UNAUTHORIZED) {
//           setErrors([
//             { message: t("login.errors.email_or_password_incorrect") },
//           ]);
//         } else {
//           toast.error(t("login.error_toast_message"));
//         }

//         // Throw because outer try and catch redirects based on whether there
//         // was and error or not
//         throw err;
//       }
//     },
//     [api],
//   );

//   return {
//     loginUser,
//     user: (api.data as User) ?? null,
//     loading: api.loading,
//     error: api.error,
//     errors: errors,
//   };
// }
