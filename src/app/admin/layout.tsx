import { Suspense, type ReactNode } from "react";
import { AuthGate } from "@/components/auth-gate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}