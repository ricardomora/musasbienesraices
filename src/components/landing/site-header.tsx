"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function SiteHeader() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const backdrop = useTransform(
    scrollY,
    [0, 80],
    ["rgba(5,8,10,0)", "rgba(5,8,10,0.72)"],
  );

  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-20"
      style={reduce ? undefined : { backgroundColor: backdrop }}
      initial={reduce ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 backdrop-blur-md sm:px-8">
        <Link
          href="#inicio"
          className="interactive-surface font-display text-lg tracking-tight text-white/95"
        >
          Musas
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white/75">
          <a
            href="#problema"
            className="interactive-surface hidden hover:text-white sm:inline"
          >
            El problema
          </a>
          <a
            href="#diferencia"
            className="interactive-surface hidden hover:text-white sm:inline"
          >
            Musas
          </a>
          <a
            href="#acceso"
            className="interactive-surface rounded-md border border-white/25 bg-white/5 px-3 py-1.5 text-white backdrop-blur-sm hover:border-neon/45 hover:bg-white/10"
          >
            Acceso
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
