import { Suspense, type ReactNode } from "react";
import { AdminGate } from "@/components/auth/admin-gate";

export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}