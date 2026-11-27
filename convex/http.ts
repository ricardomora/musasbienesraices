import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

function assertSyncSecret(request: Request) {
  const expected = process.env.USER_SYNC_SECRET;
  const got = request.headers.get("x-musas-sync-secret");
  if (!expected || !got || got !== expected) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}

/** Next webhook /api/me/sync and /api/clerk → sync user (server-only). */
http.route({
  path: "/internal/sync-user",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const denied = assertSyncSecret(request);
    if (denied) return denied;
    let body: {
      clerkId?: string;
      email?: string;
      name?: string;
      avatarUrl?: string;
    };
    try {
      body = await request.json();
    } catch {
      return new Response("Bad Request", { status: 400 });
    }
    if (!body.clerkId || !body.email) {
      return new Response("Missing clerkId or email", { status: 400 });
    }
    await ctx.runMutation(internal.users.syncUser, {
      clerkId: body.clerkId,
      email: body.email,
      name: body.name,
      avatarUrl: body.avatarUrl,
    });
    return Response.json({ ok: true });
  }),
});

/** Ops wipe — same secret header; prefer admin UI clearMarketplaceData. */
http.route({
  path: "/internal/clear-marketplace",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const denied = assertSyncSecret(request);
    if (denied) return denied;
    const counts = await ctx.runMutation(
      internal.seed.clearMarketplaceDataWithSecret,
      {},
    );
    return Response.json({ ok: true, counts });
  }),
});

export default http;
