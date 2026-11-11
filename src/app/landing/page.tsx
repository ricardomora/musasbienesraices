import type { Metadata } from "next";
import { Cta } from "@/components/landing/cta";
import { Difference } from "@/components/landing/difference";
import { Hero } from "@/components/landing/hero";
import { Listings } from "@/components/landing/listings";
import { Problem } from "@/components/landing/problem";
import { Promise } from "@/components/landing/promise";
import { SiteFooter } from "@/components/landing/site-footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";

export const metadata: Metadata = {
  title: "Musas — Vende sin el abuso de siempre",
  description:
    "Musas Venezuela: publica en USD, con claridad y control. Acceso anticipado.",
};

export default function LandingPage() {
  return (
    <main className="relative flex-1 overflow-x-hidden bg-background">
      <ScrollProgress />
      <Hero />
      <Problem />
      <Listings />
      <Difference />
      <Promise />
      <Cta />
      <SiteFooter />
    </main>
  );
}
