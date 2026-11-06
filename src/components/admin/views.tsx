"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useMemo, useState } from "react";

import { AdminArea, AdminField, AdminPair, AdminSwitch } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
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
  getAdminClient,
  getAdminClients,
  getAdminGyms,
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
  getAdminWorkouts,
  updateAdminClient,
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

function uniqueSlug(value: string, title: string) {
  const base = slugify(value || title) || `item-${Date.now().toString(36)}`;
  return value.trim() ? base : `${base}-${Date.now().toString(36).slice(-4)}`;
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
    { label: t.admin.programs, value: data.packages, href: "/admin/programs", tone: "bg-[#2443b2] text-white" },
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
  const { status, data, setData, reload } = useResource(loader);
  const form = useFormState();
  const [formKey, setFormKey] = useState(0);
  if (id && status === "loading" && !data) return <Skeleton className="h-48 w-full rounded-[24px]" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const title = String(raw.get("title") || "").trim();
    if (!title) {
      form.setError(arabic ? "العنوان مطلوب." : "Title is required.");
      return;
    }
    const weeks = String(raw.get("duration_weeks") || "").trim();
    const payload = {
      title,
      title_ar: String(raw.get("title_ar") || ""),
      slug: id ? String(raw.get("slug") || slugify(title)) || slugify(title) : uniqueSlug(String(raw.get("slug") || ""), title),
      short_description: String(raw.get("short_description") || title),
      short_description_ar: String(raw.get("short_description_ar") || ""),
      description: String(raw.get("description") || title),
      description_ar: String(raw.get("description_ar") || ""),
      price: String(raw.get("price") || "0"),
      currency: String(raw.get("currency") || "KWD"),
      duration_weeks: weeks ? Number(weeks) : null,
      difficulty: String(raw.get("difficulty") || "all"),
      category: String(raw.get("category") || "online-coaching"),
      goal: String(raw.get("goal") || title),
      goal_ar: String(raw.get("goal_ar") || ""),
      featured_image: String(raw.get("featured_image") || ""),
      image_alt: String(raw.get("image_alt") || ""),
      expected_outcome: String(raw.get("expected_outcome") || ""),
      expected_outcome_ar: String(raw.get("expected_outcome_ar") || ""),
      who_for: String(raw.get("who_for") || ""),
      who_for_ar: String(raw.get("who_for_ar") || ""),
      training_structure: String(raw.get("training_structure") || ""),
      training_structure_ar: String(raw.get("training_structure_ar") || ""),
      nutrition_overview: "",
      support_overview: String(raw.get("support_overview") || ""),
      support_overview_ar: String(raw.get("support_overview_ar") || ""),
      is_active: raw.get("is_active") === "on",
      is_featured: raw.get("is_featured") === "on",
      includes_training: raw.get("includes_training") === "on",
      includes_nutrition: false,
    };
    form.setPending(true);
    form.setError("");
    form.setNotice("");
    try {
      if (id) {
        const saved = await updateAdminProgram(id, payload);
        setData(saved);
        setFormKey((current) => current + 1);
        reload();
      } else {
        const created = await createAdminProgram(payload);
        form.setNotice(t.admin.saved);
        router.replace(`/admin/programs/${created.id}`);
        return;
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
    <form key={formKey} onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <DashTitle arabic={arabic}>{data?.title || t.admin.newItem}</DashTitle>
      <FormGrid>
        <AdminPair nameEn="title" nameAr="title_ar" label="Title" defaultEn={data?.title} defaultAr={data?.title_ar} />
        <AdminField name="slug" label="Slug" defaultValue={data?.slug} />
        <AdminField name="price" label="Price" defaultValue={data?.price || "0"} />
        <AdminField name="currency" label="Currency" defaultValue={data?.currency || "KWD"} />
        <AdminField name="duration_weeks" label="Weeks (optional)" type="number" defaultValue={data?.duration_weeks ? String(data.duration_weeks) : ""} />
        <AdminField name="category" label="Category" defaultValue={data?.category || "online-coaching"} />
        <AdminField name="difficulty" label="Difficulty" defaultValue={data?.difficulty || "all"} />
        <AdminPair nameEn="goal" nameAr="goal_ar" label="Goal" defaultEn={data?.goal} defaultAr={data?.goal_ar} />
        <AdminField name="image_alt" label="Image alt" defaultValue={data?.image_alt} />
      </FormGrid>
      <div className="mt-4">
        <ImageField name="featured_image" label={t.admin.imagePath} defaultValue={data?.featured_image} preset="program" />
      </div>
      <div className="mt-4 grid gap-4">
        <AdminPair nameEn="short_description" nameAr="short_description_ar" label="Short description" defaultEn={data?.short_description} defaultAr={data?.short_description_ar} area />
        <AdminPair nameEn="description" nameAr="description_ar" label="Description" defaultEn={data?.description} defaultAr={data?.description_ar} area />
        <AdminPair nameEn="expected_outcome" nameAr="expected_outcome_ar" label="Expected outcome" defaultEn={data?.expected_outcome} defaultAr={data?.expected_outcome_ar} area />
        <AdminPair nameEn="who_for" nameAr="who_for_ar" label="Who it’s for" defaultEn={data?.who_for} defaultAr={data?.who_for_ar} area />
        <AdminPair nameEn="training_structure" nameAr="training_structure_ar" label="Training structure" defaultEn={data?.training_structure} defaultAr={data?.training_structure_ar} area />
        <AdminPair nameEn="support_overview" nameAr="support_overview_ar" label="Support" defaultEn={data?.support_overview} defaultAr={data?.support_overview_ar} area />
      </div>
      <div className="mt-5 flex flex-wrap gap-5">
        <AdminSwitch name="is_active" label={t.admin.active} defaultChecked={data?.is_active ?? true} />
        <AdminSwitch name="is_featured" label={t.admin.featured} defaultChecked={data?.is_featured} />
        <AdminSwitch name="includes_training" label="Training" defaultChecked={data?.includes_training ?? true} />
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
      <ListHeader title={t.admin.programs} href="/admin/programs/new" create={t.admin.newItem} />
      <TableCard>
        {data.map((item) => (
          <Link key={item.id} href={`/admin/programs/${item.id}`} className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]">
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
  const gyms = useResource(useCallback(() => getAdminGyms(), []));
  const form = useFormState();
  if (id && status === "loading") return <Skeleton className="h-48 w-full rounded-[24px]" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const name = String(raw.get("name") || "");
    const weeks = String(raw.get("duration_weeks") || "").trim();
    const payload = {
      name,
      name_ar: String(raw.get("name_ar") || ""),
      slug: String(raw.get("slug") || slugify(name)),
      tagline: String(raw.get("tagline") || ""),
      tagline_ar: String(raw.get("tagline_ar") || ""),
      description: String(raw.get("description") || ""),
      description_ar: String(raw.get("description_ar") || ""),
      duration_weeks: weeks ? Number(weeks) : null,
      price: String(raw.get("price") || "0"),
      currency: String(raw.get("currency") || "KWD"),
      expected_outcome: String(raw.get("expected_outcome") || ""),
      expected_outcome_ar: String(raw.get("expected_outcome_ar") || ""),
      support_label: String(raw.get("support_label") || ""),
      support_label_ar: String(raw.get("support_label_ar") || ""),
      image: String(raw.get("image") || ""),
      image_alt: String(raw.get("image_alt") || ""),
      gym: raw.get("gym") ? Number(raw.get("gym")) : null,
      is_active: raw.get("is_active") === "on",
      is_highlighted: raw.get("is_highlighted") === "on",
      training_plan: raw.get("training_plan") === "on",
      nutrition: false,
      weekly_checkins: false,
      video_library: raw.get("video_library") === "on",
      coach_support: false,
      progress_tracking: false,
      program_adjustments: false,
      messaging: false,
    };
    form.setPending(true);
    form.setError("");
    try {
      if (id) await updateAdminPackage(id, payload);
      else {
        const created = await createAdminPackage(payload);
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
    await deleteAdminPackage(id);
    router.push("/admin/programs");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <DashTitle arabic={arabic}>{data?.name || t.admin.newItem}</DashTitle>
      <FormGrid>
        <AdminPair nameEn="name" nameAr="name_ar" label="Name" defaultEn={data?.name} defaultAr={data?.name_ar} />
        <AdminField name="slug" label="Slug" defaultValue={data?.slug} />
        <AdminField name="price" label="Price" defaultValue={data?.price || "0"} />
        <AdminField name="currency" label="Currency" defaultValue={data?.currency || "KWD"} />
        <AdminField name="duration_weeks" label="Weeks (optional)" type="number" defaultValue={data?.duration_weeks ? String(data.duration_weeks) : ""} />
        <label className="grid gap-1.5">
          <span className="text-[12px] font-medium text-neutral-500">{arabic ? "الصالة" : "Gym"}</span>
          <select name="gym" defaultValue={data?.gym || ""} className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] outline-none">
            <option value="">{arabic ? "بدون صالة محددة" : "No gym lock"}</option>
            {(gyms.data || []).map((gym) => (
              <option key={gym.id} value={gym.id}>
                {arabic ? gym.name_ar || gym.name : gym.name}
              </option>
            ))}
          </select>
        </label>
        <AdminPair nameEn="support_label" nameAr="support_label_ar" label="Support label" defaultEn={data?.support_label} defaultAr={data?.support_label_ar} />
        <AdminPair nameEn="tagline" nameAr="tagline_ar" label="Tagline" defaultEn={data?.tagline} defaultAr={data?.tagline_ar} />
        <AdminField name="image_alt" label="Image alt" defaultValue={data?.image_alt} />
      </FormGrid>
      <div className="mt-4">
        <ImageField name="image" label={arabic ? "صورة الباقة" : "Package image"} defaultValue={data?.image} preset="program" />
      </div>
      <div className="mt-4 grid gap-4">
        <AdminPair nameEn="description" nameAr="description_ar" label="Description" defaultEn={data?.description} defaultAr={data?.description_ar} area />
        <AdminPair nameEn="expected_outcome" nameAr="expected_outcome_ar" label="Outcome" defaultEn={data?.expected_outcome} defaultAr={data?.expected_outcome_ar} area />
      </div>
      <div className="mt-5 flex flex-wrap gap-5">
        <AdminSwitch name="is_active" label={t.admin.active} defaultChecked={data?.is_active ?? true} />
        <AdminSwitch name="is_highlighted" label={t.admin.featured} defaultChecked={data?.is_highlighted} />
        <AdminSwitch name="training_plan" label="Training plan" defaultChecked={data?.training_plan ?? true} />
        <AdminSwitch name="video_library" label="Video library" defaultChecked={data?.video_library ?? true} />
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
  const { status, data, setData, reload } = useResource(loader);
  const form = useFormState();
  const [formKey, setFormKey] = useState(0);
  if (id && status === "loading" && !data) return <Skeleton className="h-48 w-full rounded-[24px]" />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const client_name = String(raw.get("client_name") || "");
    const payload = {
      client_name,
      client_name_ar: String(raw.get("client_name_ar") || ""),
      slug: String(raw.get("slug") || slugify(client_name)),
      before_image: String(raw.get("before_image") || ""),
      after_image: String(raw.get("after_image") || ""),
      cover_image: String(raw.get("cover_image") || raw.get("after_image") || ""),
      image_alt: String(raw.get("image_alt") || ""),
      duration_weeks: String(raw.get("duration_weeks") || "").trim() ? Number(raw.get("duration_weeks")) : null,
      result_summary: String(raw.get("result_summary") || ""),
      result_summary_ar: String(raw.get("result_summary_ar") || ""),
      program_name: String(raw.get("program_name") || ""),
      program_name_ar: String(raw.get("program_name_ar") || ""),
      story: String(raw.get("story") || ""),
      story_ar: String(raw.get("story_ar") || ""),
      is_featured: raw.get("is_featured") === "on",
      order: Number(raw.get("order") || 0),
    };
    form.setPending(true);
    form.setError("");
    try {
      if (id) {
        const saved = await updateAdminTransformation(id, payload);
        setData(saved);
        setFormKey((current) => current + 1);
        reload();
      } else {
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
    <form key={formKey} onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <DashTitle arabic={arabic}>{data?.client_name || t.admin.newItem}</DashTitle>
      <FormGrid>
        <AdminPair nameEn="client_name" nameAr="client_name_ar" label="Name" defaultEn={data?.client_name} defaultAr={data?.client_name_ar} />
        <AdminField name="slug" label="Slug" defaultValue={data?.slug} />
        <AdminPair nameEn="program_name" nameAr="program_name_ar" label="Program name" defaultEn={data?.program_name} defaultAr={data?.program_name_ar} />
        <AdminField name="duration_weeks" label="Weeks (optional)" type="number" defaultValue={data?.duration_weeks ? String(data.duration_weeks) : ""} />
        <AdminField name="order" label="Order" type="number" defaultValue={String(data?.order || 0)} />
      </FormGrid>
      <div className="mt-4 grid gap-4">
        <ImageField name="before_image" label="Before image" defaultValue={data?.before_image} preset="transformation" />
        <ImageField name="after_image" label="After image" defaultValue={data?.after_image} preset="transformation" />
        <ImageField name="cover_image" label="Cover image" defaultValue={data?.cover_image} preset="transformation" />
        <AdminPair nameEn="result_summary" nameAr="result_summary_ar" label="Summary" defaultEn={data?.result_summary} defaultAr={data?.result_summary_ar} area />
        <AdminField name="image_alt" label="Image alt" defaultValue={data?.image_alt} />
        <AdminPair nameEn="story" nameAr="story_ar" label="Story" defaultEn={data?.story} defaultAr={data?.story_ar} area />
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
        <AdminField name="rating" label="Rating" type="number" defaultValue={String(data?.rating || 5)} />
        <AdminField name="order" label="Order" type="number" defaultValue={String(data?.order || 0)} />
      </FormGrid>
      <div className="mt-4">
        <ImageField name="photo" label="Photo" defaultValue={data?.photo} preset="testimonial" />
      </div>
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
        <Link key={item.id} href={`/admin/clients/${item.id}`} className="flex items-center justify-between gap-4 border-b border-[#eef2f8] px-5 py-4 last:border-0 hover:bg-[#f7f9fc]">
          <div>
            <p className={`font-semibold ${arabic ? "font-arabic" : ""}`}>
              {item.first_name} {item.last_name}
            </p>
            <p className="mt-1 text-sm text-neutral-400">
              {item.email}
              {item.package_name ? ` · ${item.package_name}` : ""}
              {item.gym_name ? ` · ${item.gym_name}` : ""}
            </p>
          </div>
          <p className="text-sm text-neutral-500">
            {item.assigned_plan?.workout_title || (arabic ? "بدون خطة" : "No plan")}
          </p>
        </Link>
      ))}
      </TableCard>
    </div>
  );
}

export function AdminClientForm({ id }: { id: number }) {
  const { t, arabic } = useLang();
  const loader = useCallback(() => getAdminClient(id), [id]);
  const { status, data, setData } = useResource(loader);
  const gyms = useResource(useCallback(() => getAdminGyms(), []));
  const workouts = useResource(useCallback(() => getAdminWorkouts(), []));
  const form = useFormState();
  if (status === "loading" && !data) return <Skeleton className="h-48 w-full rounded-[24px]" />;
  if (!data) return <p>{t.admin.loadError}</p>;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget);
    const assigned = String(raw.get("assigned_workout") || "");
    const payload = {
      first_name: String(raw.get("first_name") || ""),
      last_name: String(raw.get("last_name") || ""),
      goal: String(raw.get("goal") || ""),
      gym: raw.get("gym") ? Number(raw.get("gym")) : null,
      assigned_workout: assigned ? Number(assigned) : null,
      plan_notes: String(raw.get("plan_notes") || ""),
    };
    form.setPending(true);
    form.setError("");
    try {
      const saved = await updateAdminClient(id, payload);
      setData(saved);
      form.setNotice(t.admin.saved);
    } catch (err) {
      form.setError(errorMessage(err));
    } finally {
      form.setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)] md:p-8">
      <Link href="/admin/clients" className="text-sm text-neutral-500">
        {arabic ? "العودة للأعضاء" : "Back to members"}
      </Link>
      <DashTitle arabic={arabic}>
        {data.first_name} {data.last_name}
      </DashTitle>
      <p className="mt-1 text-sm text-neutral-400">{data.email}</p>
      <dl className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <dt className="text-xs text-neutral-400">{arabic ? "الباقة" : "Package"}</dt>
          <dd className="mt-1 font-medium">{data.package_name || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-400">{arabic ? "الخطة الحالية" : "Current plan"}</dt>
          <dd className="mt-1 font-medium">{data.assigned_plan?.workout_title || (arabic ? "غير معيّنة" : "Not assigned")}</dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-400">{arabic ? "الهاتف" : "Phone"}</dt>
          <dd className="mt-1 font-medium" dir="ltr">
            {data.phone || "—"}
          </dd>
        </div>
      </dl>
      <FormGrid>
        <AdminField name="first_name" label={t.admin.nameField} defaultValue={data.first_name} />
        <AdminField name="last_name" label="Last name" defaultValue={data.last_name} />
        <AdminField name="goal" label={arabic ? "الهدف" : "Fitness goal"} defaultValue={data.goal} />
        <label className="grid gap-1.5">
          <span className="text-[12px] font-medium text-neutral-500">{arabic ? "الصالة" : "Gym"}</span>
          <select name="gym" defaultValue={data.gym || ""} className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px]">
            <option value="">{arabic ? "بدون صالة" : "No gym"}</option>
            {(gyms.data || []).map((gym) => (
              <option key={gym.id} value={gym.id}>
                {gym.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 md:col-span-2">
          <span className="text-[12px] font-medium text-neutral-500">{arabic ? "تعيين خطة تمرين" : "Assign workout plan"}</span>
          <select
            name="assigned_workout"
            defaultValue={data.assigned_plan?.workout_id || ""}
            className="h-12 rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px]"
          >
            <option value="">{arabic ? "إزالة التعيين" : "Remove assignment"}</option>
            {(workouts.data || []).map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.title}
              </option>
            ))}
          </select>
        </label>
      </FormGrid>
      <div className="mt-4">
        <AdminArea name="plan_notes" label={arabic ? "ملاحظات الخطة" : "Plan notes"} defaultValue={data.assigned_plan?.notes} />
      </div>
      {form.error ? <p className="mt-4 text-sm text-primary">{form.error}</p> : null}
      {form.notice ? <p className="mt-4 text-sm text-neutral-500">{form.notice}</p> : null}
      <div className="mt-6">
        <Button type="submit" disabled={form.pending} arrow={false}>
          {form.pending ? t.admin.saving : t.admin.save}
        </Button>
      </div>
    </form>
  );
}
