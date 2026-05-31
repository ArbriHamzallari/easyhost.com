import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureOrgExists } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import { getOrgAccess } from "@/backend/lib/subscription";
import { TrialBanner } from "@/frontend/components/dashboard/trial-banner";
import { PropertyLimitBanner } from "@/frontend/components/dashboard/property-limit-banner";
import { Building2, QrCode, UtensilsCrossed, Plus, ArrowRight } from "lucide-react";

export default async function PropertiesPage() {
  const { orgId } = await ensureOrgExists();

  const [org, properties, access] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        subscriptionStatus: true,
        subscriptionTier: true,
        trialEndsAt: true,
      },
    }),
    prisma.property.findMany({
      where: { orgId, isActive: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        type: true,
        logoUrl: true,
        menus: {
          take: 1,
          select: {
            isDraft: true,
            _count: { select: { items: true } },
          },
        },
        orders: {
          where: { status: "paid" },
          select: { id: true },
        },
      },
    }),
    getOrgAccess(orgId),
  ]);

  if (!org) redirect("/onboarding");

  const { maxProperties, canAddProperty, propertyCount, needsUpgrade, subscriptionTier } =
    access;
  const atPropertyLimit =
    access.canUseProduct && propertyCount >= maxProperties;

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
            <Link href="/dashboard" className="hover:text-[var(--foreground)]">
              Dashboard
            </Link>
            <Link href="/properties" className="font-medium text-[var(--foreground)]">
              Properties
            </Link>
            <Link href="/settings" className="hover:text-[var(--foreground)]">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <TrialBanner
          daysLeft={access.daysLeftInTrial}
          subscriptionStatus={org.subscriptionStatus}
        />

        {atPropertyLimit && (
          <PropertyLimitBanner
            variant="property_limit"
            tier={subscriptionTier}
          />
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
              Properties
            </h1>
            <p className="mt-1 text-[14px] text-[var(--muted)]">
              {propertyCount} of {maxProperties} on {org.subscriptionTier} plan
            </p>
          </div>

          {canAddProperty ? (
            <Link
              href="/onboarding/property"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--primary)] px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Add property
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[var(--muted)]">
                {needsUpgrade
                  ? "Activate a plan to add properties"
                  : "Upgrade to Pro for up to 5 properties"}
              </span>
              <Link
                href="/settings/billing"
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--border)] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
              >
                {needsUpgrade ? "Activate plan →" : "Upgrade →"}
              </Link>
            </div>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[var(--border)] bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
              <Building2 className="h-7 w-7 text-[var(--primary)]" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-[17px] font-semibold text-[var(--foreground)]">
              No properties yet
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-[13.5px] text-[var(--muted)]">
              Add your first property to start building menus and generating QR codes.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const menu = property.menus[0] ?? null;
              const itemCount = menu?._count.items ?? 0;
              const isLive = menu && !menu.isDraft;

              return (
                <li
                  key={property.id}
                  className="group rounded-[20px] border border-[var(--border)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {property.logoUrl ? (
                        <Image
                          src={property.logoUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-[10px] object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--surface)]">
                          <Building2 className="h-5 w-5 text-[var(--muted)]" strokeWidth={1.5} aria-hidden="true" />
                        </div>
                      )}
                      <div>
                        <div className="text-[14px] font-semibold text-[var(--foreground)]">
                          {property.name}
                        </div>
                        <div className="text-[12px] capitalize text-[var(--muted)]">
                          {property.type}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        isLive
                          ? "bg-[var(--success)]/10 text-[var(--success)]"
                          : "bg-[var(--surface)] text-[var(--muted)]"
                      }`}
                    >
                      {isLive ? "Live" : "Draft"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-[12px] text-[var(--muted)]">
                    <span className="flex items-center gap-1">
                      <UtensilsCrossed className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <QrCode className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {property.orders.length} order{property.orders.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      href={`/properties/${property.id}/menu`}
                      className="flex-1 rounded-[8px] border border-[var(--border)] py-2 text-center text-[12.5px] font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                    >
                      Menu
                    </Link>
                    <Link
                      href={`/properties/${property.id}/qr`}
                      className="flex-1 rounded-[8px] border border-[var(--border)] py-2 text-center text-[12.5px] font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                    >
                      QR Code
                    </Link>
                    <Link
                      href={`/properties/${property.id}`}
                      aria-label="Open property"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors"
                    >
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
