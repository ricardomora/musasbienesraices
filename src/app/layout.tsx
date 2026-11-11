import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Outfit, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

/** Clerk/Convex in Providers read request runtime; defer Instant Navigation validation until auth is fully Cache-Components shaped. */
export const instant = false;

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Musas Bienes Raíces",
    template: "%s · Musas",
  },
  description:
    "Musas: compra y venta de inmuebles en Venezuela con precios claros en USD. Claridad, control y trato justo.",
  openGraph: {
    title: "Musas Bienes Raíces",
    description:
      "Encuentra y publica propiedades en venta en Venezuela — precios en USD.",
    locale: "es_VE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`dark ${outfit.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col atmosphere">
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
