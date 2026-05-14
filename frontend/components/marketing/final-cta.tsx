import { getTranslations } from "next-intl/server";
import { Reveal } from "@/frontend/components/ui/reveal";
import { WaitlistForm } from "./waitlist-form";

export async function FinalCta() {
  const t = await getTranslations();
  return (
    <section className="bg-[var(--canvas)]">
      <div className="mx-auto max-w-7xl px-6 pb-24 sm:pb-28 lg:pb-32">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[28px] p-10 sm:p-14 lg:p-20"
            style={{
              background:
                "radial-gradient(800px 500px at 90% 0%, rgba(225,106,74,0.55), transparent 60%), radial-gradient(700px 500px at 10% 100%, rgba(140,58,37,0.5), transparent 60%), linear-gradient(135deg, #1c1917 0%, #2a201b 50%, #3a221a 100%)",
            }}
          >
            {/* grain */}
            <div className="grain" />
            {/* light streak */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[20%] -top-[40%] h-[140%] w-[60%] rotate-[18deg]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)",
              }}
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#F4E4D6]/80">
                  {t("landing.finalCta.eyebrow")}
                </div>
                <h2 className="mt-3 font-display text-[40px] font-medium leading-[1.05] text-white sm:text-[52px] lg:text-[60px]">
                  {t("landing.finalCta.title")}{" "}
                  <span className="serif-emph text-[#F4E4D6]">
                    {t("landing.finalCta.titleEmph")}
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-[17px] leading-[1.55] text-white/75">
                  {t("landing.finalCta.subtitle")}
                </p>
              </div>

              <div className="w-full">
                <div className="rounded-[20px] border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                  <WaitlistForm source="final-cta" />
                  <div className="mt-4 flex items-center gap-2 text-[13px] text-white/75">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M11.5 4L5.75 9.75L2.5 6.5"
                        stroke="#A8D5A0"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("landing.finalCta.trust")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
