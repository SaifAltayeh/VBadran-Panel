"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { copy, faqsByLang, processByLang, reasonsByLang, valuesByLang, type Lang } from "@/lib/i18n/copy";
import { cn } from "@/lib/utils";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  arabic: boolean;
  t: (typeof copy)[Lang];
  process: (typeof processByLang)[Lang];
  reasons: (typeof reasonsByLang)[Lang];
  faqs: (typeof faqsByLang)[Lang];
  values: (typeof valuesByLang)[Lang];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readLang(): Lang {
  if (typeof window === "undefined") return "ar";
  const saved = window.localStorage.getItem("vb-lang");
  return saved === "en" ? "en" : "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  useEffect(() => {
    window.localStorage.setItem("vb-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("font-arabic", lang === "ar");
  }, [lang]);

  useEffect(() => {
    setLangState(readLang());
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      arabic: lang === "ar",
      t: copy[lang],
      process: processByLang[lang],
      reasons: reasonsByLang[lang],
      faqs: faqsByLang[lang],
      values: valuesByLang[lang],
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used inside LanguageProvider");
  return context;
}

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={cn("inline-flex shrink-0 rounded-full border border-line p-0.5", className)} role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full px-2 py-1 text-[11px] font-semibold tracking-normal sm:px-2.5",
          lang === "en" ? "bg-black text-white" : "text-neutral-500 hover:text-black",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        className={cn(
          "rounded-full px-2 py-1 font-arabic text-[12px] sm:px-2.5",
          lang === "ar" ? "bg-black text-white" : "text-neutral-500 hover:text-black",
        )}
      >
        <span className="sm:hidden">AR</span>
        <span className="hidden sm:inline">عربي</span>
      </button>
    </div>
  );
}
