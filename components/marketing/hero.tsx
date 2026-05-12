import { getTranslations } from "next-intl/server";
import { WaitlistForm } from "./waitlist-form";
import { HeroScene } from "./hero-scene";

export async function Hero() {
  const t = await getTranslations();

  return (
    <section id="waitlist" className="relative overflow-hidden">
      {/* Refined ambient page-canvas backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 600px at 82% 8%, rgba(225,106,74,0.10), transparent 60%), radial-gradient(800px 500px at 10% 30%, rgba(244,228,214,0.6), transparent 60%), linear-gradient(180deg, #FAF8F6 0%, #FAF8F6 55%, #F4EFE9 100%)",
        }}
      />
      {/* Very fine grain to add depth without noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-28 pt-16 sm:pb-32 sm:pt-20 lg:grid-cols-[45fr_55fr] lg:gap-14 lg:pb-36 lg:pt-24">
        {/* Left: copy (45%) */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            {t("landing.hero.eyebrow")}
          </div>

          <h1 className="mt-6 font-display text-[44px] font-medium leading-[0.98] tracking-[-0.025em] text-[var(--ink)] sm:text-[56px] lg:text-[64px]">
            {t("landing.hero.headline")}
            <br />
            <span className="serif-emph text-[var(--primary)]">
              {t("landing.hero.headlineEmph")}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-[1.55] text-[var(--muted)]">
            {t("landing.hero.subheadline")}
          </p>

          <div className="mt-8 max-w-md">
            <WaitlistForm source="hero" />
            <div className="mt-4 flex items-center gap-2 text-[13px] text-[var(--muted)]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M11.5 4L5.75 9.75L2.5 6.5"
                  stroke="#2f7d3b"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("landing.hero.trust")}
            </div>
          </div>
        </div>

        {/* Right: cinematic photograph (55%, overflows slightly past the column on lg+) */}
        <div className="relative lg:-mr-12 xl:-mr-20">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
