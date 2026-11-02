"use client";

import { ImageIcon, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminField } from "@/components/admin/fields";
import { errorMessage } from "@/lib/api";
import { uploadAdminImage } from "@/lib/api/admin";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function previewSrc(value: string) {
  if (!value) return "";
  if (value.startsWith("http") || value.startsWith("data:")) return value;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";
  const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api").replace(/\/api\/?$/, "");
  if (value.startsWith("/media/")) return `${api}${value}`;
  return `${site}${value}`;
}

export function ImageField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const { t, arabic } = useLang();
  const [src, setSrc] = useState(defaultValue || "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSrc(defaultValue || "");
  }, [defaultValue]);

  async function onPick(file: File | null) {
    if (!file) return;
    setPending(true);
    setError("");
    try {
      const uploaded = await uploadAdminImage(file);
      const next = uploaded.url || uploaded.path;
      setSrc(next);
    } catch (err) {
      setError(errorMessage(err, arabic ? "تعذّر رفع الصورة." : "Could not upload the image."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-[18px] border border-[#e6ecf4] bg-white">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src.slice(0, 64)} src={previewSrc(src)} alt={t.admin.imagePreview} className="h-28 w-full object-cover" />
        ) : (
          <div className="flex h-28 flex-col items-center justify-center gap-2 text-neutral-400">
            <ImageIcon className="h-5 w-5" />
            <span className={`text-xs ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>
              {t.admin.imagePreview}
            </span>
          </div>
        )}
      </div>
      <div className="grid gap-3">
        <AdminField
          name={name}
          label={label}
          value={src}
          dir="ltr"
          icon={<ImageIcon className="h-4 w-4" />}
          placeholder="/images/hero/banner.jpg"
          onChange={(event) => setSrc(event.target.value)}
        />
        <label
          className={cn(
            "inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[#d7e0ee] bg-[#f7f9fc] px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-[#eef3ff]",
            arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]",
            pending ? "pointer-events-none opacity-60" : "",
          )}
        >
          <Upload className="h-4 w-4" />
          {pending ? (arabic ? "جاري الرفع..." : "Uploading...") : t.admin.uploadFromLaptop}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={pending}
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              event.target.value = "";
              void onPick(file);
            }}
          />
        </label>
        <p className={`text-xs text-neutral-400 ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>
          {arabic ? "ارفع الصورة ثم اضغط حفظ التغييرات." : "Upload the image, then click Save changes."}
        </p>
        {error ? <p className={`text-sm text-primary ${arabic ? "font-arabic" : ""}`}>{error}</p> : null}
      </div>
    </div>
  );
}
