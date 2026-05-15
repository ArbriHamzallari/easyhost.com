"use server";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE } from "./config";

// Only en and al are exposed in the UI switcher.
// it/de remain accessible via browser Accept-Language headers.
const SWITCHABLE = ["en", "al"] as const;
type SwitchableLocale = (typeof SWITCHABLE)[number];

function isSwitchable(v: unknown): v is SwitchableLocale {
  return SWITCHABLE.includes(v as SwitchableLocale);
}

export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale) || !isSwitchable(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
