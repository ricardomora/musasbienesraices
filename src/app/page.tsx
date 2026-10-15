import { Cta } from "@/components/landing/cta";
import { Difference } from "@/components/landing/difference";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Promise } from "@/components/landing/promise";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Problem />
      <Difference />
      <Promise />
      <Cta />
      <SiteFooter />
    </main>
  );
}
