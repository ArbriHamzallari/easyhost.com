import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export async function MarketingNav() {
  const t = await getTranslations();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--canvas)]/75 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--canvas)]/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          aria-label="EasyHost home"
          className="transition-opacity hover:opacity-80"
        >
          <Logo size={70} />
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          <Link
            href="/how-it-works"
            className="text-[14px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            {t("nav.howItWorks")}
          </Link>
          <Link
            href="#features"
            className="text-[14px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            {t("nav.features")}
          </Link>
          <Link
            href="/pricing"
            className="text-[14px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            {t("nav.pricing")}
          </Link>
          <Link
            href="#faq"
            className="text-[14px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
          >
            {t("nav.resources")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden text-[14px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)] sm:inline-flex"
          >
            {t("common.signIn")}
          </Link>
          <Button asChild size="sm">
            <Link href="#waitlist">{t("common.joinWaitlist")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
