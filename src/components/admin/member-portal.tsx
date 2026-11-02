"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useMemo, useState } from "react";
import {
  CalendarDays,
  Clapperboard,
  Dumbbell,
  Library,
  Salad,
  ShieldCheck,
} from "lucide-react";

import { BackLink } from "@/components/admin/back-link";
import { AdminArea, AdminField, AdminSwitch } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { VideoField } from "@/components/admin/video-field";
import { DashTitle } from "@/components/dashboard/ui";
import { Button, Skeleton } from "@/components/ui/primitives";
import { errorMessage } from "@/lib/api";
import {
  createAdminExercise,
  createAdminNutritionPlan,
  createAdminPortalVideo,
  createAdminSchedule,
  createAdminSubscription,
  createAdminWorkout,
  deleteAdminExercise,
  deleteAdminNutritionPlan,
  deleteAdminPortalVideo,
  deleteAdminSchedule,
  deleteAdminSubscription,
  deleteAdminWorkout,
  getAdminClients,
  getAdminExercise,
  getAdminExercises,
  getAdminNutritionPlan,
  getAdminNutritionPlans,
  getAdminPortalVideo,
  getAdminPortalVideos,
  getAdminPrograms,
  getAdminSchedule,
  getAdminSchedules,
  getAdminSubscription,
  getAdminSubscriptions,
  getAdminWorkout,
  getAdminWorkouts,
  updateAdminExercise,
  updateAdminNutritionPlan,
  updateAdminPortalVideo,
  updateAdminSchedule,
  updateAdminSubscription,
  updateAdminWorkout,
} from "@/lib/api/admin";
import { useResource } from "@/lib/hooks/use-resource";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { AdminWorkoutItem } from "@/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(value: string, title: string) {
  const base = slugify(value || title) || `item-${Date.now().toString(36)}`;
  return value.trim() ? base : `${base}-${Date.now().toString(36).slice(-4)}`;
}

function useFormState() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  return { pending, setPending, error, setError, notice, setNotice };
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 grid gap-4 md:grid-cols-2">{children}</div>;
}

function ListHeader({ title, href, create }: { title: string; href: string; create: string }) {
  const { arabic } = useLang();
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className={`text-xl font-semibold ${arabic ? "font-arabic" : "font-display tracking-tight"}`}>{title}</h2>
      <Button href={href} arrow={false} className={arabic ? "font-arabic normal-case tracking-normal" : "normal-case tracking-normal"}>
        {create}
      </Button>
    </div>
  );
}

function TableCard({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)]">{children}</div>;
}

function StatusPill({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px]", on ? "bg-emerald-50 text-emerald-700" : "bg-[#eef2f8] text-neutral-500")}>
      {on ? onLabel : offLabel}
    </span>
  );
}

function FormShell({
  title,
  onSubmit,
  onDelete,
  pending,
  error,
  notice,
  children,
}: {
  title: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
  pending: boolean;
  error: string;
  notice: string;
  children: React.ReactNode;
}) {
  const { t, arabic } = useLang();
  return (
    <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <DashTitle arabic={arabic}>{title}</DashTitle>
      {children}
      {error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}
      {notice ? <p className="mt-4 text-sm text-neutral-500">{notice}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} arrow={false}>
          {pending ? t.admin.saving : t.admin.save}
        </Button>
        {onDelete ? (
          <button type="button" onClick={onDelete} className="rounded-full px-5 text-sm text-neutral-500 hover:text-black">
            {t.admin.remove}
          </button>
        ) : null}
      </div>
    </form>
  );
}

const sections = [
  {
    href: "/admin/member-portal/videos",
    key: "portalVideos",
    body: "portalVideosBody",
    icon: Clapperboard,
  },
  {
    href: "/admin/member-portal/exercises",
    key: "portalExercises",
    body: "portalExercisesBody",
    icon: Library,
  },
  {
    href: "/admin/member-portal/workouts",
    key: "portalWorkouts",
    body: "portalWorkoutsBody",
    icon: Dumbbell,
  },
  {
    href: "/admin/member-portal/schedules",
    key: "portalSchedules",
    body: "portalSchedulesBody",
    icon: CalendarDays,
  },
  {
    href: "/admin/member-portal/nutrition",
    key: "portalNutrition",
    body: "portalNutritionBody",
    icon: Salad,
  },
  {
    href: "/admin/member-portal/access",
    key: "portalAccess",
    body: "portalAccessBody",
    icon: ShieldCheck,
  },
] as const;

export function MemberPortalHub() {
  const { t, arabic } = useLang();
  return (
    <div>
      <BackLink href="/admin" label={t.admin.overview} />
      <DashTitle arabic={arabic}>{t.admin.memberPortal}</DashTitle>
      <p className={`mt-2 max-w-2xl text-sm text-neutral-500 ${arabic ? "font-arabic" : ""}`}>{t.admin.memberPortalLead}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] transition-transform hover:-translate-y-0.5"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3ff] text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className={`mt-4 text-lg font-semibold ${arabic ? "font-arabic" : "font-display tracking-tight"}`}>
                {t.admin[section.key]}
              </h3>
              <p className={`mt-2 text-sm text-neutral-500 ${arabic ? "font-arabic" : ""}`}>{t.admin[section.body]}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AdminPortalVideoList() {
  const { t, arabic } = useLang();
  const { status, data } = useResource(useCallback(() => getAdminPortalVideos(), []));
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <BackLink href="/admin/member-portal" />
      <ListHeader title={t.admin.portalVideos} href="/admin/member-portal/videos/new" create={t.admin.newItem} />
      <TableCard>
        {data.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/admin/member-portal/videos/${item.id}`}
            className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]"
          >
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.title}</p>
              <p className="mt-1 text-sm text-neutral-400">{item.program_title}</p>
            </div>
            <StatusPill on={item.is_active} onLabel={t.admin.active} offLabel={t.admin.hidden} />
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminPortalVideoForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const programs = useResource(useCallback(() => getAdminPrograms(), []));
  const loader = useCallback(() => (id ? getAdminPortalVideo(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  if ((id && status === "loading" && !data) || programs.status === "loading") {
    return <Skeleton className="h-48 w-full rounded-[24px]" />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const title = String(raw.get("title") || "").trim();
    const video_url = String(raw.get("video_url") || "").trim();
    if (!title || !video_url) {
      form.setError(arabic ? "العنوان والفيديو مطلوبان." : "Title and video upload are required.");
      return;
    }
    const payload = {
      title,
      description: String(raw.get("description") || ""),
      video_url,
      thumbnail: String(raw.get("thumbnail") || ""),
      program: Number(raw.get("program")),
      order: Number(raw.get("order") || 0),
      is_active: raw.get("is_active") === "on",
    };
    form.setPending(true);
    form.setError("");
    form.setNotice("");
    try {
      if (id) await updateAdminPortalVideo(id, payload);
      else {
        const created = await createAdminPortalVideo(payload);
        form.setNotice(t.admin.saved);
        router.replace(`/admin/member-portal/videos/${created.id}`);
        return;
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  return (
    <div>
      <BackLink href="/admin/member-portal/videos" />
      <FormShell
        title={data?.title || t.admin.newItem}
        onSubmit={onSubmit}
        pending={form.pending}
        error={form.error}
        notice={form.notice}
        onDelete={
          id
            ? async () => {
                if (!window.confirm(t.admin.remove)) return;
                await deleteAdminPortalVideo(id);
                router.push("/admin/member-portal/videos");
              }
            : undefined
        }
      >
        <FormGrid>
          <AdminField name="title" label={t.admin.titleField} defaultValue={data?.title} required />
          <label className="grid gap-1.5">
            <span className="text-[12px] font-medium text-neutral-500">{t.admin.programs}</span>
            <select
              name="program"
              defaultValue={data?.program || programs.data?.[0]?.id || ""}
              className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] outline-none"
              required
            >
              {(programs.data || []).map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </label>
          <AdminField name="order" label={t.admin.orderField} type="number" defaultValue={String(data?.order ?? 0)} />
        </FormGrid>
        <div className="mt-4">
          <VideoField name="video_url" label={t.admin.videoFile} defaultValue={data?.video_url} />
        </div>
        <div className="mt-4">
          <ImageField name="thumbnail" label={t.admin.imagePath} defaultValue={data?.thumbnail} preset="videoThumb" />
        </div>
        <div className="mt-4">
          <AdminArea name="description" label={t.admin.textField} defaultValue={data?.description} />
        </div>
        <div className="mt-5">
          <AdminSwitch name="is_active" label={t.admin.active} defaultChecked={data?.is_active ?? true} />
        </div>
      </FormShell>
    </div>
  );
}

export function AdminExerciseList() {
  const { t, arabic } = useLang();
  const { status, data } = useResource(useCallback(() => getAdminExercises(), []));
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <BackLink href="/admin/member-portal" />
      <ListHeader title={t.admin.portalExercises} href="/admin/member-portal/exercises/new" create={t.admin.newItem} />
      <TableCard>
        {data.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/admin/member-portal/exercises/${item.id}`}
            className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]"
          >
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.name}</p>
              <p className="mt-1 text-sm text-neutral-400">
                {item.muscle_group} · {item.difficulty}
              </p>
            </div>
            <StatusPill on={Boolean(item.video_url)} onLabel={t.admin.hasVideo} offLabel={t.admin.noVideo} />
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminExerciseForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const loader = useCallback(() => (id ? getAdminExercise(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  if (id && status === "loading" && !data) return <Skeleton className="h-48 w-full rounded-[24px]" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const name = String(raw.get("name") || "").trim();
    if (!name) {
      form.setError(arabic ? "الاسم مطلوب." : "Name is required.");
      return;
    }
    const payload = {
      name,
      slug: id ? String(raw.get("slug") || slugify(name)) : uniqueSlug(String(raw.get("slug") || ""), name),
      description: String(raw.get("description") || ""),
      video_url: String(raw.get("video_url") || ""),
      thumbnail: String(raw.get("thumbnail") || ""),
      image_alt: String(raw.get("image_alt") || ""),
      muscle_group: String(raw.get("muscle_group") || "Full body"),
      difficulty: String(raw.get("difficulty") || "intermediate"),
      instructions: String(raw.get("instructions") || ""),
      tips: String(raw.get("tips") || ""),
    };
    form.setPending(true);
    form.setError("");
    form.setNotice("");
    try {
      if (id) await updateAdminExercise(id, payload);
      else {
        const created = await createAdminExercise(payload);
        form.setNotice(t.admin.saved);
        router.replace(`/admin/member-portal/exercises/${created.id}`);
        return;
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  return (
    <div>
      <BackLink href="/admin/member-portal/exercises" />
      <FormShell
        title={data?.name || t.admin.newItem}
        onSubmit={onSubmit}
        pending={form.pending}
        error={form.error}
        notice={form.notice}
        onDelete={
          id
            ? async () => {
                if (!window.confirm(t.admin.remove)) return;
                await deleteAdminExercise(id);
                router.push("/admin/member-portal/exercises");
              }
            : undefined
        }
      >
        <FormGrid>
          <AdminField name="name" label={t.admin.nameField} defaultValue={data?.name} required />
          <AdminField name="slug" label="Slug" defaultValue={data?.slug} />
          <AdminField name="muscle_group" label={t.admin.muscleGroup} defaultValue={data?.muscle_group || "Full body"} />
          <AdminField name="difficulty" label={t.admin.difficultyField} defaultValue={data?.difficulty || "intermediate"} />
          <AdminField name="image_alt" label={t.admin.imageAlt} defaultValue={data?.image_alt} />
        </FormGrid>
        <div className="mt-4">
          <VideoField name="video_url" label={t.admin.videoFile} defaultValue={data?.video_url} />
        </div>
        <div className="mt-4">
          <ImageField name="thumbnail" label={t.admin.imagePath} defaultValue={data?.thumbnail} preset="exercise" />
        </div>
        <div className="mt-4 grid gap-4">
          <AdminArea name="description" label={t.admin.textField} defaultValue={data?.description} />
          <AdminArea name="instructions" label={t.admin.instructionsField} defaultValue={data?.instructions} />
          <AdminArea name="tips" label={t.admin.tipsField} defaultValue={data?.tips} />
        </div>
      </FormShell>
    </div>
  );
}

export function AdminWorkoutList() {
  const { t, arabic } = useLang();
  const { status, data } = useResource(useCallback(() => getAdminWorkouts(), []));
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <BackLink href="/admin/member-portal" />
      <ListHeader title={t.admin.portalWorkouts} href="/admin/member-portal/workouts/new" create={t.admin.newItem} />
      <TableCard>
        {data.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/admin/member-portal/workouts/${item.id}`}
            className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]"
          >
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.title}</p>
              <p className="mt-1 text-sm text-neutral-400">
                {item.duration_minutes} min · {item.items?.length || 0} exercises
              </p>
            </div>
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

function parseItemRows(raw: string): AdminWorkoutItem[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [exercise_id, sets = "3", reps = "10", rest_seconds = "90", tempo = "", ...noteParts] = line.split("|").map((part) => part.trim());
      return {
        exercise_id: Number(exercise_id),
        sets,
        reps,
        rest_seconds: Number(rest_seconds) || 90,
        tempo,
        notes: noteParts.join("|"),
        order: index,
      };
    })
    .filter((row) => row.exercise_id > 0);
}

export function AdminWorkoutForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const exercises = useResource(useCallback(() => getAdminExercises(), []));
  const loader = useCallback(() => (id ? getAdminWorkout(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  const defaultRows = useMemo(
    () =>
      (data?.items || [])
        .map((item) => `${item.exercise_id}|${item.sets}|${item.reps}|${item.rest_seconds}|${item.tempo || ""}|${item.notes || ""}`)
        .join("\n"),
    [data],
  );
  if ((id && status === "loading" && !data) || exercises.status === "loading") {
    return <Skeleton className="h-48 w-full rounded-[24px]" />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const title = String(raw.get("title") || "").trim();
    if (!title) {
      form.setError(arabic ? "العنوان مطلوب." : "Title is required.");
      return;
    }
    const payload = {
      title,
      slug: id ? String(raw.get("slug") || slugify(title)) : uniqueSlug(String(raw.get("slug") || ""), title),
      description: String(raw.get("description") || ""),
      duration_minutes: Number(raw.get("duration_minutes") || 45) || 45,
      focus: String(raw.get("focus") || ""),
      coach_notes: String(raw.get("coach_notes") || ""),
      warmup: String(raw.get("warmup") || ""),
      item_rows: parseItemRows(String(raw.get("item_rows") || "")),
    };
    form.setPending(true);
    form.setError("");
    form.setNotice("");
    try {
      if (id) await updateAdminWorkout(id, payload);
      else {
        const created = await createAdminWorkout(payload);
        form.setNotice(t.admin.saved);
        router.replace(`/admin/member-portal/workouts/${created.id}`);
        return;
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  return (
    <div>
      <BackLink href="/admin/member-portal/workouts" />
      <FormShell
        title={data?.title || t.admin.newItem}
        onSubmit={onSubmit}
        pending={form.pending}
        error={form.error}
        notice={form.notice}
        onDelete={
          id
            ? async () => {
                if (!window.confirm(t.admin.remove)) return;
                await deleteAdminWorkout(id);
                router.push("/admin/member-portal/workouts");
              }
            : undefined
        }
      >
      <FormGrid>
        <AdminField name="title" label={t.admin.titleField} defaultValue={data?.title} required />
        <AdminField name="slug" label="Slug" defaultValue={data?.slug} />
        <AdminField name="duration_minutes" label={t.admin.durationField} type="number" defaultValue={String(data?.duration_minutes || 45)} />
        <AdminField name="focus" label={t.admin.focusField} defaultValue={data?.focus} />
      </FormGrid>
      <div className="mt-4 grid gap-4">
        <AdminArea name="description" label={t.admin.textField} defaultValue={data?.description} />
        <AdminArea name="warmup" label={t.admin.warmupField} defaultValue={data?.warmup} />
        <AdminArea name="coach_notes" label={t.admin.coachNotes} defaultValue={data?.coach_notes} />
        <AdminArea
          name="item_rows"
          label={t.admin.workoutItems}
          defaultValue={defaultRows}
          placeholder={"exerciseId|sets|reps|rest|tempo|notes\n12|3|10|90||Keep chest up"}
        />
      </div>
      <div className="mt-4 rounded-[18px] bg-[#f7f9fc] p-4 text-xs text-neutral-500">
        <p className="font-medium text-neutral-700">{t.admin.exerciseIds}</p>
        <ul className="mt-2 grid gap-1 md:grid-cols-2">
          {(exercises.data || []).map((exercise) => (
            <li key={exercise.id}>
              {exercise.id} — {exercise.name}
            </li>
          ))}
        </ul>
      </div>
      </FormShell>
    </div>
  );
}

export function AdminScheduleList() {
  const { t, arabic } = useLang();
  const { status, data } = useResource(useCallback(() => getAdminSchedules(), []));
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <BackLink href="/admin/member-portal" />
      <ListHeader title={t.admin.portalSchedules} href="/admin/member-portal/schedules/new" create={t.admin.newItem} />
      <TableCard>
        {data.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/admin/member-portal/schedules/${item.id}`}
            className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]"
          >
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>
                {item.program_title} · W{item.week_number} {item.day_label}
              </p>
              <p className="mt-1 text-sm text-neutral-400">{item.is_rest ? "Rest" : item.workout_title || "—"}</p>
            </div>
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminScheduleForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const programs = useResource(useCallback(() => getAdminPrograms(), []));
  const workouts = useResource(useCallback(() => getAdminWorkouts(), []));
  const loader = useCallback(() => (id ? getAdminSchedule(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  if ((id && status === "loading" && !data) || programs.status === "loading" || workouts.status === "loading") {
    return <Skeleton className="h-48 w-full rounded-[24px]" />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const workoutValue = String(raw.get("workout") || "");
    const payload = {
      program: Number(raw.get("program")),
      workout: workoutValue ? Number(workoutValue) : null,
      week_number: Number(raw.get("week_number") || 1) || 1,
      day_index: Number(raw.get("day_index") || 0),
      day_label: String(raw.get("day_label") || "Mon"),
      is_rest: raw.get("is_rest") === "on",
    };
    form.setPending(true);
    form.setError("");
    form.setNotice("");
    try {
      if (id) await updateAdminSchedule(id, payload);
      else {
        const created = await createAdminSchedule(payload);
        form.setNotice(t.admin.saved);
        router.replace(`/admin/member-portal/schedules/${created.id}`);
        return;
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  return (
    <div>
      <BackLink href="/admin/member-portal/schedules" />
      <FormShell
        title={data ? `${data.program_title} W${data.week_number}` : t.admin.newItem}
        onSubmit={onSubmit}
        pending={form.pending}
        error={form.error}
        notice={form.notice}
        onDelete={
          id
            ? async () => {
                if (!window.confirm(t.admin.remove)) return;
                await deleteAdminSchedule(id);
                router.push("/admin/member-portal/schedules");
              }
            : undefined
        }
      >
        <FormGrid>
          <label className="grid gap-1.5">
            <span className="text-[12px] font-medium text-neutral-500">{t.admin.programs}</span>
            <select
              name="program"
              defaultValue={data?.program || programs.data?.[0]?.id || ""}
              className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] outline-none"
              required
            >
              {(programs.data || []).map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-[12px] font-medium text-neutral-500">{t.admin.portalWorkouts}</span>
            <select
              name="workout"
              defaultValue={data?.workout || ""}
              className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] outline-none"
            >
              <option value="">—</option>
              {(workouts.data || []).map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.title}
                </option>
              ))}
            </select>
          </label>
          <AdminField name="week_number" label={t.admin.weekField} type="number" defaultValue={String(data?.week_number || 1)} />
          <AdminField name="day_index" label={t.admin.dayIndexField} type="number" defaultValue={String(data?.day_index ?? 0)} />
          <AdminField name="day_label" label={t.admin.dayLabelField} defaultValue={data?.day_label || "Mon"} />
        </FormGrid>
        <div className="mt-5">
          <AdminSwitch name="is_rest" label={t.admin.restDay} defaultChecked={data?.is_rest} />
        </div>
      </FormShell>
    </div>
  );
}

export function AdminNutritionList() {
  const { t, arabic } = useLang();
  const { status, data } = useResource(useCallback(() => getAdminNutritionPlans(), []));
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <BackLink href="/admin/member-portal" />
      <ListHeader title={t.admin.portalNutrition} href="/admin/member-portal/nutrition/new" create={t.admin.newItem} />
      <TableCard>
        {data.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/admin/member-portal/nutrition/${item.id}`}
            className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]"
          >
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.title}</p>
              <p className="mt-1 text-sm text-neutral-400">{item.program_title}</p>
            </div>
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminNutritionForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const programs = useResource(useCallback(() => getAdminPrograms(), []));
  const loader = useCallback(() => (id ? getAdminNutritionPlan(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  const defaultDays = useMemo(
    () =>
      (data?.days || [])
        .map((day) => {
          const meals = (day.meals || []).map((meal) => `${meal.name}::${meal.suggestion}`).join(" || ");
          return `${day.name} => ${meals}`;
        })
        .join("\n"),
    [data],
  );
  const defaultNotes = useMemo(() => (data?.notes || []).map((note) => note.body).join("\n"), [data]);
  if ((id && status === "loading" && !data) || programs.status === "loading") {
    return <Skeleton className="h-48 w-full rounded-[24px]" />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const title = String(raw.get("title") || "").trim();
    if (!title) {
      form.setError(arabic ? "العنوان مطلوب." : "Title is required.");
      return;
    }
    const day_rows = String(raw.get("day_rows") || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [namePart, mealsPart = ""] = line.split("=>").map((part) => part.trim());
        const meals = mealsPart
          .split("||")
          .map((chunk) => chunk.trim())
          .filter(Boolean)
          .map((chunk, mealIndex) => {
            const [name, suggestion = ""] = chunk.split("::").map((part) => part.trim());
            return { name: name || `Meal ${mealIndex + 1}`, suggestion, order: mealIndex };
          });
        return { name: namePart || `Day ${index + 1}`, order: index, meals };
      });
    const note_rows = String(raw.get("note_rows") || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const payload = {
      program: Number(raw.get("program")),
      title,
      overview: String(raw.get("overview") || title),
      calories: Number(raw.get("calories") || 0) || null,
      protein_g: Number(raw.get("protein_g") || 0) || null,
      carbs_g: Number(raw.get("carbs_g") || 0) || null,
      fats_g: Number(raw.get("fats_g") || 0) || null,
      coach_notes: String(raw.get("coach_notes") || ""),
      download_label: String(raw.get("download_label") || ""),
      download_url: String(raw.get("download_url") || ""),
      day_rows,
      note_rows,
    };
    form.setPending(true);
    form.setError("");
    form.setNotice("");
    try {
      if (id) await updateAdminNutritionPlan(id, payload);
      else {
        const created = await createAdminNutritionPlan(payload);
        form.setNotice(t.admin.saved);
        router.replace(`/admin/member-portal/nutrition/${created.id}`);
        return;
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  return (
    <div>
      <BackLink href="/admin/member-portal/nutrition" />
      <FormShell
        title={data?.title || t.admin.newItem}
        onSubmit={onSubmit}
        pending={form.pending}
        error={form.error}
        notice={form.notice}
        onDelete={
          id
            ? async () => {
                if (!window.confirm(t.admin.remove)) return;
                await deleteAdminNutritionPlan(id);
                router.push("/admin/member-portal/nutrition");
              }
            : undefined
        }
      >
        <FormGrid>
          <AdminField name="title" label={t.admin.titleField} defaultValue={data?.title} required />
          <label className="grid gap-1.5">
            <span className="text-[12px] font-medium text-neutral-500">{t.admin.programs}</span>
            <select
              name="program"
              defaultValue={data?.program || programs.data?.[0]?.id || ""}
              className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] outline-none"
              required
            >
              {(programs.data || []).map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </label>
          <AdminField name="calories" label="Calories" type="number" defaultValue={String(data?.calories || "")} />
          <AdminField name="protein_g" label="Protein g" type="number" defaultValue={String(data?.protein_g || "")} />
          <AdminField name="carbs_g" label="Carbs g" type="number" defaultValue={String(data?.carbs_g || "")} />
          <AdminField name="fats_g" label="Fats g" type="number" defaultValue={String(data?.fats_g || "")} />
        </FormGrid>
        <div className="mt-4 grid gap-4">
          <AdminArea name="overview" label={t.admin.lead} defaultValue={data?.overview} />
          <AdminArea name="coach_notes" label={t.admin.coachNotes} defaultValue={data?.coach_notes} />
          <AdminArea
            name="day_rows"
            label={t.admin.nutritionDays}
            defaultValue={defaultDays}
            placeholder={"Day 1 => Breakfast::Eggs || Lunch::Chicken"}
          />
          <AdminArea name="note_rows" label={t.admin.nutritionNotes} defaultValue={defaultNotes} />
        </div>
      </FormShell>
    </div>
  );
}

export function AdminAccessList() {
  const { t, arabic } = useLang();
  const { status, data } = useResource(useCallback(() => getAdminSubscriptions(), []));
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <BackLink href="/admin/member-portal" />
      <ListHeader title={t.admin.portalAccess} href="/admin/member-portal/access/new" create={t.admin.newItem} />
      <TableCard>
        {data.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/admin/member-portal/access/${item.id}`}
            className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]"
          >
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.user_name || item.user_email}</p>
              <p className="mt-1 text-sm text-neutral-400">
                {item.program_title} · {item.start_date} → {item.end_date}
              </p>
            </div>
            <StatusPill on={item.status === "active"} onLabel={item.status} offLabel={item.status} />
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminAccessForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const clients = useResource(useCallback(() => getAdminClients(), []));
  const programs = useResource(useCallback(() => getAdminPrograms(), []));
  const loader = useCallback(() => (id ? getAdminSubscription(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  if ((id && status === "loading" && !data) || clients.status === "loading" || programs.status === "loading") {
    return <Skeleton className="h-48 w-full rounded-[24px]" />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const payload = {
      user: Number(raw.get("user")),
      program: Number(raw.get("program")),
      status: String(raw.get("status") || "active") as "pending" | "active" | "cancelled" | "expired",
      start_date: String(raw.get("start_date") || ""),
      end_date: String(raw.get("end_date") || ""),
      coach_note: String(raw.get("coach_note") || ""),
    };
    if (!payload.user || !payload.program || !payload.start_date || !payload.end_date) {
      form.setError(arabic ? "أكمل الحقول المطلوبة." : "Fill the required fields.");
      return;
    }
    form.setPending(true);
    form.setError("");
    form.setNotice("");
    try {
      if (id) await updateAdminSubscription(id, payload);
      else {
        const created = await createAdminSubscription(payload);
        form.setNotice(t.admin.saved);
        router.replace(`/admin/member-portal/access/${created.id}`);
        return;
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  return (
    <div>
      <BackLink href="/admin/member-portal/access" />
      <FormShell
        title={data?.user_email || t.admin.newItem}
        onSubmit={onSubmit}
        pending={form.pending}
        error={form.error}
        notice={form.notice}
        onDelete={
          id
            ? async () => {
                if (!window.confirm(t.admin.remove)) return;
                await deleteAdminSubscription(id);
                router.push("/admin/member-portal/access");
              }
            : undefined
        }
      >
      <FormGrid>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-medium text-neutral-500">{t.admin.clients}</span>
          <select
            name="user"
            defaultValue={data?.user || clients.data?.[0]?.id || ""}
            className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] outline-none"
            required
          >
            {(clients.data || []).map((client) => (
              <option key={client.id} value={client.id}>
                {client.first_name || client.last_name
                  ? `${client.first_name} ${client.last_name}`.trim()
                  : client.email}{" "}
                ({client.email})
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-medium text-neutral-500">{t.admin.programs}</span>
          <select
            name="program"
            defaultValue={data?.program || programs.data?.[0]?.id || ""}
            className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] outline-none"
            required
          >
            {(programs.data || []).map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-medium text-neutral-500">Status</span>
          <select
            name="status"
            defaultValue={data?.status || "active"}
            className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] outline-none"
          >
            {["pending", "active", "cancelled", "expired"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <AdminField name="start_date" label={t.admin.startDate} type="date" defaultValue={data?.start_date || ""} required />
        <AdminField name="end_date" label={t.admin.endDate} type="date" defaultValue={data?.end_date || ""} required />
      </FormGrid>
      <div className="mt-4">
        <AdminArea name="coach_note" label={t.admin.coachNotes} defaultValue={data?.coach_note} />
      </div>
      </FormShell>
    </div>
  );
}
