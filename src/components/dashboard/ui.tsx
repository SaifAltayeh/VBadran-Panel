import { cn } from "@/lib/utils";

export function DashCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[24px] bg-white p-5 shadow-[0_10px_32px_-20px_rgba(15,23,42,0.28)] md:p-6", className)}>
      {children}
    </div>
  );
}

export function DashKicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[12px] text-neutral-400", className)}>{children}</p>;
}

export function DashTitle({
  children,
  className,
  arabic = false,
}: {
  children: React.ReactNode;
  className?: string;
  arabic?: boolean;
}) {
  return (
    <h1
      className={cn(
        "text-[28px] text-neutral-950 md:text-[32px]",
        arabic ? "font-arabic font-extrabold tracking-normal" : "font-display tracking-tight",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function StatCard({
  label,
  value,
  hint,
  arabic = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  arabic?: boolean;
}) {
  return (
    <DashCard>
      <DashKicker className={arabic ? "font-arabic" : undefined}>{label}</DashKicker>
      <p className={`mt-3 text-[28px] leading-none tracking-tight md:text-[32px] ${arabic ? "font-arabic font-extrabold" : "font-display"}`}>
        {value}
      </p>
      {hint ? <p className={`mt-2 text-[13px] text-neutral-400 ${arabic ? "font-arabic" : ""}`}>{hint}</p> : null}
    </DashCard>
  );
}
