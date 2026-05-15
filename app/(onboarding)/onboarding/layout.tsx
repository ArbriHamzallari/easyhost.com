import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Top bar */}
      <header className="border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="font-display text-[18px] font-semibold tracking-tight text-[var(--foreground)]"
          >
            Easy<span className="text-[var(--primary)]">Host</span>
          </Link>
          <p className="hidden text-[13px] text-[var(--muted)] sm:block">
            Get set up in under 5 minutes
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        {children}
      </main>
    </div>
  );
}
