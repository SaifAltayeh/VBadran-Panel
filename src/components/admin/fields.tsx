"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const latin = "font-sans tracking-normal [word-spacing:0.06em]";

const shell =
  "rounded-[18px] border border-[#e6ecf4] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,background-color] hover:border-[#c9d4e4] focus-within:border-primary focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(36,67,178,0.12)]";

function resizeArea(node: HTMLTextAreaElement | null) {
  if (!node) return;
  node.style.height = "0px";
  node.style.height = `${Math.max(112, node.scrollHeight)}px`;
}

export function AdminField({
  label,
  hint,
  icon,
  className,
  dir = "ltr",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  dir?: "ltr" | "rtl";
}) {
  const id = props.id || props.name;
  const rtl = dir === "rtl";
  const { arabic } = useLang();
  return (
    <label className="grid min-w-0 gap-1.5" htmlFor={id}>
      <span className={cn("text-[12px] font-medium text-neutral-500", arabic || rtl ? "font-arabic" : latin)}>{label}</span>
      <span className={cn("flex h-12 items-center gap-2.5 px-3.5", shell)}>
        {icon ? <span className="shrink-0 text-neutral-400">{icon}</span> : null}
        <input
          id={id}
          dir={dir}
          lang={rtl ? "ar" : "en"}
          className={cn(
            "h-full w-full min-w-0 bg-transparent text-[15px] text-neutral-950 outline-none placeholder:text-neutral-300",
            rtl ? "font-arabic text-right" : latin,
            className,
          )}
          {...props}
        />
      </span>
      {hint ? <span className={cn("text-xs text-neutral-400", latin)}>{hint}</span> : null}
    </label>
  );
}

export function AdminArea({
  label,
  dir = "ltr",
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; dir?: "ltr" | "rtl" }) {
  const id = props.id || props.name;
  const rtl = dir === "rtl";
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    resizeArea(ref.current);
  }, []);
  return (
    <label className="grid min-w-0 gap-1.5" htmlFor={id}>
      <span className={cn("text-[12px] font-medium text-neutral-500", rtl ? "font-arabic" : latin)}>{label}</span>
      <span className={cn("px-3.5 py-3", shell)}>
        <textarea
          id={id}
          ref={ref}
          dir={dir}
          lang={rtl ? "ar" : "en"}
          onInput={(event) => resizeArea(event.currentTarget)}
          className={cn(
            "min-h-28 w-full resize-none bg-transparent text-[15px] leading-7 text-neutral-950 outline-none placeholder:text-neutral-300",
            rtl ? "font-arabic text-right" : latin,
            className,
          )}
          {...props}
        />
      </span>
    </label>
  );
}

function LocaleInput({
  name,
  defaultValue,
  dir,
  area,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  dir: "ltr" | "rtl";
  area?: boolean;
  placeholder?: string;
}) {
  const rtl = dir === "rtl";
  const shared = cn(
    "w-full bg-transparent text-[15px] text-neutral-950 outline-none placeholder:text-neutral-300",
    rtl ? "font-arabic text-right" : latin,
  );
  return (
    <div className={cn("flex min-h-[88px] flex-col px-3.5 py-3", shell, area && "min-h-[140px]")}>
      <span
        className={cn(
          "mb-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-normal",
          rtl ? "font-arabic bg-[#f3f5f8] text-neutral-500" : "bg-[#eef3ff] text-primary",
        )}
      >
        {rtl ? "عربي" : "EN"}
      </span>
      {area ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          dir={dir}
          lang={rtl ? "ar" : "en"}
          placeholder={placeholder}
          ref={(node) => resizeArea(node)}
          onInput={(event) => resizeArea(event.currentTarget)}
          className={cn(shared, "min-h-16 flex-1 resize-none leading-7")}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          dir={dir}
          lang={rtl ? "ar" : "en"}
          placeholder={placeholder}
          className={cn(shared, "h-8")}
        />
      )}
    </div>
  );
}

export function AdminPair({
  nameEn,
  nameAr,
  label,
  defaultEn,
  defaultAr,
  placeholderEn,
  placeholderAr,
  area = false,
}: {
  nameEn: string;
  nameAr: string;
  label: string;
  defaultEn?: string;
  defaultAr?: string;
  placeholderEn?: string;
  placeholderAr?: string;
  area?: boolean;
}) {
  const { arabic } = useLang();
  return (
    <div className="grid gap-2">
      <p className={cn("text-[12px] font-medium text-neutral-500", arabic ? "font-arabic" : latin)}>{label}</p>
      <div dir="ltr" className="grid gap-3 md:grid-cols-2">
        <LocaleInput name={nameEn} defaultValue={defaultEn} dir="ltr" area={area} placeholder={placeholderEn} />
        <LocaleInput name={nameAr} defaultValue={defaultAr} dir="rtl" area={area} placeholder={placeholderAr} />
      </div>
    </div>
  );
}

export function AdminGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const { arabic } = useLang();
  return (
    <div className="space-y-4 rounded-[20px] bg-[#f6f8fb] p-4 md:p-5">
      <p className={cn("text-[11px] font-semibold text-neutral-400", arabic ? "font-arabic" : "uppercase tracking-[0.14em]")}>{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function AdminSwitch({
  name,
  label,
  defaultChecked,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const { arabic } = useLang();
  const [on, setOn] = useState(Boolean(checked ?? defaultChecked));
  useEffect(() => {
    if (checked !== undefined) setOn(checked);
  }, [checked]);
  const active = checked ?? on;
  return (
    <label className="relative inline-flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        name={name}
        checked={active}
        onChange={(event) => {
          const next = event.target.checked;
          if (checked === undefined) setOn(next);
          onChange?.(next);
        }}
        className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          active ? "bg-primary" : "bg-[#d7deea]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[inset-inline-start]",
            active ? "start-5" : "start-0.5",
          )}
        />
      </span>
      <span className={cn("text-sm text-neutral-500", arabic ? "font-arabic" : latin)}>{label}</span>
    </label>
  );
}

export function AdminSection({
  title,
  description,
  open: openProp,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string;
  description?: string;
  open?: boolean;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { arabic } = useLang();
  const [openState, setOpen] = useState(defaultOpen);
  const open = openProp ?? openState;
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#eef2f8] bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)]">
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
        <button type="button" onClick={() => setOpen((value) => !value)} className="min-w-0 flex-1 text-start">
          <span className={cn("block text-[17px] font-semibold text-neutral-950", arabic ? "font-arabic" : latin)}>{title}</span>
          {description ? (
            <span className={cn("mt-1 block text-sm text-neutral-400", arabic ? "font-arabic" : latin)}>{description}</span>
          ) : null}
        </button>
        <div className="flex shrink-0 items-center gap-3">
          {badge}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-[#f7f9fc]"
            aria-expanded={open}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
        </div>
      </div>
      <div className={cn("space-y-5 border-t border-[#eef2f8] px-5 py-5 md:px-6", !open && "hidden")}>{children}</div>
    </section>
  );
}

export function AdminSaveBar({
  pending,
  error,
  notice,
  saveLabel,
  savingLabel,
}: {
  pending: boolean;
  error: string;
  notice: string;
  saveLabel: string;
  savingLabel: string;
}) {
  const { t, arabic } = useLang();
  return (
    <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e8edf5] bg-white px-4 py-3 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)]">
      <p className={cn("min-w-0 flex-1 text-sm", error ? "text-primary" : "text-neutral-400", arabic ? "font-arabic" : latin)}>
        {error || notice || t.admin.saveHint}
      </p>
      <button
        type="submit"
        disabled={pending}
        dir={arabic ? "rtl" : "ltr"}
        className={cn(
          "shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold whitespace-pre text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0",
          arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.08em]",
        )}
      >
        {pending ? savingLabel : saveLabel}
      </button>
    </div>
  );
}
