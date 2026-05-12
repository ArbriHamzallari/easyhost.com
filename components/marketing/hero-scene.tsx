"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse-tracked parallax: -0.5..0.5 on each axis.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Springy, very subtle motion.
  const springConfig = { stiffness: 80, damping: 18, mass: 0.6 };
  const sx = useSpring(mx, springConfig);
  const sy = useSpring(my, springConfig);

  // Translate the image a few px, rotate a fraction of a degree — restrained.
  const imgX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const imgY = useTransform(sy, [-0.5, 0.5], [-8, 8]);
  const imgRotate = useTransform(sx, [-0.5, 0.5], [-0.6, 0.6]);

  // Counter-parallax for the ambient glow (drifts opposite to phone).
  const glowX = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const glowY = useTransform(sy, [-0.5, 0.5], [10, -10]);

  // Highlight card drifts a touch more than the image for depth.
  const cardX = useTransform(sx, [-0.5, 0.5], [-22, 22]);
  const cardY = useTransform(sy, [-0.5, 0.5], [-14, 14]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  const floatVariants: Variants = {
    rest: { y: 0 },
    float: {
      y: [0, -8, 0],
      transition: {
        duration: 7,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate mx-auto w-full max-w-[680px]"
    >
      {/* Warm ambient halo behind the photograph */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute -inset-x-12 -inset-y-16 -z-10"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(55% 50% at 60% 45%, rgba(225,106,74,0.45) 0%, rgba(225,106,74,0.18) 35%, rgba(225,106,74,0) 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>

      {/* Secondary champagne wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10"
        style={{
          background:
            "radial-gradient(70% 55% at 30% 30%, rgba(244,228,214,0.55) 0%, rgba(244,228,214,0) 70%)",
        }}
      />

      {/* The cinematic photo */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="relative"
      >
        <motion.div
          variants={floatVariants}
          initial="rest"
          animate="float"
          style={{ x: imgX, y: imgY, rotate: imgRotate }}
          className="relative aspect-[3/2] w-full overflow-hidden rounded-[26px] shadow-[0_4px_8px_rgba(28,25,23,0.05),0_40px_80px_-28px_rgba(28,25,23,0.45),0_60px_120px_-40px_rgba(140,58,37,0.35)] ring-1 ring-[var(--ink)]/[0.06]"
        >
          {/* Soft frame inner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 rounded-[26px]"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.18)",
            }}
          />

          <Image
            src="/images/hero-scene.png"
            alt="A premium minibar tray, in-room phone menu, and QR welcome card in a warm sunset-lit hotel suite"
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 92vw, 680px"
            className="object-cover"
          />

          {/* Color-grade vignette: warmer in the highlights, slightly deeper corners */}
          <div
            aria-hidden
            className="absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(110% 80% at 60% 40%, rgba(255,210,170,0.10) 0%, rgba(0,0,0,0) 45%), radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)",
            }}
          />

          {/* Subtle sunset-warm rim along the top */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 z-10 h-1/3"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,180,120,0.18) 0%, rgba(255,180,120,0) 100%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Bottom feather to blend into the page canvas (no harsh edge) */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-20 h-1/4"
            style={{
              background:
                "linear-gradient(180deg, rgba(250,248,246,0) 0%, rgba(250,248,246,0.45) 100%)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Floating live-order card (premium SaaS detail) */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
        style={{ x: cardX, y: cardY }}
        className="absolute -bottom-7 left-3 z-30 w-[228px] origin-bottom-left rotate-[-3deg] rounded-2xl border border-[var(--border)] bg-white/95 p-4 shadow-[0_4px_10px_rgba(28,25,23,0.06),0_24px_60px_-24px_rgba(28,25,23,0.35)] backdrop-blur sm:left-6"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
          </span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            New order · Sunset Villa
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="text-[12.5px] font-semibold text-[var(--ink)]">
              Pretzels · Local craft beer
            </div>
            <div className="text-[11px] text-[var(--muted)]">
              Paid · just now
            </div>
          </div>
          <div className="font-display text-[18px] font-semibold tracking-tight text-[var(--success)]">
            +€12.50
          </div>
        </div>
      </motion.div>

      {/* Floating revenue chip (top-right of image) */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
        style={{ x: cardX, y: cardY }}
        className="absolute -right-2 -top-6 z-30 hidden rotate-[3deg] items-center gap-2 rounded-full border border-[var(--border)] bg-white/95 px-3 py-1.5 shadow-[0_4px_10px_rgba(28,25,23,0.06),0_18px_40px_-20px_rgba(28,25,23,0.3)] backdrop-blur sm:inline-flex sm:-right-4 lg:-right-6"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M2 9.5L5 6.5L7.5 9L12 4"
            stroke="#2f7d3b"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[11.5px] font-semibold tracking-tight text-[var(--ink)]">
          €128.50 today
        </span>
        <span className="rounded-full bg-[#E8F3E9] px-1.5 py-0.5 text-[9.5px] font-semibold text-[var(--success)]">
          +12%
        </span>
      </motion.div>
    </div>
  );
}
