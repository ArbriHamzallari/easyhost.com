import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { getLocale, getTranslations } from "next-intl/server";
import { joinWaitlist } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-up");
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  if (!email) {
    redirect("/");
  }

  const locale = await getLocale();
  const t = await getTranslations("welcome");

  const result = await joinWaitlist({
    email,
    language: locale,
    source: "clerk_signup",
  });

  const alreadyOnList = result.ok ? result.alreadyOnList : false;

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <main className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-12">
          <span className="inline-flex items-center rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--primary-hover)]">
            {t("badge")}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)]">{t("subtitle")}</p>
          <p className="mt-6 text-base leading-relaxed text-[var(--foreground)]">
            {t(alreadyOnList ? "bodyExisting" : "bodyNew", { email })}
          </p>

          <div className="mt-8 rounded-2xl bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-hover)]">
              {t("credentialsTitle")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">
              {t("credentialsBody")}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-[var(--radius-pill)] bg-[var(--primary)] px-5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
            >
              {t("cta")}
            </Link>
            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-[var(--radius-pill)] border border-[var(--border)] bg-white px-5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--foreground)]"
              >
                {t("signOut")}
              </button>
            </SignOutButton>
          </div>
        </div>
      </main>
    </div>
  );
}
