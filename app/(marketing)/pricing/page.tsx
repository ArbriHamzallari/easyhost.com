import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { PricingCard } from "@/frontend/components/marketing/pricing-card";
import { FinalCta } from "@/frontend/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Pricing — EasyHost",
  description:
    "Starter at €15/month (1 property) or Pro at €29/month (up to 5 properties). 7-day free trial, no credit card required. Zero transaction fees on guest orders.",
  openGraph: {
    title: "Pricing — EasyHost",
    description:
      "Starter at €15/month or Pro at €29/month. 7-day free trial, no credit card required.",
    url: "https://easyhost.pro/pricing",
  },
};

export default async function PricingPage() {
  const t = await getTranslations();

  const includes = [
    t("landing.pricing.shared.feature1"),
    t("landing.pricing.shared.feature2"),
    t("landing.pricing.shared.feature3"),
    t("landing.pricing.shared.feature4"),
    t("landing.pricing.shared.feature5"),
    t("landing.pricing.shared.feature6"),
  ];

  const faqs = [
    {
      q: t("pricing.faq.trial.q"),
      a: t("pricing.faq.trial.a"),
    },
    {
      q: t("pricing.faq.payments.q"),
      a: t("pricing.faq.payments.a"),
    },
    {
      q: t("pricing.faq.moreProperties.q"),
      a: t("pricing.faq.moreProperties.a"),
    },
    {
      q: t("pricing.faq.cancel.q"),
      a: t("pricing.faq.cancel.a"),
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 500px at 50% 0%, rgba(225,106,74,0.08), transparent 60%), linear-gradient(180deg, #FAF8F6 0%, #F4EFE9 100%)",
          }}
        />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <h1 className="font-display text-[44px] font-medium leading-[1.05] text-[var(--ink)] sm:text-[56px]">
            {t("pricing.title")}
          </h1>
          <p className="mt-5 text-[17px] leading-[1.55] text-[var(--muted)] sm:text-[18px]">
            {t("pricing.subtitle")}
          </p>
        </div>
      </section>

      <PricingCard />

      <section className="bg-[var(--canvas)]">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="font-display text-[32px] font-medium tracking-tight text-[var(--ink)]">
            {t("pricing.includes")}
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {includes.map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-[15.5px]">
                <Check
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--success)]"
                  strokeWidth={2.5}
                />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[var(--linen)]">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="font-display text-[32px] font-medium tracking-tight text-[var(--ink)]">
            {t("pricing.questions")}
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map((item, i) => (
              <div
                key={i}
                className="rounded-[18px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <h3 className="font-display text-[18px] font-semibold tracking-tight">
                  {item.q}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-[var(--muted)]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
