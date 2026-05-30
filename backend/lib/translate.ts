"use server";

import { v2 } from "@google-cloud/translate";

type AppLocale = "en" | "al" | "it" | "de";

type MultilingualText = Record<AppLocale, string>;

// Internal locale "al" maps to ISO 639-1 "sq" (Albanian) for Google Translate
const GOOGLE_LANG_MAP: Record<AppLocale, string> = {
  en: "en",
  al: "sq",
  it: "it",
  de: "de",
};

const ALL_LOCALES: AppLocale[] = ["en", "al", "it", "de"];

let _client: v2.Translate | null = null;

function getClient(): v2.Translate {
  if (!_client) {
    _client = new v2.Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });
  }
  return _client;
}

/**
 * Translates text to all 4 app locales. The source locale is passed through
 * unchanged; the other 3 are translated via Google Translate.
 *
 * On any error, all locales fall back to the original text so item creation
 * is never blocked by a translation failure.
 */
export async function translateMenuText(
  text: string,
  sourceLang: AppLocale
): Promise<MultilingualText> {
  const fallback = ALL_LOCALES.reduce(
    (acc, locale) => ({ ...acc, [locale]: text }),
    {} as MultilingualText
  );

  if (!process.env.GOOGLE_TRANSLATE_API_KEY || !text.trim()) {
    return fallback;
  }

  const targetLocales = ALL_LOCALES.filter((l) => l !== sourceLang);

  try {
    const client = getClient();

    const translations = await Promise.all(
      targetLocales.map(async (locale) => {
        const [translated] = await client.translate(text, {
          from: GOOGLE_LANG_MAP[sourceLang],
          to: GOOGLE_LANG_MAP[locale],
        });
        return { locale, text: translated };
      })
    );

    const result = { ...fallback, [sourceLang]: text };
    for (const { locale, text: translated } of translations) {
      result[locale] = translated;
    }
    return result;
  } catch (err) {
    console.error("[translate] translateMenuText failed:", err);
    return fallback;
  }
}
