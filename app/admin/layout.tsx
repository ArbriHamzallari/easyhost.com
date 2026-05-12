import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await checkAdmin();

  if (result.state === "anon") {
    redirect("/sign-in?redirect_url=/admin/waitlist");
  }
  if (result.state === "denied") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
              EasyHost
            </span>
            <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--primary-hover)]">
              Admin
            </span>
          </div>
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
