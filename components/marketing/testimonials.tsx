import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";

export async function Testimonials() {
  const t = await getTranslations();

  const items = [
    {
      quote: t("landing.testimonials.items.t1.quote"),
      name: t("landing.testimonials.items.t1.name"),
      role: t("landing.testimonials.items.t1.role"),
      metric: t("landing.testimonials.items.t1.metric"),
      metricLabel: t("landing.testimonials.items.t1.metricLabel"),
      tone: "from-[#E16A4A] to-[#7C2A1A]",
    },
    {
      quote: t("landing.testimonials.items.t2.quote"),
      name: t("landing.testimonials.items.t2.name"),
      role: t("landing.testimonials.items.t2.role"),
      metric: t("landing.testimonials.items.t2.metric"),
      metricLabel: t("landing.testimonials.items.t2.metricLabel"),
      tone: "from-[#C99548] to-[#7A5418]",
    },
    {
      quote: t("landing.testimonials.items.t3.quote"),
      name: t("landing.testimonials.items.t3.name"),
      role: t("landing.testimonials.items.t3.role"),
      metric: t("landing.testimonials.items.t3.metric"),
      metricLabel: t("landing.testimonials.items.t3.metricLabel"),
      tone: "from-[#6E8067] to-[#3F4A3B]",
    },
  ];

  return (
    <section className="bg-[var(--canvas)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
        <Reveal>
          <div className="max-w-3xl">
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
              {t("landing.testimonials.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-[40px] font-medium leading-[1.05] text-[var(--ink)] sm:text-[48px]">
              {t("landing.testimonials.title")}{" "}
              <span className="serif-emph text-[var(--primary)]">
                {t("landing.testimonials.titleEmph")}
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-[1.55] text-[var(--muted)]">
              {t("landing.testimonials.subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 80}>
              <article className="group flex h-full flex-col justify-between rounded-[22px] border border-[var(--border)] bg-white p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[var(--shadow-elevated)]">
                <div>
                  <Quote />
                  <p className="mt-4 text-[16px] leading-[1.55] text-[var(--ink)]">
                    {it.quote}
                  </p>
                </div>

                <div className="mt-7 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${it.tone} font-display text-[15px] font-semibold text-white ring-2 ring-white`}
                    >
                      {it.name.charAt(0)}
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold tracking-tight text-[var(--ink)]">
                        {it.name}
                      </div>
                      <div className="text-[12px] text-[var(--muted)]">
                        {it.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[20px] font-semibold tracking-tight text-[var(--success)]">
                      {it.metric}
                    </div>
                    <div className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
                      {it.metricLabel}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <svg
      width="28"
      height="22"
      viewBox="0 0 28 22"
      fill="none"
      aria-hidden
      className="text-[var(--primary)]"
    >
      <path
        d="M11 4C7 4 4 7.2 4 11.5V18h7.5v-7H8c0-2 1.7-3.5 3-3.5V4zm13 0c-4 0-7 3.2-7 7.5V18h7.5v-7H21c0-2 1.7-3.5 3-3.5V4z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}
