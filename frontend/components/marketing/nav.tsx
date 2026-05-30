import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/frontend/components/ui/button";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";

export async function MarketingNav() {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);

  const navLinks = [
    { label: t("nav.howItWorks"), href: "/how-it-works" },
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.pricing"), href: "/pricing" },
    { label: t("nav.resources"), href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--canvas)]/75 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--canvas)]/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="EasyHost home"
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <Logo size={70} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + language switcher + mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Language switcher — desktop only */}
          <div className="hidden md:flex">
            <LanguageSwitcher currentLocale={locale} variant="compact" />
          </div>

          <Link
            href="/sign-in"
            className="hidden text-[14px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)] md:inline-flex"
          >
            {t("common.signIn")}
          </Link>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/sign-up">{t("common.signUp")}</Link>
          </Button>

          {/* Mobile hamburger — passes translated strings + locale down */}
          <MobileNav
            links={navLinks}
            signIn={t("common.signIn")}
            signUp={t("common.signUp")}
            currentLocale={locale}
          />
        </div>
      </div>
    </header>
  );
}
