import { createClerkClient } from "@clerk/backend";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

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

/** Clerk session without clerkMiddleware (hangs under Next 16 proxy). */
async function requireClerkUserId(req: Request) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new UploadThingError("Clerk not configured");

  const clerk = createClerkClient({
    secretKey,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
  const requestState = await clerk.authenticateRequest(req, {
    authorizedParties: authorizedParties(),
  });

  if (!requestState.isSignedIn) {
    const detail = String(requestState.reason);
    console.error("[uploadthing] Clerk authenticateRequest failed:", detail);
    throw new UploadThingError(`Unauthorized (${detail})`);
  }

  const userId = requestState.toAuth().userId;
  if (!userId) throw new UploadThingError("Unauthorized");
  return userId;
}

/** Soft cap: uploads started per user per rolling hour (in-memory per instance). */
const uploadHourly = new Map<string, { count: number; resetAt: number }>();

function assertUploadBudget(userId: string) {
  const now = Date.now();
  const row = uploadHourly.get(userId);
  if (!row || row.resetAt <= now) {
    uploadHourly.set(userId, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return;
  }
  if (row.count >= 40) {
    throw new UploadThingError("Límite de subidas por hora. Intenta más tarde.");
  }
  row.count += 1;
}

export const ourFileRouter = {
  listingImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 8,
    },
  })
    .middleware(async ({ req }) => {
      const userId = await requireClerkUserId(req);
      assertUploadBudget(userId);
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
