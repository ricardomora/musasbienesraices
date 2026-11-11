"use client";

import { BACKEND_CONFIGURED } from "@/lib/backend";
import { ConvexHomeApp } from "./convex-home-app";
import { HomeApp } from "./home-app";

/** Uses Convex marketplace when Musas keys exist; otherwise local demo seed. */
export function HomeShell() {
  if (BACKEND_CONFIGURED) return <ConvexHomeApp />;
  return <HomeApp />;
}
