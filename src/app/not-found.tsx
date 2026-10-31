"use client";

import { Button, Container } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";

export default function NotFound() {
  const { t, arabic } = useLang();
  return (
    <Container className="flex min-h-screen flex-col justify-center py-24">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className={arabic ? "mt-3 font-arabic text-5xl md:text-7xl" : "mt-3 font-display text-6xl tracking-tight md:text-8xl"}>
        {t.notFoundTitle}
      </h1>
      <p className={`mt-4 max-w-md text-lg text-neutral-700 ${arabic ? "font-arabic" : ""}`}>{t.notFoundLead}</p>
      <div className="mt-8">
        <Button href="/admin" className={arabic ? "font-arabic" : undefined}>
          {t.backHome}
        </Button>
      </div>
    </Container>
  );
}
