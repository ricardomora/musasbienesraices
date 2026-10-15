"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ParallaxMediaProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  scaleFrom?: number;
  scaleTo?: number;
};

export function ParallaxMedia({
  src,
  alt,
  priority = false,
  className,
  imageClassName,
  sizes = "100vw",
  scaleFrom = 1.12,
  scaleTo = 1,
}: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, scaleTo]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { scale, y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={cn("object-cover object-center", imageClassName)}
          sizes={sizes}
        />
      </motion.div>
    </div>
  );
}
