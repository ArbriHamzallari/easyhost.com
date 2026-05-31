import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Logo } from "./logo";

export async function MarketingFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("footer.product"),
      links: [
        { label: t("footer.links.features"), href: "#features" },
        { label: t("footer.links.pricing"), href: "/pricing" },
        { label: t("footer.links.menu"), href: "/how-it-works" },
        { label: t("footer.links.demo"), href: "#" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.links.howItWorks"), href: "/how-it-works" },
        { label: t("footer.links.blog"), href: "#" },
        { label: t("footer.links.guides"), href: "#" },
        { label: t("footer.links.support"), href: "#" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.links.about"), href: "#" },
        { label: t("footer.links.careers"), href: "#" },
        { label: t("footer.links.contact"), href: "#" },
        { label: t("footer.links.press"), href: "#" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.links.privacy"), href: "/privacy" },
        { label: t("footer.links.terms"), href: "/terms" },
        { label: t("footer.links.refund"), href: "/refund" },
        { label: t("footer.links.cookies"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--canvas)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand block */}
          <div>
            <Logo size={24} />
            <p className="mt-4 max-w-xs text-[14.5px] leading-[1.6] text-[var(--muted)]">
              {t("footer.tagline")}
            </p>
            <form className="mt-6 flex max-w-sm gap-2">
              <input
                type="email"
                placeholder={t("footer.subscribePlaceholder")}
                aria-label="email"
                className="h-11 flex-1 rounded-[var(--radius-button)] border border-[var(--border)] bg-white px-4 text-[14px] text-[var(--ink)] placeholder:text-[var(--muted-light)] focus:border-[var(--primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
              <button
                type="button"
                className="rounded-[var(--radius-button)] bg-[var(--ink)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-black"
              >
                {t("footer.subscribeCta")}
              </button>
            </form>
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon kind="x" />
              <SocialIcon kind="instagram" />
              <SocialIcon kind="linkedin" />
              <SocialIcon kind="github" />
            </div>
          </div>

          {cols.map((col, i) => (
            <div key={i}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-[12.5px] text-[var(--muted)] sm:flex-row">
          <div>
            © {year} {t("common.appName")}. {t("footer.rights")}
          </div>
          <div className="inline-flex items-center gap-2">
            <span>{t("footer.madeIn")}</span>
            <span aria-hidden>·</span>
            <span>Tirana, Albania</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  kind,
}: {
  kind: "x" | "instagram" | "linkedin" | "github";
}) {
  return (
    <a
      href="#"
      aria-label={kind}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--ink)]/40 hover:text-[var(--ink)]"
    >
      {kind === "x" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )}
      {kind === "instagram" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      )}
      {kind === "linkedin" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22zM8.5 8h4.37v1.93h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.43h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H8.5z" />
        </svg>
      )}
      {kind === "github" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56 4.56-1.53 7.84-5.83 7.84-10.91C23.5 5.65 18.35.5 12 .5z" />
        </svg>
      )}
    </a>
  );
}
