import { prisma } from "@/backend/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  al: "Shqip",
  it: "Italiano",
  de: "Deutsch",
};

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Tirane",
  }).format(d);
}

async function loadWaitlist() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [total, entries, last7Days, allLanguages] = await Promise.all([
    prisma.waitlistEntry.count(),
    prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    prisma.waitlistEntry.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.waitlistEntry.findMany({ select: { language: true } }),
  ]);

  const byLanguage = new Map<string, number>();
  for (const { language } of allLanguages) {
    const key = language ?? "—";
    byLanguage.set(key, (byLanguage.get(key) ?? 0) + 1);
  }

  return { total, entries, last7Days, byLanguage };
}

export default async function WaitlistAdminPage() {
  const { total, entries, byLanguage, last7Days } = await loadWaitlist();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Waitlist
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            People waiting to be invited when EasyHost launches.
          </p>
        </div>
        <a
          href="/admin/waitlist/export"
          className="inline-flex h-10 w-fit items-center rounded-[var(--radius-pill)] border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)] hover:border-[var(--foreground)]"
        >
          Export CSV
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total signups" value={total.toLocaleString()} />
        <StatCard label="Last 7 days" value={last7Days.toLocaleString()} />
        <StatCard
          label="Languages"
          value={byLanguage.size.toString()}
          sub={Array.from(byLanguage.entries())
            .map(([lang, n]) => `${LOCALE_LABELS[lang] ?? lang}: ${n}`)
            .join(" · ")}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-[var(--surface)] text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Language</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Joined (Tirana)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-sm text-[var(--muted)]"
                >
                  No signups yet. Share easyhost.pro and watch them roll in.
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id} className="hover:bg-[var(--surface)]">
                  <td className="px-5 py-3 font-medium text-[var(--foreground)]">
                    {e.email}
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)]">
                    {LOCALE_LABELS[e.language ?? ""] ?? e.language ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)]">
                    {e.source ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)]">
                    {formatDate(e.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {entries.length >= 500 ? (
        <p className="text-xs text-[var(--muted)]">
          Showing the 500 most recent. Use CSV export for the full list.
        </p>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
        {value}
      </p>
      {sub ? (
        <p className="mt-1 text-xs text-[var(--muted)]">{sub}</p>
      ) : null}
    </div>
  );
}
