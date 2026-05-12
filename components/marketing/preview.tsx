import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";

const MOCKUP_WIDTH = 1024;
const MOCKUP_HEIGHT = 593;

export async function Preview() {
  const t = await getTranslations();

  return (
    <section className="relative overflow-hidden bg-[var(--ink)]">
      {/* CSS-only ambient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(900px 500px at 80% 10%, rgba(225,106,74,0.20), transparent 60%), radial-gradient(700px 400px at 10% 100%, rgba(140,58,37,0.30), transparent 60%), linear-gradient(180deg, #1c1917 0%, #221c18 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
        <Reveal>
          <div className="max-w-2xl">
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#F4E4D6]/80">
              {t("landing.guest.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-[40px] font-medium leading-[1.05] text-white sm:text-[52px]">
              {t("landing.guest.title")}{" "}
              <span className="serif-emph text-[#F4E4D6]">
                {t("landing.guest.titleEmph")}
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-[1.55] text-white/70">
              {t("landing.guest.subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="relative mt-14 sm:mt-16">
          {/* Warm glow under the mockup, tied to primary */}
          <div
            aria-hidden
            className="absolute -bottom-6 left-1/2 h-[min(40%,220px)] w-[min(92%,720px)] max-w-3xl -translate-x-1/2 rounded-full bg-[#FF5A1F]/[0.14] blur-3xl sm:h-[min(45%,260px)]"
          />
          <Reveal delay={100} className="relative">
            <figure className="relative mx-auto max-w-5xl">
              <div className="relative overflow-hidden rounded-[20px] bg-[#1c1917] shadow-[0_28px_80px_-18px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-white/[0.09] sm:rounded-[24px] lg:rounded-[28px]">
                <Image
                  src="/images/guest-experience-mockup.png"
                  alt={t("landing.guest.imageAlt")}
                  width={MOCKUP_WIDTH}
                  height={MOCKUP_HEIGHT}
                  className="block h-auto w-full object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1024px"
                  quality={90}
                />
                {/* Blend edges into the section: vignette + warm rim */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_80px_rgba(12,10,9,0.35),inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#221c18]/75 via-transparent to-transparent sm:h-[18%]"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
