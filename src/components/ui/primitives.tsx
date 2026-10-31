"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { crops } from "@/lib/constants/site";
import { useLang } from "@/lib/i18n";
import { cn, ease } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "white" | "outlineLight";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  arrow?: boolean;
};

const buttonStyles = {
  primary: "bg-primary text-white hover:bg-[#1c3694]",
  secondary: "bg-black text-white hover:bg-[#1a1a1a]",
  outline: "border border-black bg-white text-black hover:bg-black hover:text-white",
  white: "bg-white text-black hover:bg-surface",
  outlineLight: "border border-white bg-transparent text-white hover:bg-white hover:text-black",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
  arrow = true,
}: ButtonProps) {
  const classNames = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-center text-[12px] font-semibold uppercase tracking-[0.08em] transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:px-6 sm:tracking-[0.16em]",
    buttonStyles[variant],
    className,
  );
  const content = (
    <>
      {children}
      {arrow ? <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /> : null}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={classNames}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classNames}>
      {content}
    </button>
  );
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full min-w-0 max-w-[1440px] px-5 md:px-10", className)}>{children}</div>;
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = Boolean(useReducedMotion());
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.75, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.14, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = Boolean(useReducedMotion());
  return (
    <motion.div
      className={className}
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function Media({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  position,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  position?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      style={{ objectPosition: position ?? crops[src] ?? "center" }}
    />
  );
}

export function Field({
  label,
  className,
  labelClassName,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; labelClassName?: string }) {
  const id = props.id || props.name;
  return (
    <label className="block min-w-0" htmlFor={id}>
      <span className={cn("mb-2 block text-[13px] text-muted", labelClassName)}>{label}</span>
      <input
        id={id}
        className={cn(
          "h-12 w-full min-w-0 rounded-xl border border-line bg-white px-4 font-sans text-base tracking-normal text-black outline-none transition-colors [word-spacing:0.06em] focus:border-primary",
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function TextArea({
  label,
  labelClassName,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; labelClassName?: string }) {
  const id = props.id || props.name;
  return (
    <label className="block min-w-0" htmlFor={id}>
      <span className={cn("mb-2 block text-[13px] text-muted", labelClassName)}>{label}</span>
      <textarea
        id={id}
        className="min-h-36 w-full min-w-0 rounded-xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-primary"
        {...props}
      />
    </label>
  );
}

export function SelectField({
  label,
  children,
  labelClassName,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; labelClassName?: string }) {
  const id = props.id || props.name;
  return (
    <label className="block min-w-0" htmlFor={id}>
      <span className={cn("mb-2 block text-[13px] text-muted", labelClassName)}>{label}</span>
      <select
        id={id}
        className="h-12 w-full min-w-0 rounded-xl border border-line bg-white px-4 text-base outline-none focus:border-primary"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.q} className="border-b border-line">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : index)}
            >
              <span className="font-display text-2xl tracking-tight md:text-3xl">{item.q}</span>
              {expanded ? <Minus className="h-5 w-5 shrink-0" /> : <Plus className="h-5 w-5 shrink-0" />}
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-500", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-6 text-base leading-7 text-neutral-700 md:text-lg">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  const { arabic } = useLang();
  return (
    <div className={`border border-line px-6 py-16 text-center ${arabic ? "font-arabic" : ""}`}>
      <h2 className={arabic ? "text-3xl font-extrabold" : "font-display text-3xl"}>{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-neutral-700">{body}</p>
      {href && action ? (
        <div className="mt-6">
          <Button href={href}>{action}</Button>
        </div>
      ) : null}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t, arabic } = useLang();
  return (
    <div className={`border border-line px-6 py-16 text-center ${arabic ? "font-arabic" : ""}`} role="alert">
      <h2 className={arabic ? "text-3xl font-extrabold" : "font-display text-3xl"}>{t.dash.loadError}</h2>
      <p className="mt-3 text-neutral-700">{t.dash.loadErrorBody}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-6 text-sm underline">
          {t.dash.tryAgain}
        </button>
      ) : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-surface", className)} />;
}
