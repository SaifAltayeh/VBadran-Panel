"use client";

import { useLang } from "@/lib/i18n";

export function LoginHeading() {
  const { t, arabic } = useLang();
  return (
    <>
      <h1 className={arabic ? "font-arabic text-4xl md:text-5xl" : "font-sans text-5xl font-semibold tracking-normal"}>{t.auth.welcome}</h1>
      <p className={`mt-3 text-neutral-700 ${arabic ? "font-arabic" : ""}`}>{t.auth.welcomeLead}</p>
    </>
  );
}

export function RegisterHeading() {
  const { t, arabic } = useLang();
  return (
    <>
      <h1 className={arabic ? "font-arabic text-4xl md:text-5xl" : "font-display text-5xl tracking-tight"}>{t.createTitle}</h1>
      <p className={`mt-3 text-neutral-700 ${arabic ? "font-arabic" : ""}`}>{t.createLead}</p>
    </>
  );
}

export function ForgotHeading() {
  const { t, arabic } = useLang();
  return (
    <>
      <h1 className={arabic ? "font-arabic text-4xl md:text-5xl" : "font-display text-5xl tracking-tight"}>{t.resetTitle}</h1>
      <p className={`mt-3 text-neutral-700 ${arabic ? "font-arabic" : ""}`}>{t.resetLead}</p>
    </>
  );
}

export function ResetHeading() {
  const { t, arabic } = useLang();
  return <h1 className={arabic ? "font-arabic text-4xl md:text-5xl" : "font-display text-5xl tracking-tight"}>{t.newPasswordTitle}</h1>;
}

export function CheckoutHeading() {
  const { t, arabic } = useLang();
  return <h1 className={arabic ? "font-arabic text-4xl md:text-5xl" : "font-display text-5xl tracking-tight"}>{t.checkout}</h1>;
}
