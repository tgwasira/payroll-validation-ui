"use client";

import { SignupPage, SignupPageContent } from "@algion-co/react-ui-library";
import { useRouter } from "next/navigation";

import routes from "@/app/routes";
import { useUserSignup } from "@/hooks/api/validation-service/auth/useUserSignup";

import logogram from "../../../../../public/logogram.png";

export default function Signup() {
  const { createUser } = useUserSignup();
  const router = useRouter();

  return (
    <SignupPage>
      <SignupPageContent
        logogramImg={logogram}
        onSubmit={async (data) => {
          try {
            data.fullName = `${data.firstName} ${data.lastName}`;
            delete data.firstName;
            delete data.lastName;

            await createUser(data);
            router.push(routes.completeSignup);
          } catch (err) {
            console.error("Signup error:", err);
          }
        }}
      />
    </SignupPage>
  );
}
