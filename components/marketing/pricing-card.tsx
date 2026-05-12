import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Check, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export async function PricingCard() {
  const t = await getTranslations();
  const features = [
    t("landing.pricing.card.feature1"),
    t("landing.pricing.card.feature2"),
    t("landing.pricing.card.feature3"),
    t("landing.pricing.card.feature4"),
    t("landing.pricing.card.feature5"),
    t("landing.pricing.card.feature6"),
  ];

  return (
    <section id="pricing" className="bg-[var(--linen)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
              {t("landing.pricing.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-[40px] font-medium leading-[1.05] text-[var(--ink)] sm:text-[52px]">
              {t("landing.pricing.title")}{" "}
              <span className="serif-emph text-[var(--primary)]">
                {t("landing.pricing.titleEmph")}
              </span>
            </h2>
            <p className="mt-4 text-[17px] leading-[1.55] text-[var(--muted)]">
              {t("landing.pricing.subtitle")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100} className="mx-auto mt-14 max-w-xl">
          <article className="relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-elevated)] sm:p-10">
            {/* Soft accent halo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(225,106,74,0.35), transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--primary)]">
                    {t("landing.pricing.card.name")}
                  </div>
                  <p className="mt-1 max-w-sm text-[14px] text-[var(--muted)]">
                    {t("landing.pricing.card.tagline")}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--clay)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary-deep)]">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Early bird
                </span>
              </div>

              <div className="mt-7 flex items-baseline gap-2">
                <span className="font-display text-[68px] font-semibold leading-none tracking-tight text-[var(--ink)]">
                  {t("landing.pricing.card.price")}
                </span>
                <span className="text-[16px] text-[var(--muted)]">
                  {t("landing.pricing.card.interval")}
                </span>
              </div>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[14.5px] text-[var(--ink)]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]"
                      strokeWidth={2.5}
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/#waitlist">{t("landing.pricing.card.cta")}</Link>
                </Button>
                <div className="text-[13px] text-[var(--muted)]">
                  <span className="font-semibold text-[var(--ink)]">
                    {t("landing.pricing.card.trial")}
                  </span>{" "}
                  · {t("landing.pricing.card.noCard")}
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--linen)] p-4 text-[13.5px] leading-[1.55] text-[var(--ink)]">
                <div className="font-semibold text-[var(--ink)]">
                  {t("landing.pricing.card.roi")}
                </div>
                <p className="mt-1 text-[var(--muted)]">
                  {t("landing.pricing.card.earlyBird")}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
