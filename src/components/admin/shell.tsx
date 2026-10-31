"use client";

import {
  LayoutDashboard,
  LogOut,
  Mail,
  MessagesSquare,
  Package,
  PanelsTopLeft,
  Search,
  StretchHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LanguageToggle, useLang } from "@/lib/i18n";
import { clearSession } from "@/lib/api";
import { isStaffSession } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const hrefs = [
  { href: "/admin", key: "overview", icon: LayoutDashboard },
  { href: "/admin/website", key: "website", icon: PanelsTopLeft },
  { href: "/admin/programs", key: "programs", icon: StretchHorizontal },
  { href: "/admin/packages", key: "packages", icon: Package },
  { href: "/admin/transformations", key: "transformations", icon: Users },
  { href: "/admin/testimonials", key: "testimonials", icon: MessagesSquare },
  { href: "/admin/inquiries", key: "inquiries", icon: Mail },
  { href: "/admin/clients", key: "clients", icon: UserRound },
] as const;

function active(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t, arabic } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const links = hrefs.map((item) => ({ ...item, label: t.admin[item.key] }));
  const current = links.find((item) => active(pathname, item.href)) ?? links[0];

  useEffect(() => {
    if (!isStaffSession()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const htmlOverflow = html.style.overflow;
    const bodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.classList.remove("font-arabic");
    return () => {
      html.style.overflow = htmlOverflow;
      body.style.overflow = bodyOverflow;
      if (html.lang === "ar") body.classList.add("font-arabic");
    };
  }, [arabic]);

  function logout() {
    clearSession();
    router.push("/login");
  }

  if (!ready) return null;

  return (
    <div data-admin dir={arabic ? "rtl" : "ltr"} className="fixed inset-0 z-20 flex overflow-hidden bg-[#0b1220] font-sans tracking-normal [word-spacing:0.05em]">
      <aside className="hidden h-full w-[248px] shrink-0 flex-col overflow-hidden bg-[#0b1220] px-5 py-6 text-white lg:flex">
          <div className="shrink-0">
            <Link href="/admin" className="px-2 font-display text-[22px] font-bold tracking-tight">
              VBADRAN
            </Link>
            <p className="mt-1 px-2 text-[11px] text-white/40">{t.admin.kicker}</p>
            <p className={`mt-8 px-2 text-[10px] uppercase tracking-[0.18em] text-white/35 ${arabic ? "font-arabic tracking-normal" : ""}`}>
              {t.admin.menu}
            </p>
          </div>
          <ul className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
            {links.map((item) => {
              const Icon = item.icon;
              const on = active(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                      on ? "bg-primary text-white" : "text-white/60 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="shrink-0 space-y-1 pt-3">
            <a
              href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010"}
              className="flex items-center rounded-2xl px-3 py-2.5 text-sm text-white/50 hover:bg-white/10 hover:text-white"
            >
              {t.admin.viewSite}
            </a>
            <button
              type="button"
              onClick={logout}
              dir={arabic ? "rtl" : "ltr"}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm whitespace-pre text-white/50 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> {t.dash.logout}
            </button>
          </div>
        </aside>

        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#eef2f8] p-3 md:p-4">
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-[28px] bg-[#f7f9fc] shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
          <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#e8edf5] bg-white px-5 py-4 lg:px-8">
            <div className="min-w-0">
              <Link href="/admin" className="font-display text-lg font-bold tracking-tight lg:hidden">
                VBADRAN
              </Link>
              <h1 className={`truncate text-lg font-semibold text-neutral-950 lg:hidden ${arabic ? "font-arabic" : "font-display tracking-tight"}`}>
                {current.label}
              </h1>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label className="relative hidden min-w-[240px] flex-1 md:block">
                <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  placeholder={t.admin.search}
                  className="h-11 w-full rounded-full border border-[#e8edf5] bg-[#f7f9fc] pe-4 ps-10 text-sm outline-none focus:border-primary"
                />
              </label>
              <LanguageToggle />
              <div className="flex h-11 items-center gap-2 rounded-full border border-[#e8edf5] bg-white px-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                  VB
                </span>
                <span className="hidden pr-2 text-sm font-medium sm:block">Admin</span>
              </div>
            </div>
          </header>

          <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#e8edf5] bg-white px-4 py-3 lg:hidden">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm",
                  active(pathname, item.href) ? "bg-primary text-white" : "bg-[#eef2f8] text-neutral-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">{children}</div>
        </div>
        </div>
    </div>
  );
}
