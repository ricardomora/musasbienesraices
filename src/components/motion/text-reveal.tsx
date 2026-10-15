"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  mode?: "words" | "lines";
};

export function TextReveal({
  text,
  className,
  as: Tag = "p",
  delay = 0,
  mode = "words",
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const parts =
    mode === "words" ? text.split(" ") : text.split("\n").filter(Boolean);

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="flex flex-wrap">
        {parts.map((part, index) => (
          <span key={`${part}-${index}`} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "110%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.75,
                delay: delay + index * 0.045,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {part}
              {mode === "words" && index < parts.length - 1 ? "\u00A0" : null}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
