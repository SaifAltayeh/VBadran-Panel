import type {
  AdminClient,
  AdminInquiry,
  AdminOverview,
  AdminPackage,
  AdminProgram,
  AdminTestimonial,
  AdminTransformation,
} from "@/types";

import { mergeSiteHome, type SiteHome } from "@/lib/site-home";

import { apiFetch } from "./client";

export const getAdminSite = () => apiFetch<SiteHome>("/admin/site/").then(mergeSiteHome);
export const updateAdminSite = (payload: Partial<SiteHome>) =>
  apiFetch<SiteHome>("/admin/site/", { method: "PATCH", body: JSON.stringify(payload) });

export function uploadAdminImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiFetch<{ url: string; path: string }>("/admin/uploads/", {
    method: "POST",
    body,
    timeoutMs: 60000,
  });
}

export const getAdminOverview = () => apiFetch<AdminOverview>("/admin/overview/");
export const getAdminPrograms = () => apiFetch<AdminProgram[]>("/admin/programs/");
export const getAdminProgram = (id: number) => apiFetch<AdminProgram>(`/admin/programs/${id}/`);
export const createAdminProgram = (payload: Partial<AdminProgram>) =>
  apiFetch<AdminProgram>("/admin/programs/", { method: "POST", body: JSON.stringify(payload) });
export const updateAdminProgram = (id: number, payload: Partial<AdminProgram>) =>
  apiFetch<AdminProgram>(`/admin/programs/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteAdminProgram = (id: number) => apiFetch<void>(`/admin/programs/${id}/`, { method: "DELETE" });

export const getAdminPackages = () => apiFetch<AdminPackage[]>("/admin/packages/");
export const getAdminPackage = (id: number) => apiFetch<AdminPackage>(`/admin/packages/${id}/`);
export const createAdminPackage = (payload: Partial<AdminPackage>) =>
  apiFetch<AdminPackage>("/admin/packages/", { method: "POST", body: JSON.stringify(payload) });
export const updateAdminPackage = (id: number, payload: Partial<AdminPackage>) =>
  apiFetch<AdminPackage>(`/admin/packages/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteAdminPackage = (id: number) => apiFetch<void>(`/admin/packages/${id}/`, { method: "DELETE" });

export const getAdminTransformations = () => apiFetch<AdminTransformation[]>("/admin/transformations/");
export const getAdminTransformation = (id: number) => apiFetch<AdminTransformation>(`/admin/transformations/${id}/`);
export const createAdminTransformation = (payload: Partial<AdminTransformation>) =>
  apiFetch<AdminTransformation>("/admin/transformations/", { method: "POST", body: JSON.stringify(payload) });
export const updateAdminTransformation = (id: number, payload: Partial<AdminTransformation>) =>
  apiFetch<AdminTransformation>(`/admin/transformations/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteAdminTransformation = (id: number) =>
  apiFetch<void>(`/admin/transformations/${id}/`, { method: "DELETE" });

export const getAdminTestimonials = () => apiFetch<AdminTestimonial[]>("/admin/testimonials/");
export const getAdminTestimonial = (id: number) => apiFetch<AdminTestimonial>(`/admin/testimonials/${id}/`);
export const createAdminTestimonial = (payload: Partial<AdminTestimonial>) =>
  apiFetch<AdminTestimonial>("/admin/testimonials/", { method: "POST", body: JSON.stringify(payload) });
export const updateAdminTestimonial = (id: number, payload: Partial<AdminTestimonial>) =>
  apiFetch<AdminTestimonial>(`/admin/testimonials/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteAdminTestimonial = (id: number) => apiFetch<void>(`/admin/testimonials/${id}/`, { method: "DELETE" });

export const getAdminInquiries = () => apiFetch<AdminInquiry[]>("/admin/inquiries/");
export const updateAdminInquiry = (id: number, payload: Partial<AdminInquiry>) =>
  apiFetch<AdminInquiry>(`/admin/inquiries/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });

export const getAdminClients = () => apiFetch<AdminClient[]>("/admin/clients/");

export function isStaffSession() {
  return typeof window !== "undefined" && window.localStorage.getItem("vb_staff") === "1";
}
