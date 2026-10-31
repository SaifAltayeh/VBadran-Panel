export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatPrice(value: string | number, currency = "USD") {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
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
