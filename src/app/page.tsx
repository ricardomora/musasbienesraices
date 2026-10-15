import { Cta } from "@/components/landing/cta";
import { Difference } from "@/components/landing/difference";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Promise } from "@/components/landing/promise";
import { Showcase } from "@/components/landing/showcase";
import { SiteFooter } from "@/components/landing/site-footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";

export default function Home() {
  return (
    <main className="relative flex-1 overflow-x-hidden bg-background">
      <ScrollProgress />
      <Hero />
      <Problem />
      <Showcase />
      <Difference />
      <Promise />
      <Cta />
      <SiteFooter />
    </main>
  );
}
