"use client";

import { useReducedMotion } from "framer-motion";

export function NeonField({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className={`neon-orb neon-orb-a -left-[10%] top-[8%] ${reduce ? "opacity-25" : ""}`}
      />
      <div
        className={`neon-orb neon-orb-b right-[-8%] bottom-[10%] ${reduce ? "opacity-20" : ""}`}
      />
    </div>
  );
}
