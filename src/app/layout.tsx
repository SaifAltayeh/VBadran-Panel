import type { Metadata, Viewport } from "next";
import { Archivo, Manrope, Noto_Sans_Arabic } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e8f2fc",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Badran Admin",
    template: "%s — Badran Admin",
  },
  description:
    "Training packages, personal workout plans, and exercise videos from Badran.",
  openGraph: {
    type: "website",
    siteName: "Badran",
    title: "Badran Admin",
    description: "Training packages, personal workout plans, and exercise videos from Badran.",
    images: [{ url: "/images/hero/coach-portrait.jpg", alt: "Badran" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${archivo.variable} ${manrope.variable} ${notoArabic.variable} h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("vb-lang")==="en"?"en":"ar";document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background font-sans text-black antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
