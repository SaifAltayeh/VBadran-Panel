"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button, Field } from "@/components/ui/primitives";
import { clearSession, errorMessage, login } from "@/lib/api";
import { useLang } from "@/lib/i18n";

export function LoginForm() {
  const { t, arabic } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const user = await login(String(form.get("email") || "").trim(), String(form.get("password") || ""));
      if (!user.is_staff) {
        clearSession();
        setError(t.admin.signIn);
        setPending(false);
        return;
      }
      router.push(params.get("next") || "/admin");
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <Field label={t.email} name="email" type="email" required autoComplete="email" />
      <Field label={t.password} name="password" type="password" required autoComplete="current-password" />
      {error ? (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={pending}
        arrow={false}
        className={arabic ? "font-arabic normal-case tracking-normal" : "normal-case tracking-normal"}
      >
        {pending ? t.signingIn : t.login}
      </Button>
    </form>
  );
}
