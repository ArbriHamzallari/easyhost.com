import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { GuestPhone } from "./guest-phone";

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

        <div className="relative mt-16 flex items-end justify-center gap-6 sm:gap-10">
          <Reveal delay={80} className="hidden sm:block">
            <div className="origin-bottom rotate-[-6deg] scale-[0.82] opacity-90">
              <GuestPhone scale={1} showCheckout={false} />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="origin-bottom translate-y-[-12px] scale-[0.95]">
              <GuestPhone scale={1} />
            </div>
          </Reveal>
          <Reveal delay={240} className="hidden sm:block">
            <div className="origin-bottom rotate-[6deg] scale-[0.82] opacity-90">
              <GuestPhone scale={1} showCheckout={false} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
