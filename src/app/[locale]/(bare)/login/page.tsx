// @ts-nocheck
"use client";

import { LoginPage, LoginPageContent } from "@algion-co/react-ui-library";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import routes from "@/app/routes";
import { useUserLogin } from "@/hooks/api/validation-service/auth/useUserLogin";

import logogram from "../../../../../public/logogram.png";

export default function Login() {
  const t = useTranslations();
  const { loginUser, errors } = useUserLogin();
  const router = useRouter();

  return (
    <LoginPage>
      <LoginPageContent
        logogramImg={logogram}
        errors={errors}
        onSubmit={async (data) => {
          try {
            await loginUser(data);
            router.replace(routes.validationJobs.base);
          } catch (err) {
            console.error("Login failed:", err);
            // No need to do anything.
          }
        }}
      />
    </LoginPage>
  );
}
