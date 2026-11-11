"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { CITIES } from "@/data/cities";
import { UploadButton } from "@/lib/uploadthing";

function EditListing() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id as Id<"listings">;
  const listing = useQuery(api.listings.getMine, { id });
  const updateListing = useMutation(api.listings.updateListing);
  const publishListing = useMutation(api.listings.publishListing);
  const [form, setForm] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!listing) return;
    setForm({
      title: listing.title,
      type: listing.type,
      cityId: listing.cityId,
      neighborhood: listing.neighborhood,
      priceUsd: String(listing.priceUsd),
      administrationUsd: String(listing.administrationUsd),
      beds: String(listing.beds),
      baths: String(listing.baths),
      areaM2: String(listing.areaM2),
      description: listing.description,
      features: listing.features.join(", "),
    });
    setImages(listing.images);
  }, [listing]);

  if (listing === undefined) {
    return <p className="p-10 text-muted-foreground">Cargando…</p>;
  }
  if (listing === null) {
    return <p className="p-10 text-muted-foreground">No encontrado.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold text-white">Editar inmueble</h1>
      {(
        [
          ["title", "Título"],
          ["neighborhood", "Sector"],
          ["priceUsd", "Precio USD"],
          ["administrationUsd", "Admin USD"],
          ["beds", "Habitaciones"],
          ["baths", "Baños"],
          ["areaM2", "m²"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block space-y-1 text-sm">
          <span className="text-white/70">{label}</span>
          <input
            value={form[key] ?? ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
          />
        </label>
      ))}
      <label className="block space-y-1 text-sm">
        <span className="text-white/70">Ciudad</span>
        <select
          value={form.cityId}
          onChange={(e) => setForm({ ...form, cityId: e.target.value })}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-white/70">Descripción</span>
        <textarea
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-white/70">Features (coma)</span>
        <input
          value={form.features ?? ""}
          onChange={(e) => setForm({ ...form, features: e.target.value })}
          className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
        />
      </label>
      <UploadButton
        endpoint="listingImageUploader"
        onClientUploadComplete={(res) => {
          setImages((prev) => [...prev, ...res.map((f) => f.url)]);
        }}
        onUploadError={(e) => {
          void toast.error(e.message);
        }}
      />
      <div className="flex flex-wrap gap-3 pt-4">
        <button
          type="button"
          className="h-11 rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground"
          onClick={() =>
            void updateListing({
              id,
              title: form.title,
              type: form.type as "apartamentos" | "casas",
              cityId: form.cityId,
              neighborhood: form.neighborhood,
              priceUsd: Number(form.priceUsd) || 0,
              administrationUsd: Number(form.administrationUsd) || 0,
              beds: Number(form.beds) || 0,
              baths: Number(form.baths) || 0,
              areaM2: Number(form.areaM2) || 0,
              description: form.description,
              features: (form.features ?? "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              images,
            })
              .then(() => toast.success("Guardado"))
              .catch((e) =>
                toast.error(e instanceof Error ? e.message : "Error"),
              )
          }
        >
          Guardar
        </button>
        <button
          type="button"
          className="h-11 rounded-full border border-white/20 px-5 text-sm text-white"
          onClick={() =>
            void publishListing({ id })
              .then(() => {
                toast.success("Publicado");
                router.push(`/inmuebles/${listing.slug}`);
              })
              .catch((e) =>
                toast.error(e instanceof Error ? e.message : "Error"),
              )
          }
        >
          Publicar
        </button>
      </div>
    </div>
  );
}

export default function EditListingPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="editar inmuebles">
        <DashboardNav />
        <EditListing />
      </BackendGate>
    </main>
  );
}
