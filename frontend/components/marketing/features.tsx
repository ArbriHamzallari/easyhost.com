"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";

type FeatureItem = {
  key: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  /** Optional subtle accent tint behind the illustration */
  glow?: string;
};

export function Features() {
  const t = useTranslations();

  const small: FeatureItem[] = [
    {
      key: "multiProperty",
      title: t("landing.features.items.multiProperty.title"),
      body: t("landing.features.items.multiProperty.body"),
      image: "/images/features/multi-property.png",
      alt: "A miniature white apartment building with a warm orange home pin, multi-property management",
      glow: "rgba(28,25,23,0.12)",
    },
    {
      key: "analytics",
      title: t("landing.features.items.analytics.title"),
      body: t("landing.features.items.analytics.body"),
      image: "/images/features/analytics.png",
      alt: "A 3D pie chart with warm orange slices, real-time analytics",
      glow: "rgba(225,106,74,0.22)",
    },
    {
      key: "inventory",
      title: t("landing.features.items.inventory.title"),
      body: t("landing.features.items.inventory.body"),
      image: "/images/features/inventory.png",
      alt: "A polished bronze notification bell with orange ringing strokes, inventory alerts",
      glow: "rgba(225,106,74,0.20)",
    },
    {
      key: "multilingual",
      title: t("landing.features.items.multilingual.title"),
      body: t("landing.features.items.multilingual.body"),
      image: "/images/features/multilingual.png",
      alt: "A bronze globe with multilingual greeting bubbles: Hello, Bonjour, Hola, Hallo",
      glow: "rgba(80,120,170,0.18)",
    },
    {
      key: "branding",
      title: t("landing.features.items.branding.title"),
      body: t("landing.features.items.branding.body"),
      image: "/images/features/branding.png",
      alt: "A wooden artist palette and brush beside a Sunset Villa logo card, custom branding",
      glow: "rgba(196,140,80,0.20)",
    },
    {
      key: "favorites",
      title: t("landing.features.items.favorites.title"),
      body: t("landing.features.items.favorites.body"),
      image: "/images/features/favorites.png",
      alt: "A glossy red 3D heart and a Guest Favorite badge with a bronze star, guest favorites",
      glow: "rgba(225,80,80,0.22)",
    },
  ];

  return (
    <section id="features" className="relative overflow-clip">
      {/* Atmospheric, layered, warm background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 520px at 8% 10%, rgba(244,228,214,0.55), transparent 60%), radial-gradient(700px 480px at 92% 8%, rgba(225,106,74,0.06), transparent 60%), radial-gradient(900px 600px at 50% 100%, rgba(244,228,214,0.45), transparent 60%), linear-gradient(180deg, #FAF8F6 0%, #F7F3EF 60%, #F3EEE8 100%)",
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
        {/* Section heading - editorial, restrained, balanced */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)] shadow-[0_1px_2px_rgba(28,25,23,0.04)] ring-1 ring-[var(--border)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            {t("landing.features.eyebrow")}
          </div>
          <h2 className="mt-5 font-display text-[30px] font-medium leading-[1.04] tracking-[-0.025em] text-[var(--ink)] sm:text-[40px] lg:text-[52px]">
            {t("landing.features.title")}{" "}
            <span className="serif-emph text-[var(--primary)]">
              {t("landing.features.titleEmph")}
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-[1.6] text-[var(--muted)] sm:mt-5 sm:text-[17px]">
            {t("landing.features.subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-7">
          {/* Featured payments card - visually dominant */}
          <PaymentsCard
            badge={t("landing.features.items.payments.badge")}
            title={t("landing.features.items.payments.title")}
            body={t("landing.features.items.payments.body")}
            learnMore={t("landing.features.items.payments.learnMore")}
            kpi={t("landing.features.items.payments.kpi")}
            kpiValue={t("landing.features.items.payments.kpiValue")}
          />

          {/* Small cards - image-first, premium, layered */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:gap-7">
            {small.map((s, i) => (
              <FeatureCard key={s.key} item={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Small feature card                                                         */
/* -------------------------------------------------------------------------- */

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.05 + i * 0.07,
    },
  }),
};

function FeatureCard({ item, index }: { item: FeatureItem; index: number }) {
  const glow = item.glow ?? "rgba(225,106,74,0.18)";

  return (
    <motion.article
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FBF7F2 100%)",
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.04), 0 18px 44px -22px rgba(28,25,23,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {/* Hairline gradient border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28px]"
        style={{
          padding: 1,
          background:
            "linear-gradient(180deg, rgba(28,25,23,0.08), rgba(28,25,23,0.02) 30%, rgba(225,106,74,0.10) 100%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Illustration "stage" */}
      <div className="relative px-6 pt-6 sm:px-7 sm:pt-7">
        <div
          className="relative h-[180px] overflow-hidden rounded-[22px] sm:h-[196px]"
          style={{
            background:
              "linear-gradient(180deg, #FAF6F1 0%, #F4ECE2 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(28,25,23,0.04)",
          }}
        >
          {/* Atmospheric warm glow behind illustration */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(60% 70% at 50% 60%, ${glow}, transparent 70%)`,
            }}
          />

          {/* Soft top sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* The illustration itself - generous, floating, premium */}
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1 + index * 0.06,
            }}
            className="relative flex h-full items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.06, y: -3 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="relative h-[150px] w-[150px] sm:h-[164px] sm:w-[164px]"
              style={{
                filter:
                  "drop-shadow(0 14px 18px rgba(28,25,23,0.18)) drop-shadow(0 4px 8px rgba(28,25,23,0.10))",
              }}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                quality={90}
                sizes="(max-width: 640px) 50vw, 220px"
                className="select-none object-contain"
                draggable={false}
              />
            </motion.div>
          </motion.div>

          {/* Subtle inner ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[22px]"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(28,25,23,0.04), inset 0 -16px 30px -14px rgba(28,25,23,0.06)",
            }}
          />
        </div>
      </div>

      {/* Text content - editorial rhythm */}
      <div className="relative flex flex-1 flex-col px-6 pb-7 pt-6 sm:px-7 sm:pb-8">
        <h3 className="font-display text-[20px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--ink)] sm:text-[22px]">
          {item.title}
        </h3>
        <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[var(--muted)]">
          {item.body}
        </p>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* Featured payments card                                                     */
/* -------------------------------------------------------------------------- */

function PaymentsCard({
  badge,
  title,
  body,
  learnMore,
  kpi,
  kpiValue,
}: {
  badge: string;
  title: string;
  body: string;
  learnMore: string;
  kpi: string;
  kpiValue: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[24px] p-5 sm:rounded-[32px] sm:p-7 lg:col-span-5 lg:sticky lg:p-9 lg:top-24"
      style={{
        background:
          "linear-gradient(165deg, #FFF3E8 0%, #FBE7D5 50%, #F5D9C2 100%)",
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.04), 0 36px 80px -28px rgba(140,58,37,0.30), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* Atmospheric warm halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(225,106,74,0.40), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,200,150,0.45), transparent 70%)",
        }}
      />

      {/* Badge */}
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--primary)] shadow-[0_1px_2px_rgba(28,25,23,0.05)] ring-1 ring-[var(--border)] backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]" />
          </span>
          {badge}
        </span>
      </div>

      {/* Headline */}
      <h3 className="relative mt-5 font-display text-[24px] font-semibold leading-[1.06] tracking-[-0.025em] text-[var(--ink)] sm:mt-6 sm:text-[30px] lg:text-[36px]">
        {title}
      </h3>
      <p className="relative mt-4 max-w-md text-[15.5px] leading-[1.6] text-[var(--ink)]/70">
        {body}
      </p>

      <a
        href="#pricing"
        className="relative mt-6 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-[var(--ink)] transition-colors hover:text-[var(--primary)]"
      >
        {learnMore}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </a>

      {/* Premium analytics tile */}
      <div className="relative mt-10">
        {/* Soft glow behind the tile */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-2 -inset-y-3 -z-0 opacity-80 blur-2xl"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 50%, rgba(225,106,74,0.22), transparent 70%)",
          }}
        />

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="relative overflow-hidden rounded-[22px]"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #FFFBF7 100%)",
            boxShadow:
              "0 1px 2px rgba(28,25,23,0.05), 0 28px 60px -24px rgba(140,58,37,0.30), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {/* Hairline gradient border */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[22px]"
            style={{
              padding: 1,
              background:
                "linear-gradient(180deg, rgba(28,25,23,0.08), rgba(225,106,74,0.18) 100%)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <div className="relative p-6 sm:p-7">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  </span>
                  {kpi}
                </div>
                <div className="mt-1.5 font-display text-[32px] font-semibold leading-[1] tracking-[-0.025em] text-[var(--ink)] sm:text-[40px] lg:text-[44px]">
                  {kpiValue}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F3E9] px-2.5 py-1 text-[11px] font-semibold text-[var(--success)] ring-1 ring-[#2f7d3b]/10">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 8l3-3 2 2 3-4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  +12.4%
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  vs. last week
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-5">
              <RevenueChart />
            </div>

            {/* Mini stat row - adds richness, "real product" texture */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <MiniStat label="Orders" value="34" trend="+9%" />
              <MiniStat label="AOV" value="€3.78" trend="+4%" />
              <MiniStat label="Payouts" value="100%" tone="neutral" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

function MiniStat({
  label,
  value,
  trend,
  tone = "positive",
}: {
  label: string;
  value: string;
  trend?: string;
  tone?: "positive" | "neutral";
}) {
  return (
    <div
      className="rounded-[14px] p-3"
      style={{
        background:
          "linear-gradient(180deg, rgba(244,228,214,0.55) 0%, rgba(244,228,214,0.25) 100%)",
        boxShadow: "inset 0 0 0 1px rgba(28,25,23,0.04)",
      }}
    >
      <div className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <div className="font-display text-[18px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
          {value}
        </div>
        {trend && (
          <div
            className={`text-[10.5px] font-semibold ${
              tone === "positive"
                ? "text-[var(--success)]"
                : "text-[var(--muted)]"
            }`}
          >
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}

function RevenueChart() {
  // Smooth, realistic ramp - 30 daily revenue values
  const data = [
    18, 22, 19, 24, 21, 27, 23, 28, 32, 29, 35, 31, 38, 34, 40, 37, 44, 41, 47,
    52, 48, 56, 53, 60, 64, 58, 70, 74, 78, 82,
  ];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 320;
  const h = 96;
  const stepX = w / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / (max - min)) * (h - 14) - 6;
    return [x, y] as const;
  });

  // Smoothed (Catmull-Rom-ish) path for a more premium curve
  const smoothPath = points.reduce((acc, [x, y], i, arr) => {
    if (i === 0) return `M${x.toFixed(2)},${y.toFixed(2)}`;
    const [px, py] = arr[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C${cx.toFixed(2)},${py.toFixed(2)} ${cx.toFixed(
      2,
    )},${y.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`;
  }, "");

  const areaPath = `${smoothPath} L${w},${h} L0,${h} Z`;
  const last = points[points.length - 1];

  return (
    <div className="relative -mx-1">
      {/* Soft glow under the line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 bottom-0 h-12 opacity-60 blur-xl"
        style={{
          background:
            "radial-gradient(60% 100% at 80% 100%, rgba(225,106,74,0.45), transparent 70%)",
        }}
      />
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="relative h-[96px] w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E16A4A" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#E16A4A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rev-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C95636" />
            <stop offset="100%" stopColor="#E16A4A" />
          </linearGradient>
        </defs>

        {/* horizontal grid hints */}
        <g stroke="#1c1917" strokeOpacity="0.05" strokeWidth="1">
          <line x1="0" y1={h * 0.25} x2={w} y2={h * 0.25} />
          <line x1="0" y1={h * 0.55} x2={w} y2={h * 0.55} />
        </g>

        <path d={areaPath} fill="url(#rev-area)" />
        <path
          d={smoothPath}
          fill="none"
          stroke="url(#rev-line)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End point pulse */}
        <circle cx={last[0]} cy={last[1]} r="9" fill="#E16A4A" opacity="0.14" />
        <circle cx={last[0]} cy={last[1]} r="5" fill="#E16A4A" opacity="0.22" />
        <circle cx={last[0]} cy={last[1]} r="3.5" fill="#E16A4A" />
        <circle cx={last[0]} cy={last[1]} r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
