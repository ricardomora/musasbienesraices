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
    const detail =
      "reason" in requestState && requestState.reason != null
        ? String(requestState.reason)
        : requestState.status;
    console.error("[uploadthing] Clerk authenticateRequest failed:", detail);
    throw new UploadThingError(`Unauthorized (${detail})`);
  }

  const userId = requestState.toAuth().userId;
  if (!userId) throw new UploadThingError("Unauthorized");
  return userId;
}

export const ourFileRouter = {
  listingImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 12,
    },
  })
    .middleware(async ({ req }) => {
      const userId = await requireClerkUserId(req);
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
