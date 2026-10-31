import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/forms/auth-forms";
import { LoginHeading } from "@/components/pages/auth-headings";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <>
      <LoginHeading />
      <div className="mt-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
