"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type LetterRevealProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function LetterReveal({
  text,
  className,
  delay = 0,
}: LetterRevealProps) {
  const reduce = useReducedMotion();
  const chars = Array.from(text);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline-flex flex-wrap", className)} aria-label={text}>
      {chars.map((char, index) => (
        <span key={`${char}-${index}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "115%", rotate: 6, opacity: 0 }}
            animate={{ y: "0%", rotate: 0, opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: delay + index * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
            aria-hidden
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
