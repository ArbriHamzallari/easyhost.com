"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "motion/react";

type Tone = "warm" | "cream";

interface Step {
  kicker: string;
  label: string;
  duration: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  tone: Tone;
}

export function HowItWorks() {
  const t = useTranslations();

  const steps: Step[] = [
    {
      kicker: t("landing.how.step1.kicker"),
      label: t("landing.how.step1.label"),
      duration: t("landing.how.step1.duration"),
      title: t("landing.how.step1.title"),
      body: t("landing.how.step1.body"),
      imageSrc: "/images/how-stock.png",
      imageAlt: t("landing.how.step1.imageAlt"),
      tone: "cream",
    },
    {
      kicker: t("landing.how.step2.kicker"),
      label: t("landing.how.step2.label"),
      duration: t("landing.how.step2.duration"),
      title: t("landing.how.step2.title"),
      body: t("landing.how.step2.body"),
      imageSrc: "/images/how-qr.png",
      imageAlt: t("landing.how.step2.imageAlt"),
      tone: "warm",
    },
    {
      kicker: t("landing.how.step3.kicker"),
      label: t("landing.how.step3.label"),
      duration: t("landing.how.step3.duration"),
      title: t("landing.how.step3.title"),
      body: t("landing.how.step3.body"),
      imageSrc: "/images/how-payout.png",
      imageAlt: t("landing.how.step3.imageAlt"),
      tone: "warm",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden"
    >
      {/* Atmospheric background - warm hospitality, ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(180deg, #FAF8F6 0%, #F7F3EF 45%, #F3EEE8 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 520px at 88% 12%, rgba(225,106,74,0.08), transparent 60%), radial-gradient(800px 600px at 6% 88%, rgba(244,228,214,0.55), transparent 65%), radial-gradient(600px 420px at 50% 50%, rgba(225,106,74,0.04), transparent 70%)",
        }}
      />
      {/* Subtle grain for film-like depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-28 sm:py-32 lg:py-40">
        {/* Editorial header */}
        <Header />

        {/* Step rail */}
        <div className="relative mt-20 sm:mt-24">
          {/* Flowing gradient connector - only on lg */}
          <Connector />

          <div className="relative grid gap-10 sm:gap-12 lg:grid-cols-3 lg:gap-8 xl:gap-10">
            {steps.map((step, i) => (
              <StepCard key={i} index={i} step={step} />
            ))}
          </div>
        </div>

        {/* Footer KPI strip */}
        <Footnote />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                            */
/* ------------------------------------------------------------------ */

function Header() {
  const t = useTranslations();
  return (
    <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] shadow-[0_1px_2px_rgba(28,25,23,0.05)] ring-1 ring-[var(--border)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_10px_rgba(225,106,74,0.7)]" />
          {t("landing.how.eyebrow")}
          <span className="ml-1 text-[var(--muted-light)]">·</span>
          <span className="text-[var(--muted)] normal-case tracking-normal">
            {t("landing.how.chip")}
          </span>
        </span>

        <h2 className="mt-6 font-display text-[44px] font-medium leading-[1.02] tracking-[-0.025em] text-[var(--ink)] sm:text-[56px] lg:text-[64px]">
          {t("landing.how.title")}
          <br />
          <span className="serif-emph text-[var(--primary)]">
            {t("landing.how.titleEmph")}
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="lg:pb-3"
      >
        <p className="max-w-md text-[17px] leading-[1.6] text-[var(--muted)] sm:text-[18px]">
          {t("landing.how.subtitle")}
        </p>
        <div className="mt-6 flex items-center gap-3 text-[13px] text-[var(--muted)]">
          <span className="flex h-7 items-center gap-2 rounded-full bg-white/70 px-3 ring-1 ring-[var(--border)] backdrop-blur">
            <Dot />
            <span className="font-medium text-[var(--ink)]">No card reader</span>
          </span>
          <span className="flex h-7 items-center gap-2 rounded-full bg-white/70 px-3 ring-1 ring-[var(--border)] backdrop-blur">
            <Dot />
            <span className="font-medium text-[var(--ink)]">No app for guests</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function Dot() {
  return (
    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_rgba(225,106,74,0.6)]" />
  );
}

/* ------------------------------------------------------------------ */
/*  Connector - animated flowing gradient line across the 3 cards     */
/* ------------------------------------------------------------------ */

function Connector() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[210px] hidden h-[2px] lg:block"
    >
      <svg
        viewBox="0 0 1000 8"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="how-connector" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(225,106,74,0)" />
            <stop offset="12%" stopColor="rgba(225,106,74,0.55)" />
            <stop offset="50%" stopColor="rgba(225,106,74,0.85)" />
            <stop offset="88%" stopColor="rgba(225,106,74,0.55)" />
            <stop offset="100%" stopColor="rgba(225,106,74,0)" />
          </linearGradient>
          <filter id="how-glow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>
        <motion.path
          d="M 0 4 L 1000 4"
          stroke="url(#how-connector)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M 0 4 L 1000 4"
          stroke="url(#how-connector)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          filter="url(#how-glow)"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step card                                                         */
/* ------------------------------------------------------------------ */

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1 + i * 0.12,
    },
  }),
};

interface StepCardProps {
  step: Step;
  index: number;
}

function StepCard({ step, index }: StepCardProps) {
  // Tone-specific styling - two warm hospitality variants (step 3 matches step 2)
  const surface =
    step.tone === "warm"
      ? "linear-gradient(180deg, #FBF3EA 0%, #F4E8DA 100%)"
      : "linear-gradient(180deg, #FCFAF7 0%, #F5EFE6 100%)";

  const shadow =
    step.tone === "warm"
      ? "0 1px 2px rgba(28,25,23,0.04), 0 32px 70px -28px rgba(140,58,37,0.28), inset 0 1px 0 rgba(255,255,255,0.7)"
      : "0 1px 2px rgba(28,25,23,0.04), 0 32px 70px -28px rgba(28,25,23,0.22), inset 0 1px 0 rgba(255,255,255,0.75)";

  const imageSurface =
    step.tone === "warm"
      ? "linear-gradient(180deg, #F8EFE3 0%, #EFE2D0 100%)"
      : "linear-gradient(180deg, #FAF5EE 0%, #F1E8DA 100%)";

  const haloIntensity = step.tone === "warm" ? 0.28 : 0.18;

  return (
    <motion.article
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[32px] p-6 sm:p-7"
      style={{ background: surface, boxShadow: shadow }}
    >
      {/* Soft warm halo bleeding from the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(closest-side, rgba(225,106,74,${haloIntensity}), transparent 70%)`,
          opacity: 0.85,
        }}
      />

      {/* Top row: glassmorphic step badge + meta */}
      <div className="relative flex items-center justify-between">
        <StepBadge kicker={step.kicker} />
        <div className="flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)] ring-1 ring-[var(--border)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_rgba(225,106,74,0.6)]" />
          {step.label}
        </div>
      </div>

      {/* Image stage */}
      <div className="relative mt-7">
        {/* Ambient under-glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-4 -inset-y-3 -z-0 opacity-90 blur-3xl"
          style={{
            background: `radial-gradient(60% 70% at 50% 55%, rgba(225,106,74,${
              step.tone === "warm" ? 0.28 : 0.16
            }), transparent 70%)`,
          }}
        />

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] ring-1 ring-[var(--ink)]/[0.06]"
          style={{
            background: imageSurface,
            boxShadow:
              "0 10px 20px -10px rgba(28,25,23,0.18), 0 28px 60px -24px rgba(140,58,37,0.32)",
          }}
        >
          <motion.div
            initial={{ scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={step.imageSrc}
              alt={step.imageAlt}
              fill
              quality={90}
              sizes="(max-width: 1024px) 92vw, 380px"
              className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              priority={index === 0}
            />
          </motion.div>

          {/* Inner highlight ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[22px]"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08)",
            }}
          />

          {/* Cinematic vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 60%, rgba(28,25,23,0.18) 100%)",
            }}
          />

          {/* Warm rim light along top */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,200,150,0.16) 0%, rgba(255,200,150,0) 100%)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>
      </div>

      {/* Title + body */}
      <div className="relative mt-7 flex flex-1 flex-col">
        <h3 className="font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--ink)] sm:text-[28px]">
          {step.title}
        </h3>
        <p className="mt-3 text-[15.5px] leading-[1.6] text-[var(--muted)]">
          {step.body}
        </p>

        {/* Duration footer */}
        <div className="mt-6 flex items-center gap-3 pt-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
          <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            {step.duration}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Glassmorphic step number badge                                    */
/* ------------------------------------------------------------------ */

function StepBadge({ kicker }: { kicker: string }) {
  return (
    <div className="relative">
      {/* Glow halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -m-2 rounded-full blur-xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(225,106,74,0.45), transparent 70%)",
        }}
      />
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/80 font-display text-[18px] font-semibold tracking-[-0.02em] text-[var(--ink)] ring-1 ring-[var(--primary)]/20 backdrop-blur-md"
        style={{
          boxShadow:
            "0 8px 24px -10px rgba(28,25,23,0.20), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <span>{kicker}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footnote KPI strip                                                */
/* ------------------------------------------------------------------ */

function Footnote() {
  const t = useTranslations();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-20 sm:mt-24"
    >
      <div
        className="relative mx-auto flex max-w-3xl flex-col items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-4 text-center sm:flex-row sm:gap-4 sm:px-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.45) 100%)",
          boxShadow:
            "0 1px 2px rgba(28,25,23,0.04), 0 18px 40px -20px rgba(140,58,37,0.22), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[var(--border)]"
        />
        <span className="text-[13px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          {t("landing.how.footnote")}
        </span>
        <span className="font-display text-[20px] font-semibold tracking-tight text-[var(--ink)] sm:text-[22px]">
          {t("landing.how.footnoteValue")}
        </span>
        <span className="hidden text-[var(--muted-light)] sm:inline">·</span>
        <span className="text-[14px] text-[var(--muted)]">
          {t("landing.how.footnoteHint")}
        </span>
      </div>
    </motion.div>
  );
}
