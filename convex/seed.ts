import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAdmin } from "./lib";

const DEMO = [
  {
    slug: "casa-avila-caracas",
    type: "casas" as const,
    operationType: "venta" as const,
    cityId: "caracas",
    neighborhood: "Los Palos Grandes",
    title: "Casa Ávila",
    badge: "Selección Musas",
    priceUsd: 485_000,
    beds: 4,
    baths: 4,
    areaM2: 380,
    images: ["/villa-dusk.png"],
    alt: "Casa moderna al atardecer con piscina",
    description:
      "Arquitectura que se abre al paisaje. Espacios generosos, terraza con vista al Ávila y piscina privada en uno de los sectores más buscados de Caracas.",
    administrationUsd: 420,
    features: [
      "Piscina privada",
      "Terraza panorámica",
      "3 puestos de estacionamiento",
      "Jardín privado",
    ],
  },
  {
    slug: "apto-altamira-caracas",
    type: "apartamentos" as const,
    operationType: "venta" as const,
    cityId: "caracas",
    neighborhood: "Altamira",
    title: "Apartamento Altamira",
    badge: "Nuevo en Musas",
    priceUsd: 220_000,
    beds: 3,
    baths: 2,
    areaM2: 145,
    images: ["/penthouse-interior.png"],
    alt: "Interior luminoso de apartamento",
    description:
      "Luz natural en cada rincón. Planta abierta, cocina integrada y balcón amplio a pasos de Plaza Altamira.",
    administrationUsd: 180,
    features: [
      "Balcón amplio",
      "Cocina integrada",
      "2 puestos de estacionamiento",
      "Lobby con vigilancia",
    ],
  },
  {
    slug: "apto-alquiler-altamira",
    type: "apartamentos" as const,
    operationType: "alquiler" as const,
    cityId: "caracas",
    neighborhood: "Altamira",
    title: "Apto amueblado Altamira",
    badge: "Alquiler",
    priceUsd: 1_100,
    beds: 2,
    baths: 2,
    areaM2: 95,
    images: ["/penthouse-interior.png"],
    alt: "Apartamento en alquiler Altamira",
    description:
      "Alquiler en USD/mes. Amueblado, luz natural y a pasos de Plaza Altamira. Coordinación fuera de Musas.",
    administrationUsd: 120,
    features: ["Amueblado", "Balcón", "1 puesto", "Vigilancia"],
  },
  {
    slug: "casa-alquiler-valencia",
    type: "casas" as const,
    operationType: "alquiler" as const,
    cityId: "valencia",
    neighborhood: "Naguara",
    title: "Casa familiar Naguara",
    badge: "Alquiler",
    priceUsd: 850,
    beds: 3,
    baths: 2,
    areaM2: 180,
    images: ["/villa-day.png"],
    alt: "Casa en alquiler Valencia",
    description:
      "Alquiler mensual en USD. Jardín y áreas sociales. Ideal para familia que busca espacio en Valencia.",
    administrationUsd: 0,
    features: ["Jardín", "2 puestos", "Área BBQ"],
  },
  {
    slug: "penthouse-chacao-caracas",
    type: "apartamentos" as const,
    operationType: "venta" as const,
    cityId: "caracas",
    neighborhood: "Chacao",
    title: "Penthouse Chacao",
    badge: "Selección Musas",
    priceUsd: 620_000,
    beds: 3,
    baths: 3,
    areaM2: 260,
    images: ["/section-interior.jpg"],
    alt: "Penthouse con vista urbana",
    description:
      "Vista abierta a la ciudad y acabados contemporáneos. Ideal para quien busca altura, privacidad y una ficha clara de punta a punta.",
    administrationUsd: 510,
    features: [
      "Vista panorámica",
      "Terraza privada",
      "Ascensor directo",
      "2 puestos de estacionamiento",
    ],
  },
  {
    slug: "casa-naguara-valencia",
    type: "casas" as const,
    operationType: "venta" as const,
    cityId: "valencia",
    neighborhood: "Naguara",
    title: "Casa Naguara",
    priceUsd: 310_000,
    beds: 4,
    baths: 3,
    areaM2: 290,
    images: ["/villa-day.png"],
    alt: "Casa de día con jardín y piscina",
    description:
      "Casa familiar con jardín tropical y áreas sociales integradas. Pensada para vivir con espacio, sin complicaciones.",
    administrationUsd: 95,
    features: ["Piscina", "Jardín tropical", "Área de BBQ", "2 puestos de estacionamiento"],
  },
  {
    slug: "casa-playa-lecheria",
    type: "casas" as const,
    operationType: "venta" as const,
    cityId: "lecheria",
    neighborhood: "Lechería Norte",
    title: "Casa Playa Norte",
    badge: "Selección Musas",
    priceUsd: 390_000,
    beds: 4,
    baths: 4,
    areaM2: 360,
    images: ["/villa-dusk.png"],
    alt: "Casa costera con iluminación cálida",
    description:
      "Residencia costera con iluminación cálida y áreas sociales amplias. Pensada para quienes buscan confort frente al mar.",
    administrationUsd: 280,
    features: ["Cerca de la playa", "Piscina", "Terraza", "3 puestos de estacionamiento"],
  },
];

export const seedDemoListings = mutation({
  args: { force: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let owner = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "demo@musas.app"))
      .unique();

    if (!owner) {
      const ownerId = await ctx.db.insert("users", {
        clerkId: "demo_owner_musas",
        email: "demo@musas.app",
        name: "Colección Musas",
        role: "user",
        createdAt: Date.now(),
      });
      owner = (await ctx.db.get(ownerId))!;
    }

    let created = 0;
    const now = Date.now();
    for (const item of DEMO) {
      const existing = await ctx.db
        .query("listings")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .unique();
      if (existing && !args.force) continue;
      if (existing && args.force) {
        await ctx.db.patch(existing._id, {
          ...item,
          ownerId: owner._id,
          status: "published",
          isDemo: true,
          updatedAt: now,
        });
        created += 1;
        continue;
      }
      await ctx.db.insert("listings", {
        ...item,
        ownerId: owner._id,
        status: "published",
        isDemo: true,
        createdAt: now,
        updatedAt: now,
      });
      created += 1;
    }
    return { created };
  },
});
