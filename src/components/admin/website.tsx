"use client";

import { Link2 } from "lucide-react";
import { FormEvent, useCallback, useState } from "react";

import { AdminField, AdminGroup, AdminPair, AdminSaveBar, AdminSwitch } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { VideoField } from "@/components/admin/video-field";
import { Skeleton } from "@/components/ui/primitives";
import { errorMessage } from "@/lib/api";
import { getAdminSite, updateAdminSite } from "@/lib/api/admin";
import { useResource } from "@/lib/hooks/use-resource";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { SiteHome } from "@/lib/site-home";

type SectionId =
  | "hero"
  | "about"
  | "programs"
  | "process"
  | "transformations"
  | "testimonials"
  | "pricing"
  | "why"
  | "faq"
  | "cta"
  | "contact"
  | "footer"
  | "brand"
  | "legal";

function Panel({
  id,
  active,
  title,
  switchName,
  visible,
  children,
}: {
  id: SectionId;
  active: SectionId;
  title: string;
  switchName?: string;
  visible?: boolean;
  children: React.ReactNode;
}) {
  const { t, arabic } = useLang();
  return (
    <section hidden={active !== id} className="overflow-hidden rounded-[24px] border border-[#eef2f8] bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.28)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef2f8] px-5 py-4 md:px-6">
        <h3 className={`text-[20px] font-semibold ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>{title}</h3>
        {switchName ? <AdminSwitch name={switchName} label={t.admin.visible} defaultChecked={visible} /> : null}
      </div>
      <div className="space-y-5 px-5 py-5 md:px-6">{children}</div>
    </section>
  );
}

function RemoveLink({ onClick }: { onClick: () => void }) {
  const { t, arabic } = useLang();
  return (
    <button type="button" onClick={onClick} className={`shrink-0 pb-3 text-sm text-neutral-500 hover:text-black ${arabic ? "font-arabic" : ""}`}>
      {t.admin.remove}
    </button>
  );
}

function FooterEditor({ site }: { site: SiteHome["site"] }) {
  const { t, arabic } = useLang();
  const [email, setEmail] = useState(site.email || "");
  const [phone, setPhone] = useState(site.phoneDisplay || "");
  const [phoneHref, setPhoneHref] = useState(site.phoneHref || "");
  const [blurbKey, setBlurbKey] = useState(0);
  const [tagKey, setTagKey] = useState(0);
  const [socials, setSocials] = useState(() => {
    const items = (site.socials || []).filter((item) => item.label || item.href);
    return items.length ? items.map((item, index) => ({ id: `s${index}`, ...item })) : [{ id: "s0", label: "", href: "" }];
  });

  return (
    <>
      <p className={`text-sm text-neutral-500 ${arabic ? "font-arabic" : ""}`}>
        {arabic
          ? "احذف بريداً أو رقماً أو رابطاً ثم احفظ. العنصر المحذوف يختفي من تذييل الموقع."
          : "Remove an email, number, or social link, then save. Removed items leave the website footer."}
      </p>
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <AdminField name="site_email" label={t.admin.emailField} value={email} onChange={(event) => setEmail(event.target.value)} dir="ltr" />
        </div>
        {email ? <RemoveLink onClick={() => setEmail("")} /> : null}
      </div>
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <AdminField name="site_phone" label={t.admin.phoneField} value={phone} onChange={(event) => setPhone(event.target.value)} dir="ltr" />
        </div>
        {phone ? <RemoveLink onClick={() => setPhone("")} /> : null}
      </div>
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <AdminField name="site_phone_href" label={t.admin.phoneLink} value={phoneHref} onChange={(event) => setPhoneHref(event.target.value)} dir="ltr" />
        </div>
        {phoneHref ? <RemoveLink onClick={() => setPhoneHref("")} /> : null}
      </div>
      <div>
        <div className="mb-2 flex justify-end">
          <RemoveLink onClick={() => setBlurbKey((current) => current + 1)} />
        </div>
        <AdminPair
          key={`blurb-${blurbKey}`}
          nameEn="site_blurb_en"
          nameAr="site_blurb_ar"
          label={t.admin.footerBlurb}
          defaultEn={blurbKey ? "" : site.footerBlurb.en}
          defaultAr={blurbKey ? "" : site.footerBlurb.ar}
          area
        />
      </div>
      <div>
        <div className="mb-2 flex justify-end">
          <RemoveLink onClick={() => setTagKey((current) => current + 1)} />
        </div>
        <AdminPair
          key={`tag-${tagKey}`}
          nameEn="site_tag_en"
          nameAr="site_tag_ar"
          label={t.admin.footerTag}
          defaultEn={tagKey ? "" : site.footerTag.en}
          defaultAr={tagKey ? "" : site.footerTag.ar}
        />
      </div>
      {socials.map((item, index) => (
        <AdminGroup
          key={item.id}
          title={`${t.admin.socialLink} ${index + 1}`}
          action={
            <RemoveLink
              onClick={() =>
                setSocials((current) => {
                  const next = current.filter((entry) => entry.id !== item.id);
                  return next.length ? next : [{ id: "s0", label: "", href: "" }];
                })
              }
            />
          }
        >
          <AdminField name={`site_soc${index + 1}_label`} label={t.admin.labelField} defaultValue={item.label} />
          <AdminField name={`site_soc${index + 1}_href`} label={t.admin.linkField} defaultValue={item.href} dir="ltr" />
        </AdminGroup>
      ))}
      {socials.length < 12 ? (
        <button
          type="button"
          onClick={() => setSocials((current) => [...current, { id: `s${Date.now()}`, label: "", href: "" }])}
          className={`text-sm text-primary ${arabic ? "font-arabic" : ""}`}
        >
          {arabic ? "إضافة رابط اجتماعي" : "Add social link"}
        </button>
      ) : null}
    </>
  );
}

export function AdminWebsiteView() {
  const { t, arabic } = useLang();
  const loader = useCallback(() => getAdminSite(), []);
  const { status, data, setData, reload } = useResource(loader);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [active, setActive] = useState<SectionId>("hero");
  const [formKey, setFormKey] = useState(0);

  if (status === "loading" && !data) return <Skeleton className="h-64 w-full rounded-[24px]" />;
  if (!data) return <p className={arabic ? "font-arabic" : ""}>{t.admin.loadError}</p>;

  const hero = data.hero;
  const about = data.about;
  const s = data.sections;
  const pages = data.pages;
  const siteInfo = data.site;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: SiteHome = {
      hero: {
        visible: form.get("hero_visible") === "on",
        image: String(form.get("hero_image") || ""),
        video: String(form.get("hero_video") || ""),
        videoUrl: String(form.get("hero_video_url") || ""),
        poster: String(form.get("hero_poster") || ""),
        alt: { en: String(form.get("hero_alt_en") || ""), ar: String(form.get("hero_alt_ar") || "") },
        kicker: { en: String(form.get("hero_kicker_en") || ""), ar: String(form.get("hero_kicker_ar") || "") },
        title: {
          en: String(form.get("hero_title_en") || ""),
          ar: String(form.get("hero_title_ar") || ""),
        },
        lead: { en: String(form.get("hero_lead_en") || ""), ar: String(form.get("hero_lead_ar") || "") },
        primary: {
          label: { en: String(form.get("hero_p_en") || ""), ar: String(form.get("hero_p_ar") || "") },
          href: String(form.get("hero_p_href") || "/programs"),
        },
        secondary: {
          label: { en: String(form.get("hero_s_en") || ""), ar: String(form.get("hero_s_ar") || "") },
          href: String(form.get("hero_s_href") || "/contact"),
        },
      },
      about: {
        visible: form.get("about_visible") === "on",
        label: { en: String(form.get("about_label_en") || ""), ar: String(form.get("about_label_ar") || "") },
        title: { en: String(form.get("about_title_en") || ""), ar: String(form.get("about_title_ar") || "") },
        paragraphs: {
          en: [String(form.get("about_p1_en") || ""), String(form.get("about_p2_en") || "")],
          ar: [String(form.get("about_p1_ar") || ""), String(form.get("about_p2_ar") || "")],
        },
        action: { en: String(form.get("about_action_en") || ""), ar: String(form.get("about_action_ar") || "") },
        principles: {
          en: [1, 2, 3].map((index) => ({
            title: String(form.get(`about_pr${index}_t_en`) || ""),
            body: String(form.get(`about_pr${index}_b_en`) || ""),
          })),
          ar: [1, 2, 3].map((index) => ({
            title: String(form.get(`about_pr${index}_t_ar`) || ""),
            body: String(form.get(`about_pr${index}_b_ar`) || ""),
          })),
        },
      },
      sections: {
        programs: {
          visible: form.get("sec_programs") === "on",
          heading: { en: String(form.get("programs_h_en") || ""), ar: String(form.get("programs_h_ar") || "") },
          link: { en: String(form.get("programs_l_en") || ""), ar: String(form.get("programs_l_ar") || "") },
        },
        process: {
          visible: form.get("sec_process") === "on",
          heading: { en: String(form.get("process_h_en") || ""), ar: String(form.get("process_h_ar") || "") },
          cards: [1, 2, 3, 4, 5].map((index) => ({
            n: `0${index}`,
            title: { en: String(form.get(`process_c${index}_t_en`) || ""), ar: String(form.get(`process_c${index}_t_ar`) || "") },
            body: { en: String(form.get(`process_c${index}_b_en`) || ""), ar: String(form.get(`process_c${index}_b_ar`) || "") },
            points: {
              en: [1, 2, 3].map((point) => String(form.get(`process_c${index}_p${point}_en`) || "")).filter(Boolean),
              ar: [1, 2, 3].map((point) => String(form.get(`process_c${index}_p${point}_ar`) || "")).filter(Boolean),
            },
          })),
        },
        transformations: {
          visible: form.get("sec_transformations") === "on",
          heading: { en: String(form.get("work_h_en") || ""), ar: String(form.get("work_h_ar") || "") },
          link: { en: String(form.get("work_l_en") || ""), ar: String(form.get("work_l_ar") || "") },
        },
        testimonials: { visible: form.get("sec_testimonials") === "on" },
        pricing: {
          visible: false,
          heading: s.pricing.heading,
        },
        why: {
          visible: form.get("sec_why") === "on",
          heading: { en: String(form.get("why_h_en") || ""), ar: String(form.get("why_h_ar") || "") },
          items: (s.why.items ?? []).map((item, index) => ({
            n: item.n || `0${index + 1}`,
            title: { en: String(form.get(`why_c${index + 1}_t_en`) || ""), ar: String(form.get(`why_c${index + 1}_t_ar`) || "") },
            body: { en: String(form.get(`why_c${index + 1}_b_en`) || ""), ar: String(form.get(`why_c${index + 1}_b_ar`) || "") },
          })),
        },
        faq: {
          visible: form.get("sec_faq") === "on",
          heading: { en: String(form.get("faq_h_en") || ""), ar: String(form.get("faq_h_ar") || "") },
          items: (s.faq.items ?? []).map((_, index) => ({
            q: { en: String(form.get(`faq_i${index + 1}_q_en`) || ""), ar: String(form.get(`faq_i${index + 1}_q_ar`) || "") },
            a: { en: String(form.get(`faq_i${index + 1}_a_en`) || ""), ar: String(form.get(`faq_i${index + 1}_a_ar`) || "") },
          })),
        },
        cta: {
          visible: form.get("sec_cta") === "on",
          title: { en: String(form.get("cta_t_en") || ""), ar: String(form.get("cta_t_ar") || "") },
          lead: { en: String(form.get("cta_l_en") || ""), ar: String(form.get("cta_l_ar") || "") },
          label: { en: String(form.get("cta_b_en") || ""), ar: String(form.get("cta_b_ar") || "") },
          href: String(form.get("cta_href") || "/programs"),
        },
      },
      pages: {
        about: {
          kicker: { en: String(form.get("page_about_k_en") || ""), ar: String(form.get("page_about_k_ar") || "") },
          quote: { en: String(form.get("page_about_q_en") || ""), ar: String(form.get("page_about_q_ar") || "") },
          name: { en: String(form.get("page_about_n_en") || ""), ar: String(form.get("page_about_n_ar") || "") },
          lead: { en: String(form.get("page_about_l_en") || ""), ar: String(form.get("page_about_l_ar") || "") },
          action: { en: String(form.get("page_about_a_en") || ""), ar: String(form.get("page_about_a_ar") || "") },
          image: String(form.get("page_about_image") || ""),
          imageAlt: { en: String(form.get("page_about_alt_en") || ""), ar: String(form.get("page_about_alt_ar") || "") },
          storyKicker: { en: String(form.get("page_about_sk_en") || ""), ar: String(form.get("page_about_sk_ar") || "") },
          storyHeading: { en: String(form.get("page_about_sh_en") || ""), ar: String(form.get("page_about_sh_ar") || "") },
          storyImage: String(form.get("page_about_simage") || ""),
          storyImageAlt: { en: String(form.get("page_about_salt_en") || ""), ar: String(form.get("page_about_salt_ar") || "") },
          chapters: [1, 2, 3].map((index) => ({
            title: { en: String(form.get(`page_about_c${index}_t_en`) || ""), ar: String(form.get(`page_about_c${index}_t_ar`) || "") },
            body: { en: String(form.get(`page_about_c${index}_b_en`) || ""), ar: String(form.get(`page_about_c${index}_b_ar`) || "") },
          })),
          methodKicker: { en: String(form.get("page_about_mk_en") || ""), ar: String(form.get("page_about_mk_ar") || "") },
          methodTitle: { en: String(form.get("page_about_mt_en") || ""), ar: String(form.get("page_about_mt_ar") || "") },
          steps: [1, 2, 3, 4].map((index) => ({
            title: { en: String(form.get(`page_about_s${index}_t_en`) || ""), ar: String(form.get(`page_about_s${index}_t_ar`) || "") },
            body: { en: String(form.get(`page_about_s${index}_b_en`) || ""), ar: String(form.get(`page_about_s${index}_b_ar`) || "") },
          })),
        },
        programs: {
          kicker: { en: String(form.get("page_prog_k_en") || ""), ar: String(form.get("page_prog_k_ar") || "") },
          title: { en: String(form.get("page_prog_t_en") || ""), ar: String(form.get("page_prog_t_ar") || "") },
          lead: { en: String(form.get("page_prog_l_en") || ""), ar: String(form.get("page_prog_l_ar") || "") },
          close: { en: String(form.get("page_prog_c_en") || ""), ar: String(form.get("page_prog_c_ar") || "") },
        },
        transformations: {
          kicker: { en: String(form.get("page_work_k_en") || ""), ar: String(form.get("page_work_k_ar") || "") },
          title: {
            en: [String(form.get("page_work_t1_en") || ""), String(form.get("page_work_t2_en") || "")],
            ar: [String(form.get("page_work_t1_ar") || ""), String(form.get("page_work_t2_ar") || "")],
          },
          lead: { en: String(form.get("page_work_l_en") || ""), ar: String(form.get("page_work_l_ar") || "") },
          close: { en: String(form.get("page_work_c_en") || ""), ar: String(form.get("page_work_c_ar") || "") },
          action: { en: String(form.get("page_work_a_en") || ""), ar: String(form.get("page_work_a_ar") || "") },
        },
        pricing: pages.pricing,
        faq: {
          kicker: { en: String(form.get("page_faq_k_en") || ""), ar: String(form.get("page_faq_k_ar") || "") },
          still: { en: String(form.get("page_faq_s_en") || ""), ar: String(form.get("page_faq_s_ar") || "") },
          stillBody: { en: String(form.get("page_faq_sb_en") || ""), ar: String(form.get("page_faq_sb_ar") || "") },
          contact: { en: String(form.get("page_faq_c_en") || ""), ar: String(form.get("page_faq_c_ar") || "") },
        },
        contact: {
          kicker: { en: String(form.get("page_con_k_en") || ""), ar: String(form.get("page_con_k_ar") || "") },
          title: { en: String(form.get("page_con_t_en") || ""), ar: String(form.get("page_con_t_ar") || "") },
          lead: { en: String(form.get("page_con_l_en") || ""), ar: String(form.get("page_con_l_ar") || "") },
          emailLabel: { en: String(form.get("page_con_e_en") || ""), ar: String(form.get("page_con_e_ar") || "") },
          phoneLabel: { en: String(form.get("page_con_p_en") || ""), ar: String(form.get("page_con_p_ar") || "") },
          received: { en: String(form.get("page_con_r_en") || ""), ar: String(form.get("page_con_r_ar") || "") },
          receivedBody: { en: String(form.get("page_con_rb_en") || ""), ar: String(form.get("page_con_rb_ar") || "") },
          send: { en: String(form.get("page_con_s_en") || ""), ar: String(form.get("page_con_s_ar") || "") },
        },
        terms: {
          title: { en: String(form.get("legal_terms_t_en") || ""), ar: String(form.get("legal_terms_t_ar") || "") },
          body: { en: String(form.get("legal_terms_b_en") || ""), ar: String(form.get("legal_terms_b_ar") || "") },
        },
        privacy: {
          title: { en: String(form.get("legal_privacy_t_en") || ""), ar: String(form.get("legal_privacy_t_ar") || "") },
          body: { en: String(form.get("legal_privacy_b_en") || ""), ar: String(form.get("legal_privacy_b_ar") || "") },
        },
      },
      site: {
        email: String(form.get("site_email") || ""),
        phoneDisplay: String(form.get("site_phone") || ""),
        phoneHref: String(form.get("site_phone_href") || ""),
        brandName: { en: String(form.get("site_brand_en") || ""), ar: String(form.get("site_brand_ar") || "") },
        logo: String(form.get("site_logo") || ""),
        favicon: String(form.get("site_favicon") || ""),
        ogImage: String(form.get("site_og") || ""),
        arabicOnly: form.get("site_arabic_only") === "on",
        footerBlurb: { en: String(form.get("site_blurb_en") || ""), ar: String(form.get("site_blurb_ar") || "") },
        footerTag: { en: String(form.get("site_tag_en") || ""), ar: String(form.get("site_tag_ar") || "") },
        socials: Array.from({ length: 12 }, (_, index) => ({
          label: String(form.get(`site_soc${index + 1}_label`) || ""),
          href: String(form.get(`site_soc${index + 1}_href`) || ""),
        })).filter((item) => item.label || item.href),
      },
    };
    setPending(true);
    setError("");
    try {
      const saved = await updateAdminSite(payload);
      setData(saved);
      setFormKey((current) => current + 1);
      setNotice(t.admin.saved);
      reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  const tabs: { id: SectionId; label: string }[] = [
    { id: "hero", label: t.admin.heroBanner },
    { id: "about", label: t.admin.aboutBlock },
    { id: "programs", label: t.admin.programs },
    { id: "process", label: t.admin.process },
    { id: "transformations", label: t.admin.transformations },
    { id: "testimonials", label: t.admin.testimonials },
    { id: "why", label: t.admin.why },
    { id: "faq", label: t.admin.faq },
    { id: "cta", label: t.admin.cta },
    { id: "contact", label: t.admin.contactPage },
    { id: "footer", label: t.admin.footer },
    { id: "brand", label: arabic ? "الهوية" : "Brand" },
    { id: "legal", label: arabic ? "قانوني" : "Legal" },
  ];

  return (
    <form key={formKey} onSubmit={onSubmit} className="space-y-5 pb-4">
      <div>
        <h2 className={`text-[28px] font-semibold tracking-normal [word-spacing:0.06em] ${arabic ? "font-arabic" : "font-sans"}`}>
          {t.admin.website}
        </h2>
        <p className={`mt-1 text-sm text-neutral-400 ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>
          {t.admin.homeSections}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActive(tab.id);
              setNotice("");
            }}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
              arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]",
              active === tab.id ? "bg-primary text-white" : "bg-white text-neutral-600 shadow-sm hover:bg-[#eef3ff]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Panel id="hero" active={active} title={t.admin.heroBanner} switchName="hero_visible" visible={hero.visible}>
        <AdminGroup title={t.admin.media}>
          <ImageField name="hero_image" label={t.admin.imagePath} defaultValue={hero.image} preset="hero" />
          <ImageField name="hero_poster" label={arabic ? "صورة الغلاف" : "Video poster"} defaultValue={hero.poster} preset="hero" />
          <VideoField name="hero_video" label={arabic ? "فيديو المقدمة" : "Intro video file"} defaultValue={hero.video} />
          <AdminField name="hero_video_url" label={arabic ? "رابط فيديو خارجي" : "External video URL"} defaultValue={hero.videoUrl} dir="ltr" placeholder="https://youtube.com/..." />
          <AdminPair nameEn="hero_alt_en" nameAr="hero_alt_ar" label={t.admin.imageAlt} defaultEn={hero.alt.en} defaultAr={hero.alt.ar} />
        </AdminGroup>
        <AdminGroup title={t.admin.copyGroup}>
          <AdminPair nameEn="hero_kicker_en" nameAr="hero_kicker_ar" label={t.admin.kickerField} defaultEn={hero.kicker.en} defaultAr={hero.kicker.ar} />
          <AdminPair nameEn="hero_title_en" nameAr="hero_title_ar" label={t.admin.titleField} defaultEn={hero.title.en} defaultAr={hero.title.ar} area />
          <AdminPair nameEn="hero_lead_en" nameAr="hero_lead_ar" label={t.admin.lead} defaultEn={hero.lead.en} defaultAr={hero.lead.ar} area />
        </AdminGroup>
        <AdminGroup title={t.admin.buttons}>
          <AdminPair nameEn="hero_p_en" nameAr="hero_p_ar" label={t.admin.primaryButton} defaultEn={hero.primary.label.en} defaultAr={hero.primary.label.ar} />
          <AdminField name="hero_p_href" label={t.admin.primaryLink} defaultValue={hero.primary.href} dir="ltr" icon={<Link2 className="h-4 w-4" />} placeholder="/programs" />
          <AdminPair nameEn="hero_s_en" nameAr="hero_s_ar" label={t.admin.secondaryButton} defaultEn={hero.secondary.label.en} defaultAr={hero.secondary.label.ar} />
          <AdminField name="hero_s_href" label={t.admin.secondaryLink} defaultValue={hero.secondary.href} dir="ltr" icon={<Link2 className="h-4 w-4" />} placeholder="/contact" />
        </AdminGroup>
      </Panel>

      <Panel id="about" active={active} title={t.admin.aboutBlock} switchName="about_visible" visible={about.visible}>
        <AdminGroup title={t.admin.homeSections}>
          <AdminPair nameEn="about_label_en" nameAr="about_label_ar" label={t.admin.labelField} defaultEn={about.label.en} defaultAr={about.label.ar} />
          <AdminPair nameEn="about_title_en" nameAr="about_title_ar" label={t.admin.titleField} defaultEn={about.title.en} defaultAr={about.title.ar} />
          <AdminPair nameEn="about_p1_en" nameAr="about_p1_ar" label={`${t.admin.paragraph} 1`} defaultEn={about.paragraphs.en[0]} defaultAr={about.paragraphs.ar[0]} area />
          <AdminPair nameEn="about_p2_en" nameAr="about_p2_ar" label={`${t.admin.paragraph} 2`} defaultEn={about.paragraphs.en[1]} defaultAr={about.paragraphs.ar[1]} area />
          <AdminPair nameEn="about_action_en" nameAr="about_action_ar" label={t.admin.buttonField} defaultEn={about.action.en} defaultAr={about.action.ar} />
        </AdminGroup>
        <AdminGroup title={t.admin.principles}>
          {[0, 1, 2].map((index) => (
            <AdminPair
              key={index}
              nameEn={`about_pr${index + 1}_t_en`}
              nameAr={`about_pr${index + 1}_t_ar`}
              label={`${t.admin.principle} ${index + 1}`}
              defaultEn={about.principles.en[index]?.title || ""}
              defaultAr={about.principles.ar[index]?.title || ""}
            />
          ))}
          {[0, 1, 2].map((index) => (
            <AdminPair
              key={`b${index}`}
              nameEn={`about_pr${index + 1}_b_en`}
              nameAr={`about_pr${index + 1}_b_ar`}
              label={`${t.admin.principle} ${index + 1} · ${t.admin.textField}`}
              defaultEn={about.principles.en[index]?.body || ""}
              defaultAr={about.principles.ar[index]?.body || ""}
              area
            />
          ))}
        </AdminGroup>
        <AdminGroup title={t.admin.aboutPage}>
          <ImageField name="page_about_image" label={t.admin.imagePath} defaultValue={pages.about.image} preset="about" />
          <AdminPair nameEn="page_about_alt_en" nameAr="page_about_alt_ar" label={t.admin.imageAlt} defaultEn={pages.about.imageAlt.en} defaultAr={pages.about.imageAlt.ar} />
          <AdminPair nameEn="page_about_k_en" nameAr="page_about_k_ar" label={t.admin.kickerField} defaultEn={pages.about.kicker.en} defaultAr={pages.about.kicker.ar} />
          <AdminPair nameEn="page_about_n_en" nameAr="page_about_n_ar" label={t.admin.nameField} defaultEn={pages.about.name.en} defaultAr={pages.about.name.ar} />
          <AdminPair nameEn="page_about_q_en" nameAr="page_about_q_ar" label={t.admin.quote} defaultEn={pages.about.quote.en} defaultAr={pages.about.quote.ar} area />
          <AdminPair nameEn="page_about_l_en" nameAr="page_about_l_ar" label={t.admin.lead} defaultEn={pages.about.lead.en} defaultAr={pages.about.lead.ar} area />
          <AdminPair nameEn="page_about_a_en" nameAr="page_about_a_ar" label={t.admin.buttonField} defaultEn={pages.about.action.en} defaultAr={pages.about.action.ar} />
        </AdminGroup>
        <AdminGroup title={t.admin.story}>
          <AdminPair nameEn="page_about_sk_en" nameAr="page_about_sk_ar" label={t.admin.kickerField} defaultEn={pages.about.storyKicker.en} defaultAr={pages.about.storyKicker.ar} />
          <AdminPair nameEn="page_about_sh_en" nameAr="page_about_sh_ar" label={t.admin.headingField} defaultEn={pages.about.storyHeading.en} defaultAr={pages.about.storyHeading.ar} />
          <ImageField name="page_about_simage" label={t.admin.imagePath} defaultValue={pages.about.storyImage} preset="about" />
          <AdminPair nameEn="page_about_salt_en" nameAr="page_about_salt_ar" label={t.admin.imageAlt} defaultEn={pages.about.storyImageAlt.en} defaultAr={pages.about.storyImageAlt.ar} />
          {pages.about.chapters.map((chapter, index) => (
            <AdminGroup key={index} title={`${t.admin.chapter} ${index + 1}`}>
              <AdminPair nameEn={`page_about_c${index + 1}_t_en`} nameAr={`page_about_c${index + 1}_t_ar`} label={t.admin.titleField} defaultEn={chapter.title.en} defaultAr={chapter.title.ar} />
              <AdminPair nameEn={`page_about_c${index + 1}_b_en`} nameAr={`page_about_c${index + 1}_b_ar`} label={t.admin.textField} defaultEn={chapter.body.en} defaultAr={chapter.body.ar} area />
            </AdminGroup>
          ))}
        </AdminGroup>
        <AdminGroup title={t.admin.method}>
          <AdminPair nameEn="page_about_mk_en" nameAr="page_about_mk_ar" label={t.admin.kickerField} defaultEn={pages.about.methodKicker.en} defaultAr={pages.about.methodKicker.ar} />
          <AdminPair nameEn="page_about_mt_en" nameAr="page_about_mt_ar" label={t.admin.titleField} defaultEn={pages.about.methodTitle.en} defaultAr={pages.about.methodTitle.ar} />
          {pages.about.steps.map((step, index) => (
            <AdminGroup key={index} title={`${t.admin.step} ${index + 1}`}>
              <AdminPair nameEn={`page_about_s${index + 1}_t_en`} nameAr={`page_about_s${index + 1}_t_ar`} label={t.admin.titleField} defaultEn={step.title.en} defaultAr={step.title.ar} />
              <AdminPair nameEn={`page_about_s${index + 1}_b_en`} nameAr={`page_about_s${index + 1}_b_ar`} label={t.admin.textField} defaultEn={step.body.en} defaultAr={step.body.ar} area />
            </AdminGroup>
          ))}
        </AdminGroup>
      </Panel>

      <Panel id="programs" active={active} title={t.admin.programs} switchName="sec_programs" visible={s.programs.visible}>
        <AdminGroup title={t.admin.homeSections}>
          <AdminPair nameEn="programs_h_en" nameAr="programs_h_ar" label={t.admin.headingField} defaultEn={s.programs.heading.en} defaultAr={s.programs.heading.ar} />
          <AdminPair nameEn="programs_l_en" nameAr="programs_l_ar" label={t.admin.linkLabel} defaultEn={s.programs.link.en} defaultAr={s.programs.link.ar} />
        </AdminGroup>
        <AdminGroup title={t.admin.programsPage}>
          <AdminPair nameEn="page_prog_k_en" nameAr="page_prog_k_ar" label={t.admin.kickerField} defaultEn={pages.programs.kicker.en} defaultAr={pages.programs.kicker.ar} />
          <AdminPair nameEn="page_prog_t_en" nameAr="page_prog_t_ar" label={t.admin.titleField} defaultEn={pages.programs.title.en} defaultAr={pages.programs.title.ar} />
          <AdminPair nameEn="page_prog_l_en" nameAr="page_prog_l_ar" label={t.admin.lead} defaultEn={pages.programs.lead.en} defaultAr={pages.programs.lead.ar} area />
          <AdminPair nameEn="page_prog_c_en" nameAr="page_prog_c_ar" label={t.admin.closeText} defaultEn={pages.programs.close.en} defaultAr={pages.programs.close.ar} area />
        </AdminGroup>
      </Panel>

      <Panel id="process" active={active} title={t.admin.process} switchName="sec_process" visible={s.process.visible}>
        <AdminPair nameEn="process_h_en" nameAr="process_h_ar" label={t.admin.headingField} defaultEn={s.process.heading.en} defaultAr={s.process.heading.ar} />
        {(s.process.cards ?? []).map((card, index) => {
          const n = index + 1;
          return (
            <AdminGroup key={card.n} title={`${t.admin.processCard} ${card.n}`}>
              <AdminPair nameEn={`process_c${n}_t_en`} nameAr={`process_c${n}_t_ar`} label={t.admin.titleField} defaultEn={card.title.en} defaultAr={card.title.ar} />
              <AdminPair nameEn={`process_c${n}_b_en`} nameAr={`process_c${n}_b_ar`} label={t.admin.textField} defaultEn={card.body.en} defaultAr={card.body.ar} area />
              {[0, 1, 2].map((point) => (
                <AdminPair
                  key={point}
                  nameEn={`process_c${n}_p${point + 1}_en`}
                  nameAr={`process_c${n}_p${point + 1}_ar`}
                  label={`${t.admin.processPoint} ${point + 1}`}
                  defaultEn={card.points.en[point] || ""}
                  defaultAr={card.points.ar[point] || ""}
                />
              ))}
            </AdminGroup>
          );
        })}
      </Panel>

      <Panel id="transformations" active={active} title={t.admin.transformations} switchName="sec_transformations" visible={s.transformations.visible}>
        <AdminGroup title={t.admin.homeSections}>
          <AdminPair nameEn="work_h_en" nameAr="work_h_ar" label={t.admin.headingField} defaultEn={s.transformations.heading.en} defaultAr={s.transformations.heading.ar} />
          <AdminPair nameEn="work_l_en" nameAr="work_l_ar" label={t.admin.linkLabel} defaultEn={s.transformations.link.en} defaultAr={s.transformations.link.ar} />
        </AdminGroup>
        <AdminGroup title={t.admin.resultsPage}>
          <AdminPair nameEn="page_work_k_en" nameAr="page_work_k_ar" label={t.admin.kickerField} defaultEn={pages.transformations.kicker.en} defaultAr={pages.transformations.kicker.ar} />
          <AdminPair nameEn="page_work_t1_en" nameAr="page_work_t1_ar" label={`${t.admin.titleLine} 1`} defaultEn={pages.transformations.title.en[0]} defaultAr={pages.transformations.title.ar[0]} />
          <AdminPair nameEn="page_work_t2_en" nameAr="page_work_t2_ar" label={`${t.admin.titleLine} 2`} defaultEn={pages.transformations.title.en[1]} defaultAr={pages.transformations.title.ar[1]} />
          <AdminPair nameEn="page_work_l_en" nameAr="page_work_l_ar" label={t.admin.lead} defaultEn={pages.transformations.lead.en} defaultAr={pages.transformations.lead.ar} area />
          <AdminPair nameEn="page_work_c_en" nameAr="page_work_c_ar" label={t.admin.closeText} defaultEn={pages.transformations.close.en} defaultAr={pages.transformations.close.ar} area />
          <AdminPair nameEn="page_work_a_en" nameAr="page_work_a_ar" label={t.admin.buttonField} defaultEn={pages.transformations.action.en} defaultAr={pages.transformations.action.ar} />
        </AdminGroup>
      </Panel>

      <Panel id="testimonials" active={active} title={t.admin.testimonials} switchName="sec_testimonials" visible={s.testimonials.visible}>
        <p className={`text-sm text-neutral-400 ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>
          {t.admin.sectionCopy}
        </p>
      </Panel>

      <Panel id="why" active={active} title={t.admin.why} switchName="sec_why" visible={s.why.visible}>
        <AdminPair nameEn="why_h_en" nameAr="why_h_ar" label={t.admin.headingField} defaultEn={s.why.heading.en} defaultAr={s.why.heading.ar} />
        {(s.why.items ?? []).map((item, index) => (
          <AdminGroup key={item.n} title={`${t.admin.processCard} ${item.n}`}>
            <AdminPair nameEn={`why_c${index + 1}_t_en`} nameAr={`why_c${index + 1}_t_ar`} label={t.admin.titleField} defaultEn={item.title.en} defaultAr={item.title.ar} />
            <AdminPair nameEn={`why_c${index + 1}_b_en`} nameAr={`why_c${index + 1}_b_ar`} label={t.admin.textField} defaultEn={item.body.en} defaultAr={item.body.ar} area />
          </AdminGroup>
        ))}
      </Panel>

      <Panel id="faq" active={active} title={t.admin.faq} switchName="sec_faq" visible={s.faq.visible}>
        <AdminPair nameEn="faq_h_en" nameAr="faq_h_ar" label={t.admin.headingField} defaultEn={s.faq.heading.en} defaultAr={s.faq.heading.ar} />
        <AdminPair nameEn="page_faq_k_en" nameAr="page_faq_k_ar" label={t.admin.kickerField} defaultEn={pages.faq.kicker.en} defaultAr={pages.faq.kicker.ar} />
        <AdminPair nameEn="page_faq_s_en" nameAr="page_faq_s_ar" label={t.admin.still} defaultEn={pages.faq.still.en} defaultAr={pages.faq.still.ar} />
        <AdminPair nameEn="page_faq_sb_en" nameAr="page_faq_sb_ar" label={t.admin.stillBody} defaultEn={pages.faq.stillBody.en} defaultAr={pages.faq.stillBody.ar} area />
        <AdminPair nameEn="page_faq_c_en" nameAr="page_faq_c_ar" label={t.admin.buttonField} defaultEn={pages.faq.contact.en} defaultAr={pages.faq.contact.ar} />
        {(s.faq.items ?? []).map((item, index) => (
          <AdminGroup key={item.q.en || index} title={`${t.admin.question} ${String(index + 1).padStart(2, "0")}`}>
            <AdminPair nameEn={`faq_i${index + 1}_q_en`} nameAr={`faq_i${index + 1}_q_ar`} label={t.admin.question} defaultEn={item.q.en} defaultAr={item.q.ar} />
            <AdminPair nameEn={`faq_i${index + 1}_a_en`} nameAr={`faq_i${index + 1}_a_ar`} label={t.admin.answer} defaultEn={item.a.en} defaultAr={item.a.ar} area />
          </AdminGroup>
        ))}
      </Panel>

      <Panel id="cta" active={active} title={t.admin.cta} switchName="sec_cta" visible={s.cta.visible}>
        <AdminPair nameEn="cta_t_en" nameAr="cta_t_ar" label={t.admin.titleField} defaultEn={s.cta.title.en} defaultAr={s.cta.title.ar} />
        <AdminPair nameEn="cta_l_en" nameAr="cta_l_ar" label={t.admin.lead} defaultEn={s.cta.lead.en} defaultAr={s.cta.lead.ar} area />
        <AdminPair nameEn="cta_b_en" nameAr="cta_b_ar" label={t.admin.buttonField} defaultEn={s.cta.label.en} defaultAr={s.cta.label.ar} />
        <AdminField name="cta_href" label={t.admin.linkField} defaultValue={s.cta.href} dir="ltr" icon={<Link2 className="h-4 w-4" />} placeholder="/programs" />
      </Panel>

      <Panel id="contact" active={active} title={t.admin.contactPage}>
        <AdminPair nameEn="page_con_k_en" nameAr="page_con_k_ar" label={t.admin.kickerField} defaultEn={pages.contact.kicker.en} defaultAr={pages.contact.kicker.ar} />
        <AdminPair nameEn="page_con_t_en" nameAr="page_con_t_ar" label={t.admin.titleField} defaultEn={pages.contact.title.en} defaultAr={pages.contact.title.ar} />
        <AdminPair nameEn="page_con_l_en" nameAr="page_con_l_ar" label={t.admin.lead} defaultEn={pages.contact.lead.en} defaultAr={pages.contact.lead.ar} area />
        <AdminPair nameEn="page_con_e_en" nameAr="page_con_e_ar" label={t.admin.emailField} defaultEn={pages.contact.emailLabel.en} defaultAr={pages.contact.emailLabel.ar} />
        <AdminPair nameEn="page_con_p_en" nameAr="page_con_p_ar" label={t.admin.phoneField} defaultEn={pages.contact.phoneLabel.en} defaultAr={pages.contact.phoneLabel.ar} />
        <AdminPair nameEn="page_con_r_en" nameAr="page_con_r_ar" label={t.admin.received} defaultEn={pages.contact.received.en} defaultAr={pages.contact.received.ar} />
        <AdminPair nameEn="page_con_rb_en" nameAr="page_con_rb_ar" label={t.admin.receivedBody} defaultEn={pages.contact.receivedBody.en} defaultAr={pages.contact.receivedBody.ar} area />
        <AdminPair nameEn="page_con_s_en" nameAr="page_con_s_ar" label={t.admin.buttonField} defaultEn={pages.contact.send.en} defaultAr={pages.contact.send.ar} />
      </Panel>

      <Panel id="brand" active={active} title={arabic ? "الهوية" : "Brand"}>
        <AdminPair nameEn="site_brand_en" nameAr="site_brand_ar" label={arabic ? "اسم العلامة" : "Brand name"} defaultEn={siteInfo.brandName?.en} defaultAr={siteInfo.brandName?.ar} />
        <ImageField name="site_logo" label={arabic ? "شعار الرأس" : "Header logo"} defaultValue={siteInfo.logo} />
        <ImageField name="site_favicon" label="Favicon" defaultValue={siteInfo.favicon} />
        <ImageField name="site_og" label={arabic ? "صورة المشاركة" : "Social preview image"} defaultValue={siteInfo.ogImage} />
        <AdminSwitch name="site_arabic_only" label={arabic ? "وضع العربية فقط" : "Arabic only mode"} defaultChecked={siteInfo.arabicOnly} />
      </Panel>

      <Panel id="legal" active={active} title={arabic ? "قانوني" : "Legal"}>
        <p className="text-sm text-neutral-500">
          {arabic
            ? "اترك النص فارغاً حتى يعتمد العميل الصياغة القانونية. لا تُعرض سياسات وهمية."
            : "Leave the body empty until the client approves legal copy. Do not publish placeholder policies."}
        </p>
        <AdminPair nameEn="legal_terms_t_en" nameAr="legal_terms_t_ar" label={arabic ? "عنوان الشروط" : "Terms title"} defaultEn={pages.terms?.title.en} defaultAr={pages.terms?.title.ar} />
        <AdminPair nameEn="legal_terms_b_en" nameAr="legal_terms_b_ar" label={arabic ? "نص الشروط" : "Terms body"} defaultEn={pages.terms?.body.en} defaultAr={pages.terms?.body.ar} area />
        <AdminPair nameEn="legal_privacy_t_en" nameAr="legal_privacy_t_ar" label={arabic ? "عنوان الخصوصية" : "Privacy title"} defaultEn={pages.privacy?.title.en} defaultAr={pages.privacy?.title.ar} />
        <AdminPair nameEn="legal_privacy_b_en" nameAr="legal_privacy_b_ar" label={arabic ? "نص الخصوصية" : "Privacy body"} defaultEn={pages.privacy?.body.en} defaultAr={pages.privacy?.body.ar} area />
      </Panel>

      <Panel id="footer" active={active} title={t.admin.footer}>
        <FooterEditor site={siteInfo} />
      </Panel>

      <AdminSaveBar pending={pending} error={error} notice={notice} saveLabel={t.admin.saveChanges} savingLabel={t.admin.saving} />
    </form>
  );
}
