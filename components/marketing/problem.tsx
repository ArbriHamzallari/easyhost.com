"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "motion/react";

export function Problem() {
  const t = useTranslations();

  const oldPoints = [
    t("landing.problem.old.p1"),
    t("landing.problem.old.p2"),
    t("landing.problem.old.p3"),
    t("landing.problem.old.p4"),
  ];
  const newPoints = [
    t("landing.problem.new.p1"),
    t("landing.problem.new.p2"),
    t("landing.problem.new.p3"),
    t("landing.problem.new.p4"),
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Section atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 85% 8%, rgba(225,106,74,0.06), transparent 60%), radial-gradient(700px 500px at 8% 90%, rgba(244,228,214,0.55), transparent 60%), linear-gradient(180deg, #FAF8F6 0%, #F7F3EF 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
        {/* Optional section heading (kept short so the cards do the talking) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
            {t("landing.problem.eyebrow")}
          </div>
          <h2 className="mt-3 font-display text-[40px] font-medium leading-[1.05] text-[var(--ink)] sm:text-[48px]">
            {t("landing.problem.title")}{" "}
            <span className="serif-emph text-[var(--primary)]">
              {t("landing.problem.titleEmph")}
            </span>
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-[var(--muted)]">
            {t("landing.problem.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-7">
          <ComparePanel
            tone="old"
            label={t("landing.problem.old.label")}
            headline1={t("landing.problem.old.headline1")}
            headline2={t("landing.problem.old.headline2")}
            subtext={t("landing.problem.old.subtext")}
            points={oldPoints}
            imageSrc="/images/compare-old.png"
            imageAlt="A dim minibar with a handwritten tally sheet, spilled chips, scattered nuts and crumpled euro notes"
          />
          <ComparePanel
            tone="new"
            label={t("landing.problem.new.label")}
            headline1={t("landing.problem.new.headline1")}
            headline2={t("landing.problem.new.headline2")}
            subtext={t("landing.problem.new.subtext")}
            points={newPoints}
            imageSrc="/images/compare-new.png"
            imageAlt="A warmly lit, well-stocked minibar beside a QR welcome card inviting guests to scan and order"
          />
        </div>
      </div>
    </section>
  );
}

interface ComparePanelProps {
  tone: "old" | "new";
  label: string;
  headline1: string;
  headline2: string;
  subtext: string;
  points: string[];
  imageSrc: string;
  imageAlt: string;
}

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.05 + i * 0.08,
    },
  }),
};

function ComparePanel({
  tone,
  label,
  headline1,
  headline2,
  subtext,
  points,
  imageSrc,
  imageAlt,
}: ComparePanelProps) {
  const isNew = tone === "new";

  return (
    <motion.article
      variants={panelVariants}
      custom={isNew ? 1 : 0}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[32px] p-7 sm:p-9"
      style={{
        background: isNew
          ? "linear-gradient(180deg, #F7EFE6 0%, #F4EAE0 100%)"
          : "linear-gradient(180deg, #F1ECE6 0%, #ECE5DE 100%)",
        boxShadow: isNew
          ? "0 1px 2px rgba(28,25,23,0.04), 0 28px 60px -24px rgba(140,58,37,0.20), inset 0 1px 0 rgba(255,255,255,0.55)"
          : "0 1px 2px rgba(28,25,23,0.03), 0 28px 60px -28px rgba(28,25,23,0.22), inset 0 1px 0 rgba(255,255,255,0.45)",
      }}
    >
      {/* Warm halo behind the new panel — gives it visible emotional edge */}
      {isNew && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(225,106,74,0.30), transparent 70%)",
          }}
        />
      )}
      {/* Cooler haze on the old panel — subtle, drains warmth */}
      {!isNew && (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(120,114,108,0.20), transparent 70%)",
          }}
        />
      )}

      {/* Chip */}
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)] shadow-[0_1px_2px_rgba(28,25,23,0.05)] ring-1 ring-[var(--border)] backdrop-blur">
          {isNew ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)]">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 5.2l2 2 4-4"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--muted-light)]/40">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path
                  d="M3 3l4 4M7 3l-4 4"
                  stroke="#8b8278"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          )}
          {label}
        </span>
      </div>

      {/* Headline */}
      <h3 className="relative mt-6 font-display text-[28px] font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--ink)] sm:text-[32px]">
        {headline1}
        <br />
        <span
          className={
            isNew ? "serif-emph text-[var(--primary)]" : "text-[var(--ink)]"
          }
        >
          {headline2}
        </span>
      </h3>

      <p className="relative mt-3 max-w-md text-[15px] leading-[1.55] text-[var(--muted)]">
        {subtext}
      </p>

      {/* Image */}
      <div className="relative mt-7">
        {/* ambient glow behind the image — stronger on the new panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-0 opacity-80 blur-2xl"
          style={{
            background: isNew
              ? "radial-gradient(60% 80% at 50% 50%, rgba(225,106,74,0.28), transparent 70%)"
              : "radial-gradient(60% 80% at 50% 50%, rgba(28,25,23,0.20), transparent 70%)",
          }}
        />
        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
          className="relative aspect-[460/285] w-full overflow-hidden rounded-[20px] ring-1 ring-[var(--ink)]/[0.06]"
          style={{
            boxShadow: isNew
              ? "0 8px 14px -8px rgba(28,25,23,0.18), 0 30px 60px -24px rgba(140,58,37,0.35)"
              : "0 8px 14px -8px rgba(28,25,23,0.20), 0 30px 60px -24px rgba(28,25,23,0.35)",
          }}
        >
          <motion.div
            initial={{ scale: 1.04 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              quality={90}
              sizes="(max-width: 1024px) 92vw, 540px"
              className={`object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${
                isNew ? "" : "saturate-[0.85]"
              }`}
            />
          </motion.div>

          {/* Inner ring highlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px]"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.18)",
            }}
          />

          {/* Cinematic overlay — colder/darker on old, warmer rim on new */}
          {isNew ? (
            <>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.22) 100%)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1/3"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,180,120,0.16) 0%, rgba(255,180,120,0) 100%)",
                  mixBlendMode: "screen",
                }}
              />
            </>
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-0 bg-[#1c1917]/15"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.40) 100%)",
                }}
              />
            </>
          )}
        </motion.div>
      </div>

      {/* Checklist */}
      <ul className="relative mt-7 flex flex-1 flex-col gap-3.5">
        {points.map((p, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15 + i * 0.06,
            }}
            className="flex items-start gap-3 text-[14.5px] text-[var(--ink)]"
          >
            {isNew ? (
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] shadow-[0_2px_6px_-2px_rgba(225,106,74,0.6)]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2.5 6.2l2.4 2.4 4.6-4.8"
                    stroke="#fff"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : (
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-[var(--border)]">
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 3l4 4M7 3l-4 4"
                    stroke="#8b8278"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            )}
            <span className={isNew ? "" : "text-[var(--muted)]"}>{p}</span>
          </motion.li>
        ))}
      </ul>
    </motion.article>
  );
}
