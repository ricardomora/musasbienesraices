"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import { safeRedirectPath } from "@/lib/clerk-redirect";

function SignInWithRedirect() {
  const searchParams = useSearchParams();
  const redirect = safeRedirectPath(searchParams.get("redirect_url"));

  return (
    <SignIn
      forceRedirectUrl={redirect ?? undefined}
      fallbackRedirectUrl={redirect ?? "/"}
    />
  );
}

export default function SignInPage() {
  if (!BACKEND_CONFIGURED) {
    return (
      <main className="mx-auto max-w-md flex-1 px-5 py-20 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Login no configurado
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Crea una app Clerk nueva para Musas y completa{" "}
          <code className="text-neon">.env.local</code>.
        </p>
        <Link href="/" className="mt-6 inline-block text-neon">
          Volver
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-16">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando…</p>}>
        <SignInWithRedirect />
      </Suspense>
    </main>
  );
}
