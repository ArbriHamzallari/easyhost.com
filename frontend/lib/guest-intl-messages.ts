import type { Locale } from "@/i18n/config";
import en from "@/messages/en.json";
import al from "@/messages/al.json";
import it from "@/messages/it.json";
import de from "@/messages/de.json";

export const guestMessagesByLocale: Record<Locale, typeof en> = {
  en,
  al: al as typeof en,
  it: it as typeof en,
  de: de as typeof en,
};

export const GUEST_LOCALE_OPTIONS: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "al", label: "SQ" },
  { code: "it", label: "IT" },
  { code: "de", label: "DE" },
];
