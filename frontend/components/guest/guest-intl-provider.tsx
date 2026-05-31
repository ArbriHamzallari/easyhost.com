"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import { isLocale, type Locale } from "@/i18n/config";
import { guestMessagesByLocale } from "@/frontend/lib/guest-intl-messages";
import { setGuestLocaleCookie } from "@/frontend/lib/guest-locale";

type GuestLocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const GuestLocaleContext = createContext<GuestLocaleContextValue | null>(null);

export function useGuestLocale(): GuestLocaleContextValue {
  const ctx = useContext(GuestLocaleContext);
  if (!ctx) {
    throw new Error("useGuestLocale must be used within GuestIntlProvider");
  }
  return ctx;
}

type Props = {
  initialLocale: string;
  children: ReactNode;
};

export function GuestIntlProvider({ initialLocale, children }: Props) {
  const [locale, setLocaleState] = useState<Locale>(
    isLocale(initialLocale) ? initialLocale : "en"
  );

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setGuestLocaleCookie(next);
  }, []);

  const ctx = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <GuestLocaleContext.Provider value={ctx}>
      <NextIntlClientProvider locale={locale} messages={guestMessagesByLocale[locale]}>
        {children}
      </NextIntlClientProvider>
    </GuestLocaleContext.Provider>
  );
}
