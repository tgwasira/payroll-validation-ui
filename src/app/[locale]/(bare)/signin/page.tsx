"use client";

import { SigninPage, SigninPageContent } from "@algion-co/react-ui-library";
import { useRouter } from "next/navigation";

import { useUserSignin } from "@/hooks/api/validation-service/auth/useUserSignin";

import logogram from "../../../../../public/logogram.png";

export default function Signin() {
  const { signInUser } = useUserSignin();
  const router = useRouter();

  return (
    <SigninPage>
      <SigninPageContent
        logogramImg={logogram}
        onSubmit={async (data) => {
          console.log("Signin form submitted with data:", data);
          try {
            await signInUser(data);
            router.push("/");
          } catch (err) {
            console.error("Signin error:", err);
          }
        }}
      />
    </SigninPage>
  );
}
