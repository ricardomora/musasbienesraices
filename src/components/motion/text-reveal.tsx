"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  mode?: "words" | "lines";
  trigger?: "view" | "mount";
};

export function TextReveal({
  text,
  className,
  as: Tag = "p",
  delay = 0,
  stagger = 0.055,
  mode = "words",
  trigger = "view",
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const parts =
    mode === "words" ? text.split(" ") : text.split("\n").filter(Boolean);

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const motionProps =
    trigger === "mount"
      ? {
          initial: { y: "118%", opacity: 0 },
          animate: { y: "0%", opacity: 1 },
        }
      : {
          initial: { y: "118%", opacity: 0 },
          whileInView: { y: "0%", opacity: 1 },
          viewport: { once: true, amount: 0.55 },
        };

  return (
    <Tag className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="flex flex-wrap">
        {parts.map((part, index) => (
          <span
            key={`${part}-${index}`}
            className="overflow-hidden inline-block [clip-path:inset(0_-2%_-8%_-2%)]"
          >
            <motion.span
              className="inline-block will-change-transform"
              {...motionProps}
              transition={{
                duration: 0.95,
                delay: delay + index * stagger,
                ease: [0.16, 1, 0.3, 1],
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
