import "server-only";

import { cookies, headers } from "next/headers";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";

/** BCP 47 Accept-Language tags → internal locale codes */
const ACCEPT_LANGUAGE_MAP: Record<string, Locale> = {
  en: "en",
  sq: "al",
  al: "al",
  it: "it",
  de: "de",
};

function pickFromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const base = tag.split("-")[0]!;
    if (ACCEPT_LANGUAGE_MAP[base]) return ACCEPT_LANGUAGE_MAP[base];
  }
  return undefined;
}

/** Guest + marketing UI locale: cookie, then Accept-Language, then default. */
export async function resolveGuestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const headerStore = await headers();
  return pickFromAcceptLanguage(headerStore.get("accept-language")) ?? defaultLocale;
}
