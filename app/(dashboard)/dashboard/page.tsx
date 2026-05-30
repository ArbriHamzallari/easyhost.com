import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureOrgExists } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import { daysUntil } from "@/backend/lib/dates";
import { TrialBanner } from "@/frontend/components/dashboard/trial-banner";
import { DashboardHeader } from "@/frontend/components/dashboard/dashboard-header";
import { SetupChecklist } from "@/frontend/components/dashboard/setup-checklist";
import type { ChecklistKey } from "@/frontend/components/dashboard/setup-checklist";
import {
  DollarSign,
  ShoppingBag,
  QrCode,
  Package,
  TrendingUp,
  Minus,
  AlertTriangle,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
  RecentOrdersLive,
  type DashboardOrderRow,
} from "@/frontend/components/dashboard/recent-orders-live";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  const { orgId } = await ensureOrgExists();

  const [org, property, owner] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: orgId },
      select: { subscriptionStatus: true, trialEndsAt: true },
    }),
    prisma.property.findFirst({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        accentColor: true,
        iban: true,
        acceptCash: true,
        stripeAccountId: true,
      },
    }),
    prisma.user.findFirst({
      where: { orgId, role: "owner" },
      select: { name: true },
    }),
  ]);

  if (!org) redirect("/onboarding");

  const daysLeft = daysUntil(org.trialEndsAt);
  const firstName = owner?.name?.split(" ")[0] ?? "there";

  // All secondary queries in parallel
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [menu, todayRevenue, ordersToday, recentOrders, lowStockItems] =
    await Promise.all([
      property
        ? prisma.menu.findFirst({
            where: { propertyId: property.id },
            select: { isDraft: true, _count: { select: { items: true } } },
          })
        : Promise.resolve(null),

      property
        ? prisma.order.aggregate({
            where: {
              propertyId: property.id,
              status: "paid",
              createdAt: { gte: todayStart },
            },
            _sum: { totalAmount: true },
          })
        : Promise.resolve({ _sum: { totalAmount: null } }),

      property
        ? prisma.order.count({
            where: {
              propertyId: property.id,
              createdAt: { gte: todayStart },
            },
          })
        : Promise.resolve(0),

      property
        ? prisma.order.findMany({
            where: { propertyId: property.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              id: true,
              status: true,
              totalAmount: true,
              currency: true,
              createdAt: true,
              guestName: true,
              paymentMethod: true,
              items: {
                select: { itemNameSnapshot: true, quantity: true },
                take: 2,
              },
            },
          })
        : Promise.resolve([]),

      property
        ? prisma.menuItem.findMany({
            where: { menu: { propertyId: property.id }, isAvailable: true },
            select: { stockQuantity: true, lowStockThreshold: true },
          })
        : Promise.resolve([]),
    ]);

  const menuItemCount = menu?._count.items ?? 0;
  const revenueToday = Number(todayRevenue._sum.totalAmount ?? 0);
  const lowStockCount = lowStockItems.filter(
    (item) => item.stockQuantity <= item.lowStockThreshold
  ).length;

  // Checklist — serialisable for the client component
  const checklistItems: { key: ChecklistKey; done: boolean; href: string }[] = [
    {
      key: "branding",
      done: !!(property?.logoUrl || property?.accentColor),
      href: "/onboarding/branding",
    },
    {
      key: "payment",
      done: !!(property?.iban || property?.acceptCash || property?.stripeAccountId),
      href: "/onboarding/payment",
    },
    {
      key: "menu",
      done: menuItemCount > 0,
      href: property ? `/properties/${property.id}/menu` : "#",
    },
    {
      key: "qr",
      done: !!(menu && !menu.isDraft),
      href: property ? `/properties/${property.id}/qr` : "#",
    },
  ];
  const completedCount = checklistItems.filter((i) => i.done).length;

  const ordersForClient: DashboardOrderRow[] = recentOrders.map((o) => ({
    id: o.id,
    status: o.status,
    totalAmount: o.totalAmount.toString(),
    currency: o.currency,
    createdAt: o.createdAt.toISOString(),
    guestName: o.guestName,
    paymentMethod: o.paymentMethod,
    items: o.items,
  }));

  // 4 stat cards — all use CSS-var icon backgrounds so dark mode works
  const stats = [
    {
      label: "Today's revenue",
      value: `€${revenueToday.toFixed(2)}`,
      sub: revenueToday > 0 ? "From paid orders" : "No paid orders yet",
      icon: DollarSign,
      iconBg: "var(--stat-bg-revenue)",
      iconColor: "var(--primary)",
      trend: revenueToday > 0 ? "up" : "neutral",
    },
    {
      label: "Orders today",
      value: String(ordersToday),
      sub: ordersToday > 0 ? "Across all statuses" : "Guests will appear here",
      icon: ShoppingBag,
      iconBg: "var(--stat-bg-orders)",
      iconColor: "var(--success)",
      trend: ordersToday > 0 ? "up" : "neutral",
    },
    {
      // QR scan tracking ships in Phase 6 — placeholder for now
      label: "QR scans today",
      value: "—",
      sub: "Tracking coming soon",
      icon: QrCode,
      iconBg: "var(--stat-bg-qr)",
      iconColor: "#7c6ab8",
      trend: "neutral",
    },
    {
      label: "Low stock items",
      value: menuItemCount > 0 ? String(lowStockCount) : "—",
      sub:
        menuItemCount === 0
          ? "Add menu items first"
          : lowStockCount > 0
            ? "Restock soon"
            : "All items stocked",
      icon: Package,
      iconBg: "var(--stat-bg-stock)",
      iconColor: lowStockCount > 0 ? "var(--warning)" : "var(--muted)",
      trend:
        menuItemCount === 0 ? "neutral" : lowStockCount > 0 ? "warn" : "up",
    },
  ] as const;

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        greeting={`Welcome back, ${firstName}`}
        propertyName={property?.name}
      />

      <div className="mx-auto max-w-5xl space-y-5 px-6 py-7">
        {/* Trial banner */}
        <TrialBanner
          daysLeft={daysLeft}
          subscriptionStatus={org.subscriptionStatus}
        />

        {/* ── Setup checklist (full-width, collapsible client component) ── */}
        <SetupChecklist items={checklistItems} completedCount={completedCount} />

        {/* ── 4-card stats row ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-[16px] border p-5 transition-shadow duration-200 hover:shadow-md"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  boxShadow:
                    "0 1px 3px rgba(28,25,23,0.04), 0 4px 12px -4px rgba(28,25,23,0.06)",
                }}
              >
                {/* Top: icon + trend */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: stat.iconBg }}
                  >
                    <Icon
                      className="h-[18px] w-[18px]"
                      strokeWidth={1.75}
                      style={{ color: stat.iconColor }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-0.5">
                    {stat.trend === "up" && (
                      <TrendingUp
                        className="h-4 w-4"
                        style={{ color: "var(--success)" }}
                        aria-hidden="true"
                      />
                    )}
                    {stat.trend === "warn" && (
                      <AlertTriangle
                        className="h-4 w-4"
                        style={{ color: "var(--warning)" }}
                        aria-hidden="true"
                      />
                    )}
                    {stat.trend === "neutral" && (
                      <Minus
                        className="h-4 w-4"
                        style={{ color: "var(--muted-light)" }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>

                {/* Value */}
                <div
                  className="mt-3 font-display text-[26px] font-semibold leading-none"
                  style={{ color: "var(--foreground)" }}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div className="mt-1.5 text-[12px]" style={{ color: "var(--muted)" }}>
                  {stat.label}
                </div>

                {/* Sub */}
                <div className="mt-0.5 text-[11px]" style={{ color: "var(--muted-light)" }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Empty menu CTA (only shown before first item) ── */}
        {menuItemCount === 0 && (
          <div
            className="rounded-[20px] border border-dashed p-8 text-center"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "var(--primary-soft)" }}
            >
              <UtensilsCrossed
                className="h-7 w-7"
                strokeWidth={1.75}
                style={{ color: "var(--primary)" }}
                aria-hidden="true"
              />
            </div>
            <h3
              className="mt-4 text-[17px] font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Build your first menu
            </h3>
            <p
              className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Add snacks, drinks, and services. Guests will see your menu when
              they scan the QR code.
            </p>
            <Button asChild className="mt-6">
              <Link
                href={
                  property ? `/properties/${property.id}/menu` : "/onboarding"
                }
              >
                Start building →
              </Link>
            </Button>
          </div>
        )}

        <RecentOrdersLive
          propertyId={property?.id ?? null}
          propertyMenuHref={
            property ? `/properties/${property.id}/menu` : null
          }
          initialOrders={ordersForClient}
        />
      </div>
    </>
  );
}
