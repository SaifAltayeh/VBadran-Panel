import type {
  AdminClient,
  AdminExercise,
  AdminInquiry,
  AdminNutritionPlan,
  AdminOverview,
  AdminPackage,
  AdminPortalVideo,
  AdminProgram,
  AdminSchedule,
  AdminSubscription,
  AdminTestimonial,
  AdminTransformation,
  AdminWorkout,
} from "@/types";

import { mergeSiteHome, type SiteHome } from "@/lib/site-home";

import { apiFetch } from "./client";

export const getAdminSite = () => apiFetch<SiteHome>("/admin/site/").then(mergeSiteHome);
export const updateAdminSite = (payload: Partial<SiteHome>) =>
  apiFetch<SiteHome>("/admin/site/", { method: "PATCH", body: JSON.stringify(payload) }).then(mergeSiteHome);

export function uploadAdminImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiFetch<{ url: string; path: string }>("/admin/uploads/", {
    method: "POST",
    body,
    timeoutMs: 60000,
  });
}

export function uploadAdminVideo(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiFetch<{ url: string; path: string }>("/admin/uploads/video/", {
    method: "POST",
    body,
    timeoutMs: 120000,
  });
}

export const getAdminOverview = () => apiFetch<AdminOverview>("/admin/overview/");
export const getAdminPrograms = () => apiFetch<AdminProgram[]>("/admin/programs/");
export const getAdminProgram = (id: number) => apiFetch<AdminProgram>(`/admin/programs/${id}/`);
const writeTimeout = { timeoutMs: 45000 };

export const createAdminProgram = (payload: Partial<AdminProgram>) =>
  apiFetch<AdminProgram>("/admin/programs/", { method: "POST", body: JSON.stringify(payload), ...writeTimeout });
export const updateAdminProgram = (id: number, payload: Partial<AdminProgram>) =>
  apiFetch<AdminProgram>(`/admin/programs/${id}/`, { method: "PATCH", body: JSON.stringify(payload), ...writeTimeout });
export const deleteAdminProgram = (id: number) => apiFetch<void>(`/admin/programs/${id}/`, { method: "DELETE" });

export const getAdminPackages = () => apiFetch<AdminPackage[]>("/admin/packages/");
export const getAdminPackage = (id: number) => apiFetch<AdminPackage>(`/admin/packages/${id}/`);
export const createAdminPackage = (payload: Partial<AdminPackage>) =>
  apiFetch<AdminPackage>("/admin/packages/", { method: "POST", body: JSON.stringify(payload), ...writeTimeout });
export const updateAdminPackage = (id: number, payload: Partial<AdminPackage>) =>
  apiFetch<AdminPackage>(`/admin/packages/${id}/`, { method: "PATCH", body: JSON.stringify(payload), ...writeTimeout });
export const deleteAdminPackage = (id: number) => apiFetch<void>(`/admin/packages/${id}/`, { method: "DELETE" });

export const getAdminTransformations = () => apiFetch<AdminTransformation[]>("/admin/transformations/");
export const getAdminTransformation = (id: number) => apiFetch<AdminTransformation>(`/admin/transformations/${id}/`);
export const createAdminTransformation = (payload: Partial<AdminTransformation>) =>
  apiFetch<AdminTransformation>("/admin/transformations/", {
    method: "POST",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const updateAdminTransformation = (id: number, payload: Partial<AdminTransformation>) =>
  apiFetch<AdminTransformation>(`/admin/transformations/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const deleteAdminTransformation = (id: number) =>
  apiFetch<void>(`/admin/transformations/${id}/`, { method: "DELETE" });

export const getAdminTestimonials = () => apiFetch<AdminTestimonial[]>("/admin/testimonials/");
export const getAdminTestimonial = (id: number) => apiFetch<AdminTestimonial>(`/admin/testimonials/${id}/`);
export const createAdminTestimonial = (payload: Partial<AdminTestimonial>) =>
  apiFetch<AdminTestimonial>("/admin/testimonials/", {
    method: "POST",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const updateAdminTestimonial = (id: number, payload: Partial<AdminTestimonial>) =>
  apiFetch<AdminTestimonial>(`/admin/testimonials/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const deleteAdminTestimonial = (id: number) => apiFetch<void>(`/admin/testimonials/${id}/`, { method: "DELETE" });

export const getAdminInquiries = () => apiFetch<AdminInquiry[]>("/admin/inquiries/");
export const updateAdminInquiry = (id: number, payload: Partial<AdminInquiry>) =>
  apiFetch<AdminInquiry>(`/admin/inquiries/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });

export const getAdminClients = () => apiFetch<AdminClient[]>("/admin/clients/");

export const getAdminExercises = () => apiFetch<AdminExercise[]>("/admin/exercises/");
export const getAdminExercise = (id: number) => apiFetch<AdminExercise>(`/admin/exercises/${id}/`);
export const createAdminExercise = (payload: Partial<AdminExercise>) =>
  apiFetch<AdminExercise>("/admin/exercises/", { method: "POST", body: JSON.stringify(payload), ...writeTimeout });
export const updateAdminExercise = (id: number, payload: Partial<AdminExercise>) =>
  apiFetch<AdminExercise>(`/admin/exercises/${id}/`, { method: "PATCH", body: JSON.stringify(payload), ...writeTimeout });
export const deleteAdminExercise = (id: number) => apiFetch<void>(`/admin/exercises/${id}/`, { method: "DELETE" });

export const getAdminPortalVideos = () => apiFetch<AdminPortalVideo[]>("/admin/portal-videos/");
export const getAdminPortalVideo = (id: number) => apiFetch<AdminPortalVideo>(`/admin/portal-videos/${id}/`);
export const createAdminPortalVideo = (payload: Partial<AdminPortalVideo>) =>
  apiFetch<AdminPortalVideo>("/admin/portal-videos/", { method: "POST", body: JSON.stringify(payload), ...writeTimeout });
export const updateAdminPortalVideo = (id: number, payload: Partial<AdminPortalVideo>) =>
  apiFetch<AdminPortalVideo>(`/admin/portal-videos/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const deleteAdminPortalVideo = (id: number) => apiFetch<void>(`/admin/portal-videos/${id}/`, { method: "DELETE" });

export const getAdminWorkouts = () => apiFetch<AdminWorkout[]>("/admin/workouts/");
export const getAdminWorkout = (id: number) => apiFetch<AdminWorkout>(`/admin/workouts/${id}/`);
export const createAdminWorkout = (payload: Record<string, unknown>) =>
  apiFetch<AdminWorkout>("/admin/workouts/", { method: "POST", body: JSON.stringify(payload), ...writeTimeout });
export const updateAdminWorkout = (id: number, payload: Record<string, unknown>) =>
  apiFetch<AdminWorkout>(`/admin/workouts/${id}/`, { method: "PATCH", body: JSON.stringify(payload), ...writeTimeout });
export const deleteAdminWorkout = (id: number) => apiFetch<void>(`/admin/workouts/${id}/`, { method: "DELETE" });

export const getAdminSchedules = () => apiFetch<AdminSchedule[]>("/admin/schedules/");
export const getAdminSchedule = (id: number) => apiFetch<AdminSchedule>(`/admin/schedules/${id}/`);
export const createAdminSchedule = (payload: Partial<AdminSchedule>) =>
  apiFetch<AdminSchedule>("/admin/schedules/", { method: "POST", body: JSON.stringify(payload), ...writeTimeout });
export const updateAdminSchedule = (id: number, payload: Partial<AdminSchedule>) =>
  apiFetch<AdminSchedule>(`/admin/schedules/${id}/`, { method: "PATCH", body: JSON.stringify(payload), ...writeTimeout });
export const deleteAdminSchedule = (id: number) => apiFetch<void>(`/admin/schedules/${id}/`, { method: "DELETE" });

export const getAdminNutritionPlans = () => apiFetch<AdminNutritionPlan[]>("/admin/nutrition-plans/");
export const getAdminNutritionPlan = (id: number) => apiFetch<AdminNutritionPlan>(`/admin/nutrition-plans/${id}/`);
export const createAdminNutritionPlan = (payload: Record<string, unknown>) =>
  apiFetch<AdminNutritionPlan>("/admin/nutrition-plans/", {
    method: "POST",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const updateAdminNutritionPlan = (id: number, payload: Record<string, unknown>) =>
  apiFetch<AdminNutritionPlan>(`/admin/nutrition-plans/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const deleteAdminNutritionPlan = (id: number) =>
  apiFetch<void>(`/admin/nutrition-plans/${id}/`, { method: "DELETE" });

export const getAdminSubscriptions = () => apiFetch<AdminSubscription[]>("/admin/subscriptions/");
export const getAdminSubscription = (id: number) => apiFetch<AdminSubscription>(`/admin/subscriptions/${id}/`);
export const createAdminSubscription = (payload: Partial<AdminSubscription>) =>
  apiFetch<AdminSubscription>("/admin/subscriptions/", {
    method: "POST",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const updateAdminSubscription = (id: number, payload: Partial<AdminSubscription>) =>
  apiFetch<AdminSubscription>(`/admin/subscriptions/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    ...writeTimeout,
  });
export const deleteAdminSubscription = (id: number) =>
  apiFetch<void>(`/admin/subscriptions/${id}/`, { method: "DELETE" });

export function isStaffSession() {
  return typeof window !== "undefined" && window.localStorage.getItem("vb_staff") === "1";
}
