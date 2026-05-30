"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { GUEST_LOCALE_OPTIONS } from "@/frontend/lib/guest-intl-messages";
import { useGuestLocale } from "@/frontend/components/guest/guest-intl-provider";
import type { Locale } from "@/i18n/config";

const FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  al: "🇦🇱",
  it: "🇮🇹",
  de: "🇩🇪",
};

type Props = {
  variant?: "header" | "default";
};

export function GuestLocaleSwitcher({ variant = "default" }: Props) {
  const t = useTranslations("guestMenu");
  const { locale, setLocale } = useGuestLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const isHeader = variant === "header";
  const current = GUEST_LOCALE_OPTIONS.find((o) => o.code === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          isHeader
            ? "flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[12px] font-semibold text-white hover:bg-white/25"
            : "flex items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#222] shadow-sm"
        }
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("language")}
      >
        <span aria-hidden>{FLAGS[locale]}</span>
        <span>{current?.label ?? locale.toUpperCase()}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 min-w-[7rem] overflow-hidden rounded-[12px] border border-[#EBEBEB] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {GUEST_LOCALE_OPTIONS.map(({ code, label }) => (
            <li key={code} role="option" aria-selected={locale === code}>
              <button
                type="button"
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-[#FAFAF7] ${
                  locale === code ? "font-semibold text-[#222]" : "text-[#717171]"
                }`}
              >
                <span aria-hidden>{FLAGS[code]}</span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
