import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureOrgExists } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import { Button } from "@/frontend/components/ui/button";
import {
  Building2,
  CheckCircle2,
  Circle,
  MapPin,
  QrCode,
  Settings,
  UtensilsCrossed,
} from "lucide-react";

type Params = { params: Promise<{ id: string }> };

function StatusBadge({
  ready,
  label,
}: {
  ready: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${
        ready
          ? "bg-[var(--success)]/10 text-[var(--success)]"
          : "bg-[var(--surface)] text-[var(--muted)]"
      }`}
    >
      {ready ? (
        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Circle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

export default async function PropertyDetailPage({ params }: Params) {
  const { id: propertyId } = await params;
  const { orgId } = await ensureOrgExists();

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId, isActive: true },
    select: {
      id: true,
      name: true,
      type: true,
      address: true,
      stripeAccountId: true,
      stripeOnboardingComplete: true,
      iban: true,
      acceptCash: true,
      menus: {
        take: 1,
        select: { isDraft: true, _count: { select: { items: true } } },
      },
    },
  });

  if (!property) notFound();

  const menu = property.menus[0] ?? null;
  const itemCount = menu?._count.items ?? 0;
  const menuReady = !!menu && !menu.isDraft && itemCount > 0;
  const paymentConnected = !!(
    (property.stripeAccountId && property.stripeOnboardingComplete) ||
    property.iban ||
    property.acceptCash
  );
  const qrReady = menuReady && paymentConnected;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <nav className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted)]">
        <Link href="/properties" className="hover:text-[var(--foreground)]">
          Properties
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{property.name}</span>
      </nav>

      <div
        className="mt-6 rounded-[16px] border border-[var(--border)] bg-white p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--primary-soft)]">
            <Building2
              className="h-6 w-6 text-[var(--primary)]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
              {property.name}
            </h1>
            <p className="mt-1 capitalize text-[14px] text-[var(--muted)]">
              {property.type}
            </p>
            {property.address && (
              <p className="mt-2 flex items-start gap-1.5 text-[13px] text-[var(--muted)]">
                <MapPin
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {property.address}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <StatusBadge ready={menuReady} label="Menu ready" />
          <StatusBadge ready={paymentConnected} label="Payment connected" />
          <StatusBadge ready={qrReady} label="QR ready" />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href={`/properties/${property.id}/menu`}>
              <UtensilsCrossed className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Menu builder
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/properties/${property.id}/qr`}>
              <QrCode className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              QR code
            </Link>
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <Link href={`/properties/${property.id}/settings`}>
              <Settings className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Settings
            </Link>
          </Button>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="secondary" className="flex-1">
            <Link href={`/properties/${property.id}/analytics`}>
              Analytics
            </Link>
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <Link href={`/properties/${property.id}/inventory`}>
              Inventory
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
