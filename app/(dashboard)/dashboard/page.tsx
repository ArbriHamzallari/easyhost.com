import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureOrgExists } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import { daysUntil } from "@/backend/lib/dates";
import { TrialBanner } from "@/frontend/components/dashboard/trial-banner";
import { Check, QrCode, UtensilsCrossed, Palette, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

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

  const menu = property
    ? await prisma.menu.findFirst({
        where: { propertyId: property.id },
        select: {
          isDraft: true,
          _count: { select: { items: true } },
        },
      })
    : null;
  const menuItemCount = menu?._count.items ?? 0;

  const checklist = [
    {
      icon: Palette,
      done: !!(property?.logoUrl || property?.accentColor),
      label: "Set up branding",
      description: "Add your logo and brand color",
      href: "/onboarding/branding",
    },
    {
      icon: CreditCard,
      done: !!(property?.iban || property?.acceptCash || property?.stripeAccountId),
      label: "Configure payment",
      description: "Add your IBAN or enable cash",
      href: "/onboarding/payment",
    },
    {
      icon: UtensilsCrossed,
      done: menuItemCount > 0,
      label: "Add your first menu item",
      description: "Start building your menu",
      href: property ? `/properties/${property.id}/menu` : "#",
    },
    {
      icon: QrCode,
      done: !!(menu && !menu.isDraft),
      label: "Generate your QR code",
      description: "Print and place it in your rental",
      href: property ? `/properties/${property.id}/qr` : "#",
    },
  ];

  const completedCount = checklist.filter((i) => i.done).length;
  const firstName = owner?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/dashboard"
            className="font-display text-[18px] font-semibold tracking-tight text-[var(--foreground)]"
          >
            Easy<span className="text-[var(--primary)]">Host</span>
          </Link>
          <nav className="flex items-center gap-6 text-[13.5px] text-[var(--muted)]">
            <Link href="/dashboard" className="font-medium text-[var(--foreground)]">
              Dashboard
            </Link>
            {property && (
              <Link href={`/properties/${property.id}/menu`} className="hover:text-[var(--foreground)]">
                Menu
              </Link>
            )}
            <Link href="/settings" className="hover:text-[var(--foreground)]">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <TrialBanner
          daysLeft={daysLeft}
          subscriptionStatus={org.subscriptionStatus}
        />

        <div>
          <h1 className="font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
            Welcome back, {firstName}.
          </h1>
          {property && (
            <p className="mt-1 text-[14px] text-[var(--muted)]">{property.name}</p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Setup</h2>
                <span className="text-[12px] text-[var(--muted)]">
                  {completedCount}/{checklist.length} done
                </span>
              </div>

              <div
                className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface)]"
                role="progressbar"
                aria-valuenow={completedCount}
                aria-valuemin={0}
                aria-valuemax={checklist.length}
              >
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${(completedCount / checklist.length) * 100}%` }}
                />
              </div>

              <ul className="mt-5 space-y-3">
                {checklist.map((item) => (
                  <li key={item.label}>
                    {item.done ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-white">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                        </div>
                        <span className="text-[13px] text-[var(--muted)] line-through">
                          {item.label}
                        </span>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 rounded-[10px] -m-1.5 p-1.5 hover:bg-[var(--surface)]"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] text-[var(--muted)]">
                          <item.icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-[var(--foreground)]">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-[var(--muted)]">
                            {item.description}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            {menuItemCount === 0 && (
              <div className="rounded-[20px] border border-dashed border-[var(--border)] bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
                  <UtensilsCrossed className="h-7 w-7 text-[var(--primary)]" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-[17px] font-semibold text-[var(--foreground)]">
                  Build your first menu
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-[var(--muted)]">
                  Add snacks, drinks, and services. Guests will see your menu when they scan the QR code.
                </p>
                <Button asChild className="mt-6">
                  <Link href={property ? `/properties/${property.id}/menu` : "/onboarding"}>
                    Start building →
                  </Link>
                </Button>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Today's revenue", value: "€0.00", sub: "No orders yet" },
                { label: "Orders today", value: "0", sub: "Guests will appear here" },
                { label: "Low stock items", value: "—", sub: "After first menu item" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[16px] border border-[var(--border)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="text-[12px] text-[var(--muted)]">{stat.label}</div>
                  <div className="mt-1 font-display text-[26px] font-semibold text-[var(--foreground)]">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--muted)]">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
