"use client";

import Link from "next/link";

import { LanguageToggle, useLang } from "@/lib/i18n";

export function AuthChrome({ children }: { children: React.ReactNode }) {
  const { t, arabic } = useLang();

  return (
    <div className="grid min-h-screen lg:grid-cols-2" dir={arabic ? "rtl" : "ltr"}>
      <div className="relative hidden min-h-screen bg-[#0b1220] lg:block">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-[11px] uppercase tracking-[0.2em]">VBADRAN</p>
          <p className={`mt-3 max-w-sm ${arabic ? "font-arabic text-3xl leading-snug" : "font-display text-4xl leading-none tracking-normal"}`}>
            {t.auth.line}
          </p>
        </div>
      </div>
      <div className="flex flex-col px-6 py-8 md:px-14">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-display text-lg font-bold tracking-tight">
            VBADRAN
          </Link>
          <LanguageToggle />
        </div>
        <div className="flex flex-1 items-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
