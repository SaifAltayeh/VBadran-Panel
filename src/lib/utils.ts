export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatPrice(value: string | number, currency = "KWD", lang: "en" | "ar" = "en") {
  const amount = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(amount)) return "";
  const code = (currency || "KWD").toUpperCase();
  const digits = code === "KWD" ? 3 : 2;
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar" : "en-KW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(amount);
  if (code === "KWD") {
    return lang === "ar" ? `${formatted} د.ك` : `KWD ${formatted}`;
  }
  return lang === "ar" ? `${formatted} ${code}` : `${code} ${formatted}`;
}

export function formatDate(iso: string, locale = "en") {
  const value = iso.length <= 10 ? `${iso}T00:00:00` : iso;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { month: "short", day: "numeric" }).format(new Date(value));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const ease = [0.16, 1, 0.3, 1] as const;
