import { Suspense, type ReactNode } from "react";
import { AuthGate } from "@/components/auth-gate";

export const instant = false;

export default function PublicarLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}
