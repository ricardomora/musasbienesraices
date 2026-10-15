import type { Metadata } from "next";
import { Fraunces, Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Musas Bienes Raíces — Vende sin abusos",
  description:
    "Musas simplifica y revoluciona la venta de propiedades. Publica, conecta y cierra con claridad — sin comisiones opacas ni presión de las inmobiliarias de siempre.",
  openGraph: {
    title: "Musas Bienes Raíces",
    description:
      "La forma justa y moderna de vender propiedades en Latinoamérica.",
    locale: "es_LA",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col atmosphere">{children}</body>
    </html>
  );
}
