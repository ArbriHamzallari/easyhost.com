import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";

/** Menu item JSON uses the same codes as app locales (`al` not `sq`). */
export function toMenuItemLocale(locale: string): string {
  return isLocale(locale) ? locale : defaultLocale;
}

export function setGuestLocaleCookie(locale: Locale): void {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
}
