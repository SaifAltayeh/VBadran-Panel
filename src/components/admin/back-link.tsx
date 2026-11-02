"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function BackLink({ href, label }: { href: string; label?: string }) {
  const { t, arabic } = useLang();
  const Icon = arabic ? ArrowRight : ArrowLeft;
  return (
    <Link
      href={href}
      className={cn(
        "mb-4 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-black",
        arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]",
      )}
    >
      <Icon className="h-4 w-4" />
      {label || t.admin.back}
    </Link>
  );
}
