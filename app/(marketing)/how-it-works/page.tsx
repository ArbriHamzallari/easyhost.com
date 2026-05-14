import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HowItWorks } from "@/frontend/components/marketing/how-it-works";

export const metadata: Metadata = {
  title: "How It Works — EasyHost",
  description:
    "Stock your rental, place the QR code, and get paid automatically. EasyHost turns your in-room minibar into a revenue stream in three simple steps.",
  openGraph: {
    title: "How It Works — EasyHost",
    description:
      "Three steps from setup to your first payout. No card reader, no app for guests, no middleman.",
    url: "https://easyhost.pro/how-it-works",
  },
};
import { Preview } from "@/frontend/components/marketing/preview";
import { FinalCta } from "@/frontend/components/marketing/final-cta";

export default async function HowItWorksPage() {
  const t = await getTranslations();

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
            {t("howItWorks.title")}
          </h1>
          <p className="mt-5 text-[17px] leading-[1.55] text-[var(--muted)] sm:text-[18px]">
            {t("howItWorks.subtitle")}
          </p>
        </div>
      </section>

      <HowItWorks />
      <Preview />
      <FinalCta />
    </>
  );
}
