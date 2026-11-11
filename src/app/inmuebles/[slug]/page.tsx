import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingDetailShell } from "@/components/listings/listing-detail-shell";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Inmueble",
  description: "Ficha de inmueble en Musas — Venezuela, precios en USD.",
};

/** Dynamic slug pages may block Instant Navigation while Cache Components + Clerk settle. */
export const instant = false;

async function ListingBody({ params }: Props) {
  const { slug } = await params;
  return <ListingDetailShell slug={slug} />;
}

export default function ListingPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          Cargando ficha…
        </main>
      }
    >
      <ListingBody params={params} />
    </Suspense>
  );
}
