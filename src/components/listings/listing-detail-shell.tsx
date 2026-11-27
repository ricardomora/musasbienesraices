"use client";

import Link from "next/link";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import { ConvexListingDetail } from "./convex-listing-detail";

export function ListingDetailShell({ slug }: { slug: string }) {
  if (!BACKEND_CONFIGURED) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background px-6 py-20 text-center">
        <div className="max-w-md space-y-3">
          <p className="text-sm text-muted-foreground">
            Backend no configurado. No hay ficha local de demo en producción.
          </p>
          <Link href="/" className="text-sm text-neon hover:underline">
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }
  return <ConvexListingDetail slug={slug} />;
}
