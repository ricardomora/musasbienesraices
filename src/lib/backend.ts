/** True when Musas Convex + Clerk public keys are present (separate from Biosite). */
export function isMusasBackendConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  );
}

export const BACKEND_CONFIGURED = isMusasBackendConfigured();
