import { loc } from "@/lib/i18n/portal-ar";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super("Request failed");
    this.status = status;
    this.body = body;
  }
}

const configured = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const base = configured || "http://localhost:8000/api";

export function hasRemoteApi() {
  if (!configured) return process.env.NODE_ENV !== "production";
  try {
    const host = new URL(configured).hostname;
    const local = host === "localhost" || host === "127.0.0.1";
    return !(local && process.env.NODE_ENV === "production");
  } catch {
    return process.env.NODE_ENV !== "production";
  }
}

function normalize(path: string) {
  const [pathname, query] = path.split("?");
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const prefixed = withSlash.startsWith("/") ? withSlash : `/${withSlash}`;
  return query ? `${prefixed}?${query}` : prefixed;
}

export function isNetworkError(error: unknown) {
  return error instanceof TypeError || (error instanceof DOMException && error.name === "AbortError");
}

function isArabic() {
  return typeof document !== "undefined" && document.documentElement.lang === "ar";
}

function fieldErrors(body: Record<string, unknown>) {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(body)) {
    if (key === "detail") continue;
    if (Array.isArray(value)) {
      const text = value.filter((item) => typeof item === "string").join(" ");
      if (text) parts.push(`${key}: ${text}`);
    } else if (typeof value === "string" && value) {
      parts.push(`${key}: ${value}`);
    }
  }
  return parts.join(" · ");
}

export function errorMessage(error: unknown, fallback?: string) {
  const ar = isArabic();
  if (error instanceof ApiError) {
    if (typeof error.body === "object" && error.body) {
      const body = error.body as Record<string, unknown>;
      if (typeof body.detail === "string") {
        const detail = body.detail;
        if (/no active account/i.test(detail) || /credentials/i.test(detail)) {
          return ar ? "البريد أو كلمة المرور غير صحيحة." : "Email or password is incorrect.";
        }
        return loc(ar, detail) || detail;
      }
      const fields = fieldErrors(body);
      if (fields) return fields;
    }
    if (error.status === 401) return ar ? "البريد أو كلمة المرور غير صحيحة." : "Email or password is incorrect.";
    if (error.status === 400) return ar ? "راجع النموذج وحاول مرة أخرى." : "Check the form and try again.";
    if (error.status === 413) return ar ? "الملف أو البيانات كبيرة جداً." : "The image or data is too large.";
  }
  if (isNetworkError(error)) return ar ? "تعذّر الوصول إلى الخادم." : "We could not reach the server.";
  return fallback ?? (ar ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Try again.");
}

async function refreshAccess() {
  if (typeof window === "undefined") return null;
  const refresh = localStorage.getItem("vb_refresh");
  if (!refresh) return null;
  const response = await fetch(`${base}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { access: string };
  localStorage.setItem("vb_access", data.access);
  return data.access;
}

type Options = RequestInit & { timeoutMs?: number; retry?: boolean };

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  if (!hasRemoteApi()) {
    throw new TypeError("API is not configured");
  }
  const { timeoutMs = 8000, retry = true, ...init } = options;
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vb_access");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${base}${normalize(path)}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: init.signal ?? AbortSignal.timeout(timeoutMs),
  });
  if (response.status === 401 && retry && typeof window !== "undefined" && !path.includes("/auth/")) {
    const access = await refreshAccess().catch(() => null);
    if (access) return apiFetch<T>(path, { ...options, retry: false });
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

