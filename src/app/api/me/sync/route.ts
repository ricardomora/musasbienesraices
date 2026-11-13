import { createClerkClient } from "@clerk/backend";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

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
 * Called from Providers after sign-in so ADMIN_EMAILS / role resolve correctly.
 */
export async function POST(req: Request) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const syncSecret = process.env.USER_SYNC_SECRET;
  if (!secretKey || !convexUrl || !syncSecret) {
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
  const convex = new ConvexHttpClient(convexUrl);
  await convex.mutation(api.users.syncUser, {
    clerkId: userId,
    email,
    name: name || undefined,
    avatarUrl: user.imageUrl || undefined,
    syncSecret,
  });

  return Response.json({ ok: true, email });
}
