import type { AuthUser } from "@/types";

import { apiFetch } from "./client";

export { errorMessage } from "./client";

export function setSession(tokens: { access: string; refresh: string; user?: AuthUser }) {
  localStorage.setItem("vb_access", tokens.access);
  localStorage.setItem("vb_refresh", tokens.refresh);
  localStorage.removeItem("vb_preview");
  if (tokens.user?.is_staff) localStorage.setItem("vb_staff", "1");
  else localStorage.removeItem("vb_staff");
  document.cookie = "vb_session=1; path=/; max-age=604800; samesite=lax";
}

export function clearSession() {
  localStorage.removeItem("vb_access");
  localStorage.removeItem("vb_refresh");
  localStorage.removeItem("vb_preview");
  localStorage.removeItem("vb_staff");
  document.cookie = "vb_session=; path=/; max-age=0; samesite=lax";
}

export async function login(email: string, password: string) {
  const data = await apiFetch<{ access: string; refresh: string; user: AuthUser }>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, username: email, password }),
  });
  setSession(data);
  return data.user;
}
