import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyAnalytics } from "@/backend/lib/analytics";
import { prisma } from "@/backend/lib/prisma";
import { ensureOrgExists } from "@/backend/lib/org";
import { RevenueChart } from "@/frontend/components/dashboard/revenue-chart";
import { BarChart3, TrendingUp } from "lucide-react";

type Params = { params: Promise<{ id: string }> };

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function PropertyAnalyticsPage({ params }: Params) {
  const { id: propertyId } = await params;
  const { orgId } = await ensureOrgExists();

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId },
    select: { id: true, name: true },
  });
  if (!property) notFound();

  const analytics = await getPropertyAnalytics(propertyId);
  if (!analytics) notFound();

  const { currency } = analytics;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <nav className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted)]">
        <Link href="/properties" className="hover:text-[var(--foreground)]">
          Properties
        </Link>
        <span>/</span>
        <Link
          href={`/properties/${propertyId}`}
          className="hover:text-[var(--foreground)]"
        >
          {property.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">Analytics</span>
      </nav>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--primary-soft)]">
          <BarChart3 className="h-5 w-5 text-[var(--primary)]" strokeWidth={1.75} />
        </div>
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
          Analytics
        </h1>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Today", value: analytics.todayRevenue },
          { label: "This week", value: analytics.weekRevenue },
          { label: "Last 30 days", value: analytics.monthRevenue },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[16px] border border-[var(--border)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-[24px] font-semibold text-[var(--foreground)]">
              {formatMoney(stat.value, currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[16px] border border-[var(--border)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--muted)]" />
          <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
            Daily revenue (30 days)
          </h2>
        </div>
        <RevenueChart data={analytics.dailySeries} currency={currency} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[16px] border border-[var(--border)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
            Top-selling items
          </h2>
          {analytics.topItems.length === 0 ? (
            <p className="mt-4 text-[13px] text-[var(--muted)]">No paid orders yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {analytics.topItems.map((item, i) => (
                <li
                  key={item.menuItemId}
                  className="flex items-center justify-between text-[13.5px]"
                >
                  <span className="text-[var(--foreground)]">
                    <span className="mr-2 text-[var(--muted)]">{i + 1}.</span>
                    {item.name}
                    <span className="ml-2 text-[var(--muted)]">×{item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    {formatMoney(item.revenue, currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[16px] border border-[var(--border)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
            Recent orders
          </h2>
          {analytics.recentOrders.length === 0 ? (
            <p className="mt-4 text-[13px] text-[var(--muted)]">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--border)]">
              {analytics.recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between py-3 text-[13px]"
                >
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {order.guestName ?? "Guest"}
                    </p>
                    <p className="text-[12px] capitalize text-[var(--muted)]">
                      {order.paymentMethod ?? order.status} ·{" "}
                      {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatMoney(order.totalAmount, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
