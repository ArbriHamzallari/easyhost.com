import "server-only";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import en from "@/messages/en.json";
import al from "@/messages/al.json";
import it from "@/messages/it.json";
import de from "@/messages/de.json";

const messagesByLocale = {
  en,
  al: al as typeof en,
  it: it as typeof en,
  de: de as typeof en,
} as const;

export function resolveLocale(language: string | undefined): Locale {
  return isLocale(language) ? language : defaultLocale;
}

/** Dot-path lookup in nested message JSON (e.g. `guestMenu.receipt.subject`). */
export function getMessage(
  locale: Locale,
  path: string
): string | undefined {
  const parts = path.split(".");
  let cur: unknown = messagesByLocale[locale];
  for (const part of parts) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

/** Simple `{var}` interpolation — matches next-intl rich-text-free strings. */
export function formatMessage(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? "")
  );
}

export function t(
  locale: Locale,
  path: string,
  vars?: Record<string, string | number>
): string {
  const template = getMessage(locale, path);
  if (!template) return path;
  return vars ? formatMessage(template, vars) : template;
}
