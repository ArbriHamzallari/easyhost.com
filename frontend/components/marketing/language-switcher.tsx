"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/i18n/actions";

const LOCALES = [
  { code: "en", label: "EN", title: "English" },
  { code: "al", label: "SQ", title: "Shqip" },
] as const;

interface LanguageSwitcherProps {
  currentLocale: string;
  /** compact = two small text buttons side by side (desktop nav) */
  variant?: "compact" | "full";
}

export function LanguageSwitcher({
  currentLocale,
  variant = "compact",
}: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSwitch(code: string) {
    if (code === currentLocale || isPending) return;
    startTransition(async () => {
      await setLocale(code);
      router.refresh();
    });
  }

  if (variant === "compact") {
    return (
      <div
        className="flex items-center rounded-[8px] border border-[var(--border)] bg-white"
        aria-label="Language switcher"
      >
        {LOCALES.map((l, i) => (
          <button
            key={l.code}
            type="button"
            title={l.title}
            disabled={isPending}
            onClick={() => handleSwitch(l.code)}
            className={[
              "h-7 px-2.5 text-[12px] font-semibold transition-colors",
              i === 0 ? "rounded-l-[7px]" : "rounded-r-[7px]",
              currentLocale === l.code
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)]",
              isPending ? "opacity-50 cursor-wait" : "cursor-pointer",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  // Full variant for mobile drawer
  return (
    <div className="flex gap-2" aria-label="Language switcher">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          disabled={isPending}
          onClick={() => handleSwitch(l.code)}
          className={[
            "flex-1 h-10 rounded-[10px] text-[14px] font-semibold transition-colors border",
            currentLocale === l.code
              ? "bg-[var(--primary)] text-white border-[var(--primary)]"
              : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
            isPending ? "opacity-50 cursor-wait" : "cursor-pointer",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {l.title}
        </button>
      ))}
    </div>
  );
}
