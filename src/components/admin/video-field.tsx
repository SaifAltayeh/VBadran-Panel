"use client";

import { Film, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { errorMessage } from "@/lib/api";
import { uploadAdminVideo } from "@/lib/api/admin";
import { useLang } from "@/lib/i18n";
import { mediaPresets } from "@/lib/media-presets";
import { cn } from "@/lib/utils";

function previewSrc(value: string) {
  if (!value) return "";
  if (value.startsWith("http") || value.startsWith("data:")) return value;
  const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api").replace(/\/api\/?$/, "");
  if (value.startsWith("/media/")) return `${api}${value}`;
  return value;
}

export function VideoField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const { t, arabic } = useLang();
  const guide = mediaPresets.video;
  const [src, setSrc] = useState(defaultValue || "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const sizeHint = arabic ? guide.sizeHintAr : guide.sizeHint;
  const cropHint = arabic ? guide.cropHintAr : guide.cropHint;

  useEffect(() => {
    setSrc(defaultValue || "");
  }, [defaultValue]);

  async function onPick(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError(arabic ? "ارفع ملف فيديو فقط." : "Upload a video file only.");
      return;
    }
    if (file.size > guide.maxMb * 1024 * 1024) {
      setError(
        arabic
          ? `الفيديو أكبر من ${guide.maxMb}MB. صغّره إلى 1280×720 MP4.`
          : `Video must be under ${guide.maxMb}MB. Use a short 1280×720 MP4.`,
      );
      return;
    }
    setPending(true);
    setError("");
    try {
      const uploaded = await uploadAdminVideo(file);
      setSrc(uploaded.url || uploaded.path);
    } catch (err) {
      setError(errorMessage(err, arabic ? "تعذّر رفع الفيديو." : "Could not upload the video."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-4">
      <input type="hidden" name={name} value={src} />
      <div className="overflow-hidden rounded-[18px] border border-[#e6ecf4] bg-black">
        <div className="relative aspect-video w-full">
          {src ? (
            <video key={src.slice(0, 64)} src={previewSrc(src)} controls className="absolute inset-0 h-full w-full object-contain" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50">
              <Film className="h-6 w-6" />
              <span className={`text-xs ${arabic ? "font-arabic" : ""}`}>{t.admin.videoPreview}</span>
            </div>
          )}
          <span className="absolute bottom-2 start-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] text-white">
            {t.admin.websiteCropLabel}
          </span>
        </div>
      </div>
      <div className="grid gap-3">
        <p className={`text-[12px] font-medium text-neutral-500 ${arabic ? "font-arabic" : ""}`}>{label}</p>
        <label
          className={cn(
            "relative inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[#d7e0ee] bg-[#f7f9fc] px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-[#eef3ff]",
            arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]",
            pending ? "pointer-events-none opacity-60" : "",
          )}
        >
          <Upload className="h-4 w-4" />
          {pending ? (arabic ? "جاري الرفع..." : "Uploading...") : t.admin.uploadVideo}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={pending}
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              event.target.value = "";
              void onPick(file);
            }}
          />
        </label>
        <p className={`text-xs text-neutral-500 ${arabic ? "font-arabic" : ""}`}>{sizeHint}</p>
        <p className={`text-xs text-neutral-400 ${arabic ? "font-arabic" : ""}`}>{cropHint}</p>
        {error ? <p className={`text-sm text-primary ${arabic ? "font-arabic" : ""}`}>{error}</p> : null}
      </div>
    </div>
  );
}
