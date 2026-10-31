"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useMemo, useState } from "react";

import { AdminArea, AdminField, AdminSwitch } from "@/components/admin/fields";
import { DashTitle } from "@/components/dashboard/ui";
import { Button, Skeleton } from "@/components/ui/primitives";
import { errorMessage } from "@/lib/api";
import {
  createAdminPackage,
  createAdminProgram,
  createAdminTestimonial,
  createAdminTransformation,
  deleteAdminPackage,
  deleteAdminProgram,
  deleteAdminTestimonial,
  deleteAdminTransformation,
  getAdminClients,
  getAdminInquiries,
  getAdminOverview,
  getAdminPackage,
  getAdminPackages,
  getAdminProgram,
  getAdminPrograms,
  getAdminTestimonial,
  getAdminTestimonials,
  getAdminTransformation,
  getAdminTransformations,
  updateAdminInquiry,
  updateAdminPackage,
  updateAdminProgram,
  updateAdminTestimonial,
  updateAdminTransformation,
} from "@/lib/api/admin";
import { useResource } from "@/lib/hooks/use-resource";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 grid gap-4 md:grid-cols-2">{children}</div>;
}

function useFormState() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  return { pending, setPending, error, setError, notice, setNotice };
}

export function AdminOverviewView() {
  const { t, arabic } = useLang();
  const overview = useResource(useCallback(() => getAdminOverview(), []));
  const inquiries = useResource(useCallback(() => getAdminInquiries(), []));
  if (overview.status === "loading") return <Skeleton className="h-64 w-full rounded-[24px]" />;
  if (!overview.data) return <p className="text-neutral-500">{t.admin.loadError}</p>;
  const data = overview.data;
  const cards = [
    { label: t.admin.programs, value: data.programs, href: "/admin/programs", tone: "bg-[#2443b2] text-white" },
    { label: t.admin.orders, value: data.orders, href: "/admin/clients", tone: "bg-white text-neutral-950" },
    { label: t.admin.clients, value: data.clients, href: "/admin/clients", tone: "bg-white text-neutral-950" },
    { label: t.admin.newInquiries, value: data.inquiries_new, href: "/admin/inquiries", tone: "bg-white text-neutral-950" },
  ] as const;
  const recent = (inquiries.data ?? []).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`text-sm text-neutral-400 ${arabic ? "font-arabic" : ""}`}>{t.admin.welcomeBack}</p>
          <h2 className={`mt-1 text-[28px] font-semibold ${arabic ? "font-arabic" : "font-display tracking-tight"}`}>{t.admin.overview}</h2>
        </div>
        <Button href="/admin/website" arrow={false} className={arabic ? "font-arabic normal-case tracking-normal" : "normal-case tracking-normal"}>
          {t.admin.manageSite}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className={cn("rounded-[24px] p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]", card.tone)}>
            <p className={`text-sm ${card.tone.includes("text-white") ? "text-white/70" : "text-neutral-400"}`}>{card.label}</p>
            <p className={`mt-4 text-4xl font-semibold ${arabic ? "font-arabic" : "font-display tracking-tight"}`}>{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)]">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${arabic ? "font-arabic" : "font-display"}`}>{t.admin.latestInquiries}</h3>
            <Link href="/admin/inquiries" className="text-sm text-primary">
              {t.admin.edit}
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[#eef2f8]">
            {recent.length === 0 ? <li className="py-6 text-sm text-neutral-400">{t.admin.empty}</li> : null}
            {recent.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-400">{item.email}</p>
                </div>
                <span className="rounded-full bg-[#eef2f8] px-2.5 py-1 text-[11px] text-neutral-500">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)]">
          <h3 className={`text-lg font-semibold ${arabic ? "font-arabic" : "font-display"}`}>{t.admin.website}</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-400">{t.admin.packages}</dt>
              <dd className="font-medium">{data.packages}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">{t.admin.transformations}</dt>
              <dd className="font-medium">{data.transformations}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">{t.admin.testimonials}</dt>
              <dd className="font-medium">{data.testimonials}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">{t.admin.inquiries}</dt>
              <dd className="font-medium">{data.inquiries}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
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
  return (
    <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)]">
      {children}
    </div>
  );
}

function StatusPill({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px]", on ? "bg-emerald-50 text-emerald-700" : "bg-[#eef2f8] text-neutral-500")}>
      {on ? onLabel : offLabel}
    </span>
  );
}

export function AdminProgramList() {
  const { t, arabic } = useLang();
  const loader = useCallback(() => getAdminPrograms(), []);
  const { status, data } = useResource(loader);
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <ListHeader title={t.admin.programs} href="/admin/programs/new" create={t.admin.newItem} />
      <TableCard>
        {data.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
        {data.map((item) => (
          <Link key={item.id} href={`/admin/programs/${item.id}`} className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]">
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.title}</p>
              <p className="mt-1 text-sm text-neutral-400">
                {item.price} {item.currency} · {item.duration_weeks} {t.weeks}
              </p>
            </div>
            <StatusPill on={item.is_active} onLabel={t.admin.active} offLabel={t.admin.hidden} />
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminProgramForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const loader = useCallback(() => (id ? getAdminProgram(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  if (id && status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const title = String(raw.get("title") || "");
    const payload = {
      title,
      slug: String(raw.get("slug") || slugify(title)),
      short_description: String(raw.get("short_description") || ""),
      description: String(raw.get("description") || ""),
      price: String(raw.get("price") || "0"),
      currency: String(raw.get("currency") || "USD"),
      duration_weeks: Number(raw.get("duration_weeks") || 12),
      difficulty: String(raw.get("difficulty") || "all"),
      category: String(raw.get("category") || "online-coaching"),
      goal: String(raw.get("goal") || "General"),
      featured_image: String(raw.get("featured_image") || ""),
      image_alt: String(raw.get("image_alt") || ""),
      expected_outcome: String(raw.get("expected_outcome") || ""),
      who_for: String(raw.get("who_for") || ""),
      training_structure: String(raw.get("training_structure") || ""),
      nutrition_overview: String(raw.get("nutrition_overview") || ""),
      support_overview: String(raw.get("support_overview") || ""),
      is_active: raw.get("is_active") === "on",
      is_featured: raw.get("is_featured") === "on",
      includes_training: raw.get("includes_training") === "on",
      includes_nutrition: raw.get("includes_nutrition") === "on",
    };
    form.setPending(true);
    form.setError("");
    try {
      if (id) await updateAdminProgram(id, payload);
      else {
        const created = await createAdminProgram(payload);
        router.replace(`/admin/programs/${created.id}`);
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  async function onDelete() {
    if (!id || !window.confirm(t.admin.remove)) return;
    await deleteAdminProgram(id);
    router.push("/admin/programs");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <DashTitle arabic={arabic}>{data?.title || t.admin.newItem}</DashTitle>
      <FormGrid>
        <AdminField name="title" label="Title" defaultValue={data?.title} required />
        <AdminField name="slug" label="Slug" defaultValue={data?.slug} />
        <AdminField name="price" label="Price" defaultValue={data?.price || "0"} />
        <AdminField name="currency" label="Currency" defaultValue={data?.currency || "USD"} />
        <AdminField name="duration_weeks" label="Weeks" type="number" defaultValue={String(data?.duration_weeks || 12)} />
        <AdminField name="category" label="Category" defaultValue={data?.category || "online-coaching"} />
        <AdminField name="difficulty" label="Difficulty" defaultValue={data?.difficulty || "all"} />
        <AdminField name="goal" label="Goal" defaultValue={data?.goal} />
        <AdminField name="featured_image" label="Image path" defaultValue={data?.featured_image} />
        <AdminField name="image_alt" label="Image alt" defaultValue={data?.image_alt} />
      </FormGrid>
      <div className="mt-4 grid gap-4">
        <AdminField name="short_description" label="Short description" defaultValue={data?.short_description} />
        <AdminArea name="description" label="Description" defaultValue={data?.description} />
        <AdminField name="expected_outcome" label="Expected outcome" defaultValue={data?.expected_outcome} />
        <AdminField name="who_for" label="Who it’s for" defaultValue={data?.who_for} />
        <AdminField name="training_structure" label="Training structure" defaultValue={data?.training_structure} />
        <AdminField name="support_overview" label="Support" defaultValue={data?.support_overview} />
      </div>
      <div className="mt-5 flex flex-wrap gap-5">
        <AdminSwitch name="is_active" label={t.admin.active} defaultChecked={data?.is_active ?? true} />
        <AdminSwitch name="is_featured" label={t.admin.featured} defaultChecked={data?.is_featured} />
        <AdminSwitch name="includes_training" label="Training" defaultChecked={data?.includes_training ?? true} />
        <AdminSwitch name="includes_nutrition" label="Nutrition" defaultChecked={data?.includes_nutrition} />
      </div>
      {form.error ? <p className="mt-4 text-sm text-primary">{form.error}</p> : null}
      {form.notice ? <p className="mt-4 text-sm text-neutral-500">{form.notice}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={form.pending} arrow={false}>
          {form.pending ? t.admin.saving : t.admin.save}
        </Button>
        {id ? (
          <button type="button" onClick={onDelete} className="rounded-full px-5 text-sm text-neutral-500 hover:text-black">
            {t.admin.remove}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function AdminPackageList() {
  const { t, arabic } = useLang();
  const loader = useCallback(() => getAdminPackages(), []);
  const { status, data } = useResource(loader);
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <ListHeader title={t.admin.packages} href="/admin/packages/new" create={t.admin.newItem} />
      <TableCard>
        {data.map((item) => (
          <Link key={item.id} href={`/admin/packages/${item.id}`} className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]">
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.name}</p>
              <p className="mt-1 text-sm text-neutral-400">
                {item.price} {item.currency}
              </p>
            </div>
            <StatusPill on={item.is_active} onLabel={t.admin.active} offLabel={t.admin.hidden} />
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminPackageForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const loader = useCallback(() => (id ? getAdminPackage(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  if (id && status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const name = String(raw.get("name") || "");
    const payload = {
      name,
      slug: String(raw.get("slug") || slugify(name)),
      tagline: String(raw.get("tagline") || ""),
      description: String(raw.get("description") || ""),
      duration_weeks: Number(raw.get("duration_weeks") || 12),
      price: String(raw.get("price") || "0"),
      currency: String(raw.get("currency") || "USD"),
      expected_outcome: String(raw.get("expected_outcome") || ""),
      support_label: String(raw.get("support_label") || ""),
      is_active: raw.get("is_active") === "on",
      is_highlighted: raw.get("is_highlighted") === "on",
      training_plan: raw.get("training_plan") === "on",
      nutrition: raw.get("nutrition") === "on",
      weekly_checkins: raw.get("weekly_checkins") === "on",
      video_library: raw.get("video_library") === "on",
      coach_support: raw.get("coach_support") === "on",
      progress_tracking: raw.get("progress_tracking") === "on",
      program_adjustments: raw.get("program_adjustments") === "on",
      messaging: raw.get("messaging") === "on",
    };
    form.setPending(true);
    form.setError("");
    try {
      if (id) await updateAdminPackage(id, payload);
      else {
        const created = await createAdminPackage(payload);
        router.replace(`/admin/packages/${created.id}`);
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  async function onDelete() {
    if (!id || !window.confirm(t.admin.remove)) return;
    await deleteAdminPackage(id);
    router.push("/admin/packages");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <DashTitle arabic={arabic}>{data?.name || t.admin.newItem}</DashTitle>
      <FormGrid>
        <AdminField name="name" label="Name" defaultValue={data?.name} required />
        <AdminField name="slug" label="Slug" defaultValue={data?.slug} />
        <AdminField name="price" label="Price" defaultValue={data?.price || "0"} />
        <AdminField name="currency" label="Currency" defaultValue={data?.currency || "USD"} />
        <AdminField name="duration_weeks" label="Weeks" type="number" defaultValue={String(data?.duration_weeks || 12)} />
        <AdminField name="support_label" label="Support label" defaultValue={data?.support_label} />
        <AdminField name="tagline" label="Tagline" defaultValue={data?.tagline} />
        <AdminField name="expected_outcome" label="Outcome" defaultValue={data?.expected_outcome} />
      </FormGrid>
      <div className="mt-4">
        <AdminField name="description" label="Description" defaultValue={data?.description} />
      </div>
      <div className="mt-5 flex flex-wrap gap-5">
        <AdminSwitch name="is_active" label={t.admin.active} defaultChecked={data?.is_active ?? true} />
        <AdminSwitch name="is_highlighted" label={t.admin.featured} defaultChecked={data?.is_highlighted} />
        <AdminSwitch name="training_plan" label="Training" defaultChecked={data?.training_plan ?? true} />
        <AdminSwitch name="nutrition" label="Nutrition" defaultChecked={data?.nutrition} />
        <AdminSwitch name="weekly_checkins" label="Check-ins" defaultChecked={data?.weekly_checkins} />
        <AdminSwitch name="video_library" label="Library" defaultChecked={data?.video_library ?? true} />
        <AdminSwitch name="coach_support" label="Coach" defaultChecked={data?.coach_support} />
        <AdminSwitch name="messaging" label="Messages" defaultChecked={data?.messaging} />
      </div>
      {form.error ? <p className="mt-4 text-sm text-primary">{form.error}</p> : null}
      {form.notice ? <p className="mt-4 text-sm text-neutral-500">{form.notice}</p> : null}
      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={form.pending} arrow={false}>
          {form.pending ? t.admin.saving : t.admin.save}
        </Button>
        {id ? (
          <button type="button" onClick={onDelete} className="text-sm text-neutral-500">
            {t.admin.remove}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function AdminTransformationList() {
  const { t, arabic } = useLang();
  const loader = useCallback(() => getAdminTransformations(), []);
  const { status, data } = useResource(loader);
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <ListHeader title={t.admin.transformations} href="/admin/transformations/new" create={t.admin.newItem} />
      <TableCard>
        {data.map((item) => (
          <Link key={item.id} href={`/admin/transformations/${item.id}`} className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]">
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.client_name}</p>
              <p className="mt-1 text-sm text-neutral-400">{item.result_summary}</p>
            </div>
            <StatusPill on={item.is_featured} onLabel={t.admin.featured} offLabel={t.admin.hidden} />
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminTransformationForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const loader = useCallback(() => (id ? getAdminTransformation(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  if (id && status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const client_name = String(raw.get("client_name") || "");
    const payload = {
      client_name,
      slug: String(raw.get("slug") || slugify(client_name)),
      before_image: String(raw.get("before_image") || ""),
      after_image: String(raw.get("after_image") || ""),
      cover_image: String(raw.get("cover_image") || raw.get("after_image") || ""),
      image_alt: String(raw.get("image_alt") || ""),
      duration_weeks: Number(raw.get("duration_weeks") || 12),
      result_summary: String(raw.get("result_summary") || ""),
      program_name: String(raw.get("program_name") || ""),
      story: String(raw.get("story") || ""),
      is_featured: raw.get("is_featured") === "on",
      order: Number(raw.get("order") || 0),
    };
    form.setPending(true);
    form.setError("");
    try {
      if (id) await updateAdminTransformation(id, payload);
      else {
        const created = await createAdminTransformation(payload);
        router.replace(`/admin/transformations/${created.id}`);
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  async function onDelete() {
    if (!id || !window.confirm(t.admin.remove)) return;
    await deleteAdminTransformation(id);
    router.push("/admin/transformations");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <DashTitle arabic={arabic}>{data?.client_name || t.admin.newItem}</DashTitle>
      <FormGrid>
        <AdminField name="client_name" label="Name" defaultValue={data?.client_name} required />
        <AdminField name="slug" label="Slug" defaultValue={data?.slug} />
        <AdminField name="program_name" label="Program name" defaultValue={data?.program_name} />
        <AdminField name="duration_weeks" label="Weeks" type="number" defaultValue={String(data?.duration_weeks || 12)} />
        <AdminField name="before_image" label="Before image" defaultValue={data?.before_image} />
        <AdminField name="after_image" label="After image" defaultValue={data?.after_image} />
        <AdminField name="cover_image" label="Cover image" defaultValue={data?.cover_image} />
        <AdminField name="order" label="Order" type="number" defaultValue={String(data?.order || 0)} />
      </FormGrid>
      <div className="mt-4 grid gap-4">
        <AdminField name="result_summary" label="Summary" defaultValue={data?.result_summary} />
        <AdminField name="image_alt" label="Image alt" defaultValue={data?.image_alt} />
        <AdminArea name="story" label="Story" defaultValue={data?.story} />
        <AdminSwitch name="is_featured" label={t.admin.featured} defaultChecked={data?.is_featured ?? true} />
      </div>
      {form.error ? <p className="mt-4 text-sm text-primary">{form.error}</p> : null}
      {form.notice ? <p className="mt-4 text-sm text-neutral-500">{form.notice}</p> : null}
      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={form.pending} arrow={false}>
          {form.pending ? t.admin.saving : t.admin.save}
        </Button>
        {id ? (
          <button type="button" onClick={onDelete} className="text-sm text-neutral-500">
            {t.admin.remove}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function AdminTestimonialList() {
  const { t, arabic } = useLang();
  const loader = useCallback(() => getAdminTestimonials(), []);
  const { status, data } = useResource(loader);
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <ListHeader title={t.admin.testimonials} href="/admin/testimonials/new" create={t.admin.newItem} />
      <TableCard>
        {data.map((item) => (
          <Link key={item.id} href={`/admin/testimonials/${item.id}`} className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]">
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.client_name}</p>
              <p className="mt-1 line-clamp-1 text-sm text-neutral-400">{item.quote}</p>
            </div>
            <StatusPill on={item.is_featured} onLabel={t.admin.featured} offLabel={t.admin.hidden} />
          </Link>
        ))}
      </TableCard>
    </div>
  );
}

export function AdminTestimonialForm({ id }: { id?: number }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const loader = useCallback(() => (id ? getAdminTestimonial(id) : Promise.resolve(null)), [id]);
  const { status, data } = useResource(loader);
  const form = useFormState();
  if (id && status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const payload = {
      client_name: String(raw.get("client_name") || ""),
      photo: String(raw.get("photo") || ""),
      quote: String(raw.get("quote") || ""),
      program_name: String(raw.get("program_name") || ""),
      rating: Number(raw.get("rating") || 5),
      is_featured: raw.get("is_featured") === "on",
      order: Number(raw.get("order") || 0),
    };
    form.setPending(true);
    form.setError("");
    try {
      if (id) await updateAdminTestimonial(id, payload);
      else {
        const created = await createAdminTestimonial(payload);
        router.replace(`/admin/testimonials/${created.id}`);
      }
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  async function onDelete() {
    if (!id || !window.confirm(t.admin.remove)) return;
    await deleteAdminTestimonial(id);
    router.push("/admin/testimonials");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <DashTitle arabic={arabic}>{data?.client_name || t.admin.newItem}</DashTitle>
      <FormGrid>
        <AdminField name="client_name" label="Name" defaultValue={data?.client_name} required />
        <AdminField name="program_name" label="Program" defaultValue={data?.program_name} />
        <AdminField name="photo" label="Photo" defaultValue={data?.photo} />
        <AdminField name="rating" label="Rating" type="number" defaultValue={String(data?.rating || 5)} />
        <AdminField name="order" label="Order" type="number" defaultValue={String(data?.order || 0)} />
      </FormGrid>
      <div className="mt-4">
        <AdminArea name="quote" label="Quote" defaultValue={data?.quote} />
        <div className="mt-4">
          <AdminSwitch name="is_featured" label={t.admin.featured} defaultChecked={data?.is_featured ?? true} />
        </div>
      </div>
      {form.error ? <p className="mt-4 text-sm text-primary">{form.error}</p> : null}
      {form.notice ? <p className="mt-4 text-sm text-neutral-500">{form.notice}</p> : null}
      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={form.pending} arrow={false}>
          {form.pending ? t.admin.saving : t.admin.save}
        </Button>
        {id ? (
          <button type="button" onClick={onDelete} className="text-sm text-neutral-500">
            {t.admin.remove}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function AdminInquiryList() {
  const { t, arabic } = useLang();
  const loader = useCallback(() => getAdminInquiries(), []);
  const { status, data } = useResource(loader);
  const [rows, setRows] = useState<typeof data>(null);
  const items = rows ?? data;
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!items) return <p>{t.admin.loadError}</p>;

  async function setStatus(id: number, next: "new" | "read" | "closed") {
    const updated = await updateAdminInquiry(id, { status: next });
    setRows((current) => (current ?? items ?? []).map((row) => (row.id === id ? updated : row)));
  }

  return (
    <div>
      <h2 className={`mb-4 text-xl font-semibold ${arabic ? "font-arabic" : "font-display tracking-tight"}`}>{t.admin.inquiries}</h2>
      <TableCard>
      {items.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
      {items.map((item) => (
        <div key={item.id} className="border-b border-[#eef2f8] px-5 py-4 last:border-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>{item.name}</p>
              <p className="mt-1 text-sm text-neutral-400">
                {item.email} · {item.phone}
              </p>
            </div>
            <select
              value={item.status}
              onChange={(event) => setStatus(item.id, event.target.value as "new" | "read" | "closed")}
              className="rounded-full border border-[#e8edf5] bg-[#f7f9fc] px-3 py-1.5 text-sm"
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            {item.program} · {item.goal}
          </p>
          <p className="mt-2 text-sm leading-7 text-neutral-700">{item.message}</p>
        </div>
      ))}
      </TableCard>
    </div>
  );
}

export function AdminClientList() {
  const { t, arabic } = useLang();
  const loader = useCallback(() => getAdminClients(), []);
  const { status, data } = useResource(loader);
  const clients = useMemo(() => data?.filter((item) => !item.is_staff) ?? null, [data]);
  if (status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!clients) return <p>{t.admin.loadError}</p>;
  return (
    <div>
      <h2 className={`mb-4 text-xl font-semibold ${arabic ? "font-arabic" : "font-display tracking-tight"}`}>{t.admin.clients}</h2>
      <TableCard>
      {clients.length === 0 ? <p className="p-6 text-neutral-500">{t.admin.empty}</p> : null}
      {clients.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0">
          <div>
            <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>
              {item.first_name} {item.last_name}
            </p>
            <p className="mt-1 text-sm text-neutral-400">{item.email}</p>
          </div>
          <p className="text-sm text-neutral-500">
            {item.phone} {item.goal ? `· ${item.goal}` : ""}
          </p>
        </div>
      ))}
      </TableCard>
    </div>
  );
}
