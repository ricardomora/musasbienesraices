import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { convexSiteUrl } from "@/lib/convex-site";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const syncSecret = process.env.USER_SYNC_SECRET;
  const siteUrl = convexSiteUrl();

  if (!WEBHOOK_SECRET || !syncSecret || !siteUrl) {
    return new Response("Webhook or Convex not configured for Musas", {
      status: 500,
    });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as WebhookEvent;
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address;
    if (!email || !id) {
      return new Response("Missing email or user id", { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ");
    const res = await fetch(`${siteUrl}/internal/sync-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-musas-sync-secret": syncSecret,
      },
      body: JSON.stringify({
        clerkId: id,
        email,
        name: name || undefined,
        avatarUrl: image_url || undefined,
      }),
    });
    if (!res.ok) {
      return new Response("Convex sync failed", { status: 502 });
    }
  }

  return new Response("ok", { status: 200 });
}
