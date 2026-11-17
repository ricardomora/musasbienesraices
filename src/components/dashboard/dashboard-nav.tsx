"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationsBell } from "@/components/dashboard/notifications-bell";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard/inmuebles", label: "Mis inmuebles" },
  { href: "/dashboard/mensajes", label: "Mensajes" },
  { href: "/dashboard/preferencial", label: "Preferencial" },
  { href: "/dashboard/suscripciones", label: "Suscripciones" },
  { href: "/dashboard/cuenta", label: "Cuenta" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const me = useQuery(
    api.users.me,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const isAdmin = me?.role === "admin";

  return (
    <nav className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 text-sm sm:px-8">
      <Link href="/" className="font-semibold text-foreground">
        musas<span className="text-neon">.</span>
      </Link>
      {LINKS.map((l) => {
        const active =
          pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              active
                ? "text-neon"
                : "text-muted-foreground hover:text-neon",
            )}
          >
            {l.label}
          </Link>
        );
      })}
      {isAdmin ? (
        <Link
          href="/admin"
          className={cn(
            pathname.startsWith("/admin")
              ? "text-neon"
              : "text-muted-foreground hover:text-neon",
          )}
        >
          Admin
        </Link>
      ) : null}
      <div className="ml-auto flex items-center gap-3">
        {isSignedIn ? <NotificationsBell /> : null}
        <ThemeToggle compact />
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground"
        >
          Explorar
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8",
            },
          }}
        />
      </div>
    </nav>
  );
}
