"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function Faq() {
  const t = useTranslations();
  const items = [
    { q: t("landing.faq.items.q1.q"), a: t("landing.faq.items.q1.a") },
    { q: t("landing.faq.items.q2.q"), a: t("landing.faq.items.q2.a") },
    { q: t("landing.faq.items.q3.q"), a: t("landing.faq.items.q3.a") },
    { q: t("landing.faq.items.q4.q"), a: t("landing.faq.items.q4.a") },
    { q: t("landing.faq.items.q5.q"), a: t("landing.faq.items.q5.a") },
    { q: t("landing.faq.items.q6.q"), a: t("landing.faq.items.q6.a") },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[var(--linen)]">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
            {t("landing.faq.eyebrow")}
          </div>
          <h2 className="mt-3 font-display text-[40px] font-medium leading-[1.05] text-[var(--ink)] sm:text-[48px]">
            {t("landing.faq.title")}{" "}
            <span className="serif-emph text-[var(--primary)]">
              {t("landing.faq.titleEmph")}
            </span>
          </h2>
        </div>

        <div className="mt-12 divide-y divide-[var(--border)] overflow-hidden rounded-[22px] border border-[var(--border)] bg-white shadow-[var(--shadow-card)]">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-[var(--canvas)] sm:px-8 sm:py-6"
                >
                  <span className="font-display text-[17px] font-semibold tracking-tight text-[var(--ink)] sm:text-[18px]">
                    {it.q}
                  </span>
                  <span
                    aria-hidden
                    className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border)] transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 border-[var(--primary)]/40 bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    <span className="absolute h-[1.4px] w-[12px] rounded-full bg-current" />
                    <span className="absolute h-[12px] w-[1.4px] rounded-full bg-current" />
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="px-6 pb-6 text-[15px] leading-[1.6] text-[var(--muted)] sm:px-8 sm:pb-7">
                      {it.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
