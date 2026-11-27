import { createClerkClient } from "@clerk/backend";
import { convexSiteUrl } from "@/lib/convex-site";

function authorizedParties(): string[] {
  const parties = new Set([
    "http://127.0.0.1:4321",
    "http://localhost:4321",
    "http://0.0.0.0:4321",
    "https://www.musasbienesraices.com",
    "https://musasbienesraices.com",
  ]);
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (site) parties.add(site);
  return [...parties];
}

/**
 * Sync Clerk profile → Convex with real email (JWT template may omit email).
 * Calls Convex HTTP action (internal mutation) — not a public Convex mutation.
 */
export async function POST(req: Request) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const syncSecret = process.env.USER_SYNC_SECRET;
  const siteUrl = convexSiteUrl();
  if (!secretKey || !syncSecret || !siteUrl) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const clerk = createClerkClient({
    secretKey,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
  const requestState = await clerk.authenticateRequest(req, {
    authorizedParties: authorizedParties(),
  });
  if (!requestState.isSignedIn) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { userId } = requestState.toAuth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = await clerk.users.getUser(userId);
  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return Response.json({ error: "no_email" }, { status: 400 });
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const res = await fetch(`${siteUrl}/internal/sync-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-musas-sync-secret": syncSecret,
    },
    body: JSON.stringify({
      clerkId: userId,
      email,
      name: name || undefined,
      avatarUrl: user.imageUrl || undefined,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: "sync_failed", detail: text.slice(0, 200) },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, email });
}
