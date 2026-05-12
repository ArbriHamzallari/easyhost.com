import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales } from "./config";

function pickFromAcceptLanguage(header: string | null) {
  if (!header) return undefined;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return undefined;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  let locale = isLocale(cookieLocale) ? cookieLocale : undefined;

  if (!locale) {
    const headerStore = await headers();
    locale = pickFromAcceptLanguage(headerStore.get("accept-language"));
  }

  if (!locale) locale = defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages, _locales: locales };
});
