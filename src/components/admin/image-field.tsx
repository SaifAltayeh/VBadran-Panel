"use client";

import { ImageIcon, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { errorMessage } from "@/lib/api";
import { uploadAdminImage } from "@/lib/api/admin";
import { useLang } from "@/lib/i18n";
import { mediaPresets, type MediaPresetKey } from "@/lib/media-presets";
import { cn } from "@/lib/utils";

function previewSrc(value: string) {
  if (!value) return "";
  if (value.startsWith("http") || value.startsWith("data:")) return value;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";
  const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api").replace(/\/api\/?$/, "");
  if (value.startsWith("/media/")) return `${api}${value}`;
  return `${site}${value}`;
}

function displayPath(value: string) {
  if (!value) return "";
  if (value.startsWith("data:")) return "Uploaded image ready";
  if (value.length > 64) return `${value.slice(0, 48)}…`;
  return value;
}

async function loadImage(src: string) {
  const image = new Image();
  image.decoding = "async";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not read that image."));
    image.src = src;
  });
  return image;
}

async function cropToBlob(source: string, aspect: number, width: number, height: number, zoom: number, offsetX: number, offsetY: number) {
  const image = await loadImage(source);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop the image.");

  const baseScale = Math.max(width / image.width, height / image.height) * zoom;
  const drawW = image.width * baseScale;
  const drawH = image.height * baseScale;
  const maxOffsetX = Math.max(0, (drawW - width) / 2);
  const maxOffsetY = Math.max(0, (drawH - height) / 2);
  const dx = (width - drawW) / 2 + offsetX * maxOffsetX;
  const dy = (height - drawH) / 2 + offsetY * maxOffsetY;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, dx, dy, drawW, drawH);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  if (!blob) throw new Error("Could not crop the image.");
  return blob;
}

function CropDialog({
  source,
  aspect,
  width,
  height,
  cropHint,
  onCancel,
  onConfirm,
}: {
  source: string;
  aspect: number;
  width: number;
  height: number;
  cropHint: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const { t, arabic } = useLang();
  const [zoom, setZoom] = useState(1.15);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [pending, setPending] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  async function confirm() {
    setPending(true);
    try {
      const blob = await cropToBlob(source, aspect, width, height, zoom, offsetX, offsetY);
      onConfirm(blob);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-xl rounded-[24px] bg-white p-5 shadow-2xl">
        <p className={`text-sm font-semibold text-neutral-950 ${arabic ? "font-arabic" : ""}`}>{t.admin.cropTitle}</p>
        <p className={`mt-1 text-xs text-neutral-500 ${arabic ? "font-arabic" : ""}`}>{cropHint}</p>
        <div className="mt-4 overflow-hidden rounded-[18px] border border-[#e6ecf4] bg-[#0b1220]">
          <div
            className="relative mx-auto w-full max-w-md touch-none overflow-hidden bg-black"
            style={{ aspectRatio: `${aspect}` }}
            onPointerDown={(event) => {
              drag.current = { x: event.clientX, y: event.clientY, ox: offsetX, oy: offsetY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!drag.current) return;
              const dx = (event.clientX - drag.current.x) / 120;
              const dy = (event.clientY - drag.current.y) / 120;
              setOffsetX(Math.max(-1, Math.min(1, drag.current.ox + dx)));
              setOffsetY(Math.max(-1, Math.min(1, drag.current.oy + dy)));
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={source}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                width: `${zoom * 100}%`,
                height: "auto",
                transform: `translate(calc(-50% + ${offsetX * 12}%), calc(-50% + ${offsetY * 12}%))`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.45)]" />
            <span className="pointer-events-none absolute bottom-3 start-3 rounded-full bg-black/70 px-3 py-1 text-[11px] text-white">
              {t.admin.websiteCropLabel}
            </span>
          </div>
        </div>
        <label className={`mt-4 grid gap-2 text-xs text-neutral-500 ${arabic ? "font-arabic" : ""}`}>
          {t.admin.zoom}
          <input type="range" min={1} max={2.4} step={0.01} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={confirm}
            disabled={pending}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? t.admin.saving : t.admin.useCrop}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-2.5 text-sm text-neutral-500">
            {t.admin.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageField({
  name,
  label,
  defaultValue,
  preset = "program",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  preset?: MediaPresetKey;
}) {
  const { t, arabic } = useLang();
  const guide = mediaPresets[preset] || mediaPresets.program;
  const incoming = defaultValue || "";
  const [src, setSrc] = useState(incoming);
  const [seenDefault, setSeenDefault] = useState(incoming);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [cropSource, setCropSource] = useState<string | null>(null);
  const sizeHint = arabic ? guide.sizeHintAr : guide.sizeHint;
  const cropHint = arabic ? guide.cropHintAr : guide.cropHint;
  const previewStyle = useMemo(() => ({ aspectRatio: `${guide.aspect}` }), [guide.aspect]);
  if (incoming !== seenDefault) {
    setSeenDefault(incoming);
    setSrc(incoming);
  }

  async function uploadCropped(blob: Blob) {
    setPending(true);
    setError("");
    setCropSource(null);
    try {
      const file = new File([blob], "crop.jpg", { type: "image/jpeg" });
      const uploaded = await uploadAdminImage(file);
      setSrc(uploaded.url || uploaded.path);
    } catch (err) {
      setError(errorMessage(err, arabic ? "تعذّر رفع الصورة." : "Could not upload the image."));
    } finally {
      setPending(false);
    }
  }

  function onPick(file: File | null) {
    if (!file) return;
    if (file.size > guide.maxMb * 1024 * 1024) {
      setError(arabic ? `الصورة أكبر من ${guide.maxMb}MB.` : `Image must be under ${guide.maxMb}MB.`);
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setCropSource(String(reader.result || ""));
    reader.onerror = () => setError(arabic ? "تعذّر قراءة الصورة." : "Could not read that image.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(140px,200px)_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-[18px] border border-[#e6ecf4] bg-white">
        <div className="relative w-full bg-[#f7f9fc]" style={previewStyle}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src.slice(0, 64)} src={previewSrc(src)} alt={t.admin.imagePreview} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400">
              <ImageIcon className="h-5 w-5" />
              <span className={`text-xs ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>
                {t.admin.imagePreview}
              </span>
            </div>
          )}
          <span className="absolute bottom-2 start-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] text-white">
            {t.admin.websiteCropLabel}
          </span>
        </div>
      </div>
      <div className="grid min-w-0 gap-3">
        <input type="hidden" name={name} value={src} />
        <label className="grid min-w-0 gap-1.5">
          <span className={`text-[12px] font-medium text-neutral-500 ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>
            {label}
          </span>
          <span className="flex h-12 min-w-0 items-center gap-2.5 overflow-hidden rounded-[18px] border border-[#e6ecf4] bg-white px-3.5 text-[15px] text-neutral-500">
            <ImageIcon className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="min-w-0 truncate">{displayPath(src) || "/images/…"}</span>
          </span>
        </label>
        <label
          className={cn(
            "relative inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[#d7e0ee] bg-[#f7f9fc] px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-[#eef3ff]",
            arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]",
            pending ? "pointer-events-none opacity-60" : "",
          )}
        >
          <Upload className="h-4 w-4" />
          {pending ? (arabic ? "جاري الرفع..." : "Uploading...") : t.admin.uploadFromLaptop}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={pending}
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              event.target.value = "";
              onPick(file);
            }}
          />
        </label>
        <p className={`text-xs text-neutral-500 ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>{sizeHint}</p>
        <p className={`text-xs text-neutral-400 ${arabic ? "font-arabic" : "font-sans tracking-normal [word-spacing:0.06em]"}`}>{cropHint}</p>
        {error ? <p className={`text-sm text-primary ${arabic ? "font-arabic" : ""}`}>{error}</p> : null}
      </div>
      {cropSource ? (
        <CropDialog
          source={cropSource}
          aspect={guide.aspect}
          width={guide.width}
          height={guide.height}
          cropHint={cropHint}
          onCancel={() => setCropSource(null)}
          onConfirm={(blob) => void uploadCropped(blob)}
        />
      ) : null}
    </div>
  );
}
