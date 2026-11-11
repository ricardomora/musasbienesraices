"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { BACKEND_CONFIGURED } from "@/lib/backend";

export default function SignUpPage() {
  if (!BACKEND_CONFIGURED) {
    return (
      <main className="mx-auto max-w-md flex-1 px-5 py-20 text-center">
        <h1 className="text-xl font-semibold text-white">Registro no configurado</h1>
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
      <SignUp />
    </main>
  );
}
