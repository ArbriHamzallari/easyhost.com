import { getTranslations } from "next-intl/server";
import { ShieldCheck, Smartphone, Lock } from "lucide-react";

export async function TrustBar() {
  const t = await getTranslations();

  const items = [
    { label: t("landing.trust.items.stripe"), kind: "stripe" as const },
    { label: t("landing.trust.items.paysera"), kind: "paysera" as const },
    {
      label: t("landing.trust.items.pci"),
      icon: ShieldCheck,
      kind: "icon" as const,
    },
    {
      label: t("landing.trust.items.gdpr"),
      icon: Lock,
      kind: "icon" as const,
    },
    {
      label: t("landing.trust.items.mobile"),
      icon: Smartphone,
      kind: "icon" as const,
    },
  ];

  return (
    <section className="relative -mt-2 border-y border-[var(--border)] bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-8 md:flex-row md:justify-between">
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          {t("landing.trust.title")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[var(--muted)]">
          {items.map((it, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-[14px] font-semibold tracking-tight"
            >
              {it.kind === "stripe" && <StripeMark />}
              {it.kind === "paysera" && <PayseraMark />}
              {it.kind === "icon" && it.icon && (
                <it.icon
                  className="h-[18px] w-[18px] text-[var(--ink)]/70"
                  strokeWidth={1.75}
                />
              )}
              {it.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StripeMark() {
  return (
    <svg
      width="44"
      height="18"
      viewBox="0 0 60 25"
      fill="none"
      aria-hidden
      className="text-[var(--ink)]"
    >
      <path
        d="M59.6 12.9c0-4.3-2.1-7.7-6-7.7s-6.3 3.4-6.3 7.7c0 5.1 2.9 7.6 7 7.6 2 0 3.5-.5 4.6-1.1v-3.4c-1.1.6-2.4.9-4 .9-1.6 0-3-.6-3.2-2.5h8c0-.2.1-1.1.1-1.5zM51.5 11.3c0-1.8 1.1-2.6 2.1-2.6.9 0 2 .8 2 2.6h-4.1zM40.6 5.2c-1.6 0-2.6.8-3.2 1.3l-.2-1H33v19l4.1-.9V19c.6.4 1.5 1 3.1 1 3.1 0 6-2.5 6-7.9 0-4.9-2.9-6.9-5.6-6.9zm-1 11.1c-1 0-1.7-.4-2.2-.9V9.3c.5-.5 1.2-.9 2.2-.9 1.6 0 2.7 1.8 2.7 4 0 2.2-1.1 3.9-2.7 3.9zM27.5 4.3l4.1-.9V.1l-4.1.9v3.3zM27.5 5.5h4.1v14.2h-4.1V5.5zM23.1 6.7l-.3-1.2H19v14.2h4.1v-9.6c1-1.2 2.6-1 3.1-.8V5.5c-.6-.2-2.4-.5-3.1 1.2zM14.6 2l-4 .9v13.2c0 2.4 1.8 4.2 4.3 4.2 1.4 0 2.4-.3 2.9-.6v-3.3c-.6.2-3.2.9-3.2-1.4V8.9h3.2V5.5h-3.2V2zM4.2 9.6c0-.6.5-.9 1.3-.9 1.2 0 2.7.4 4 1.1V6c-1.4-.6-2.7-.8-4-.8-3.3 0-5.4 1.7-5.4 4.6 0 4.5 6.2 3.8 6.2 5.8 0 .8-.7 1-1.5 1-1.3 0-3.1-.6-4.5-1.3v3.9c1.5.7 3.1 1 4.5 1 3.3 0 5.6-1.6 5.6-4.6 0-4.9-6.2-4-6.2-6z"
        fill="currentColor"
      />
    </svg>
  );
}

function PayseraMark() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF7A2B]">
        <span className="block h-[6px] w-[6px] rounded-full bg-white" />
      </span>
      <span className="font-display text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
        Paysera
      </span>
    </span>
  );
}
