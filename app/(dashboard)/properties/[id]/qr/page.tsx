import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ensureOrgExists } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import { getOrgAccess } from "@/backend/lib/subscription";
import { QrDownloadButtons } from "@/frontend/components/dashboard/qr-download-buttons";
import { AlertCircle, QrCode } from "lucide-react";

type Params = { params: Promise<{ id: string }> };

export default async function QrPage({ params }: Params) {
  const { id: propertyId } = await params;
  const { orgId } = await ensureOrgExists();

  const access = await getOrgAccess(orgId);

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId },
    select: {
      id: true,
      name: true,
      slug: true,
      menus: {
        take: 1,
        select: { isDraft: true, _count: { select: { items: true } } },
      },
    },
  });
  if (!property) notFound();

  const menu = property.menus[0] ?? null;
  const isLive = menu && !menu.isDraft;

  // Derive origin from the incoming request so the URL matches what's in the QR code
  // (http://localhost:3000 in dev, https://app.easyhost.pro in production).
  const headersList = await headers();
  const host = headersList.get("host") ?? "app.easyhost.pro";
  const proto = headersList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const guestUrl = `${proto}://${host}/m/${property.slug}`;

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
            <Link href="/properties" className="hover:text-[var(--foreground)]">
              Properties
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-6 py-8">
        <div>
          <nav className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted)]">
            <Link href="/properties" className="hover:text-[var(--foreground)]">
              Properties
            </Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{property.name}</span>
            <span>/</span>
            <span className="text-[var(--foreground)]">QR Code</span>
          </nav>
          <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
            QR Code
          </h1>
        </div>

        {access.needsUpgrade ? (
          <div className="rounded-[20px] border border-[var(--error)]/20 bg-[#FFE8DE] p-8 text-center">
            <h2 className="text-[17px] font-semibold text-[var(--foreground)]">
              Subscription required
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-[var(--muted)]">
              Your free trial has ended. Activate a plan to generate and download QR codes.
            </p>
            <Link
              href="/settings/billing"
              className="mt-6 inline-flex items-center gap-1.5 rounded-[10px] bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
            >
              Activate plan →
            </Link>
          </div>
        ) : !isLive ? (
          <div className="rounded-[20px] border border-[var(--border)] bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface)]">
              <QrCode className="h-7 w-7 text-[var(--muted)]" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-[17px] font-semibold text-[var(--foreground)]">
              Publish your menu first
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-[var(--muted)]">
              {!menu
                ? "Add items to your menu and publish it before generating your QR code."
                : menu._count.items === 0
                ? "Add at least one item to your menu before publishing."
                : "Publish your menu to unlock QR code generation."}
            </p>
            <Link
              href={`/properties/${propertyId}/menu`}
              className="mt-6 inline-flex items-center gap-1.5 rounded-[10px] bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
            >
              Go to Menu Builder →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* QR preview */}
            <div className="rounded-[20px] border border-[var(--border)] bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* QR image loaded via the API route */}
                <Image
                  src={`/api/properties/${propertyId}/qr?format=png`}
                  alt={`QR code for ${property.name}`}
                  width={192}
                  height={192}
                  unoptimized
                  className="h-48 w-48 shrink-0 rounded-[12px]"
                />
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-[var(--muted)]">
                      Guest URL
                    </p>
                    <p className="mt-1 break-all font-mono text-[12.5px] text-[var(--foreground)]">
                      {guestUrl}
                    </p>
                  </div>
                  <QrDownloadButtons propertyId={propertyId} guestUrl={guestUrl} />
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-2.5 rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <p className="text-[13px] text-[var(--muted)]">
                Print and place this QR code in your rental. Guests scan it to browse your
                menu and pay directly — no app required.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
