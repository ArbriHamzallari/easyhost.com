import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Check, Sparkles } from "lucide-react";
import { Reveal } from "@/frontend/components/ui/reveal";
import { Button } from "@/frontend/components/ui/button";

export async function PricingCard() {
  const t = await getTranslations();
  const features = [
    t("landing.pricing.shared.feature1"),
    t("landing.pricing.shared.feature2"),
    t("landing.pricing.shared.feature3"),
    t("landing.pricing.shared.feature4"),
    t("landing.pricing.shared.feature5"),
    t("landing.pricing.shared.feature6"),
  ];

  return (
    <section id="pricing" className="bg-[var(--linen)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
              {t("landing.pricing.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-[30px] font-medium leading-[1.05] text-[var(--ink)] sm:text-[40px] lg:text-[52px]">
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

        {/* Two plan cards */}
        <Reveal delay={100}>
          <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
            {/* Starter */}
            <article className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-elevated)] sm:rounded-[24px] sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-40 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(225,106,74,0.25), transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--primary)]">
                  {t("landing.pricing.starter.name")}
                </div>
                <p className="mt-1 text-[13px] text-[var(--muted)]">
                  {t("landing.pricing.starter.tagline")}
                </p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-[48px] font-semibold leading-none tracking-tight text-[var(--ink)] sm:text-[56px]">
                    {t("landing.pricing.starter.price")}
                  </span>
                  <span className="text-[15px] text-[var(--muted)]">
                    {t("landing.pricing.starter.interval")}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-medium text-[var(--muted)]">
                  {t("landing.pricing.starter.limit")}
                </p>
                <Button asChild size="lg" variant="outline" className="mt-6 w-full">
                  <Link href="/#waitlist">{t("landing.pricing.starter.cta")}</Link>
                </Button>
                <p className="mt-3 text-center text-[12px] text-[var(--muted)]">
                  <span className="font-semibold text-[var(--ink)]">
                    {t("landing.pricing.shared.trial")}
                  </span>{" "}
                  · {t("landing.pricing.shared.noCard")}
                </p>
              </div>
            </article>

            {/* Pro */}
            <article className="relative overflow-hidden rounded-[20px] border-2 border-[var(--primary)] bg-white p-6 shadow-[var(--shadow-elevated)] sm:rounded-[24px] sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-50 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(225,106,74,0.35), transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--primary)]">
                    {t("landing.pricing.pro.name")}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--clay)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--primary-deep)]">
                    <Sparkles className="h-3 w-3" strokeWidth={1.75} />
                    {t("landing.pricing.pro.badge")}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-[var(--muted)]">
                  {t("landing.pricing.pro.tagline")}
                </p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-[48px] font-semibold leading-none tracking-tight text-[var(--ink)] sm:text-[56px]">
                    {t("landing.pricing.pro.price")}
                  </span>
                  <span className="text-[15px] text-[var(--muted)]">
                    {t("landing.pricing.pro.interval")}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-medium text-[var(--muted)]">
                  {t("landing.pricing.pro.limit")}
                </p>
                <Button asChild size="lg" className="mt-6 w-full">
                  <Link href="/#waitlist">{t("landing.pricing.pro.cta")}</Link>
                </Button>
                <p className="mt-3 text-center text-[12px] text-[var(--muted)]">
                  <span className="font-semibold text-[var(--ink)]">
                    {t("landing.pricing.shared.trial")}
                  </span>{" "}
                  · {t("landing.pricing.shared.noCard")}
                </p>
              </div>
            </article>
          </div>
        </Reveal>

        {/* Shared features */}
        <Reveal delay={150}>
          <div className="mx-auto mt-8 max-w-3xl rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <ul className="grid gap-3 sm:grid-cols-2">
              {features.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[14px] text-[var(--ink)]"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]"
                    strokeWidth={2.5}
                  />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-[var(--border)] pt-5 text-[13px] leading-[1.55] text-[var(--muted)]">
              <span className="font-semibold text-[var(--ink)]">
                {t("landing.pricing.shared.roi")}
              </span>{" "}
              {t("landing.pricing.shared.earlyBird")}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
