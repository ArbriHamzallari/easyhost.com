import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ensureOrgExists } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import {
  getOrCreateMenu,
  getMenuWithItems,
  getMenuStatus,
  addMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
  updateItemDisplayOrder,
  publishMenu,
} from "@/backend/lib/menu";
import { MenuAddItemForm } from "@/frontend/components/dashboard/menu-add-item-form";
import { MenuItemsList } from "@/frontend/components/dashboard/menu-items-list";
import { PublishButton } from "@/frontend/components/dashboard/publish-button";
import { AlertCircle, CheckCircle2, QrCode } from "lucide-react";

type Params = { params: Promise<{ id: string }> };

export default async function MenuBuilderPage({ params }: Params) {
  const { id: propertyId } = await params;
  const { orgId } = await ensureOrgExists();

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId },
    select: {
      id: true,
      name: true,
      currency: true,
      organization: { select: { defaultLanguage: true } },
    },
  });
  if (!property) notFound();

  // Ensure a menu record exists before rendering
  const menuResult = await getOrCreateMenu(propertyId);
  if (!menuResult.ok) redirect("/dashboard");

  const [menuData, statusData] = await Promise.all([
    getMenuWithItems(propertyId),
    getMenuStatus(propertyId),
  ]);

  if (!menuData.ok || !statusData.ok) redirect("/dashboard");

  const { data: menu } = menuData;
  const { data: status } = statusData;
  const defaultLang =
    (property.organization.defaultLanguage as "en" | "al" | "it" | "de") ?? "en";

  const allItems = Object.values(menu.itemsByCategory).flat();

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
            <Link href="/settings" className="hover:text-[var(--foreground)]">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div>
          <nav className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted)]">
            <Link href="/properties" className="hover:text-[var(--foreground)]">
              Properties
            </Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{property.name}</span>
            <span>/</span>
            <span className="text-[var(--foreground)]">Menu</span>
          </nav>
          <h1 className="mt-2 font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
            Menu Builder
          </h1>
        </div>

        {/* Status bar */}
        <div className="rounded-[16px] border border-[var(--border)] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <StatusChip
                done={status.itemCount > 0}
                label={`${status.itemCount} item${status.itemCount !== 1 ? "s" : ""}`}
                requirement="Add at least 1 item"
              />
              <StatusChip
                done={status.hasPaymentMethod}
                label="Payment configured"
                requirement="Add payment method"
                href="/onboarding/payment"
              />
              <span
                className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                  !status.isDraft
                    ? "bg-[var(--success)]/10 text-[var(--success)]"
                    : "bg-[var(--surface)] text-[var(--muted)]"
                }`}
              >
                {status.isDraft ? "Draft" : "Live"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {status.canGenerateQR && (
                <Link
                  href={`/properties/${propertyId}/qr`}
                  className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                >
                  <QrCode className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  Get QR code
                </Link>
              )}
              {status.isDraft && status.menuId && (
                <PublishButton
                  menuId={status.menuId}
                  disabled={!status.canPublish}
                  publish={publishMenu}
                />
              )}
            </div>
          </div>

          {status.isDraft && !status.canPublish && (
            <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
              {status.subscriptionLocked ? (
                <>
                  Your trial has ended —{" "}
                  <Link
                    href="/settings/billing"
                    className="font-medium text-[var(--primary)] underline-offset-2 hover:underline"
                  >
                    activate a plan
                  </Link>{" "}
                  to publish your menu.
                </>
              ) : !status.hasPaymentMethod ? (
                "Add a payment method before publishing."
              ) : (
                "Add at least one menu item before publishing."
              )}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div>
            <MenuAddItemForm
              menuId={menu.id}
              currency={property.currency}
              defaultLang={defaultLang}
              addItem={addMenuItem}
            />
          </div>

          <div>
            <h2 className="mb-3 text-[15px] font-semibold text-[var(--foreground)]">
              Your menu{allItems.length > 0 ? ` (${allItems.length})` : ""}
            </h2>
            <MenuItemsList
              menuId={menu.id}
              items={allItems}
              locale={defaultLang}
              deleteItem={deleteMenuItem}
              toggleAvailability={toggleItemAvailability}
              updateOrder={updateItemDisplayOrder}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusChip({
  done,
  label,
  requirement,
  href,
}: {
  done: boolean;
  label: string;
  requirement: string;
  href?: string;
}) {
  const content = (
    <span className="flex items-center gap-1.5">
      {done ? (
        <CheckCircle2
          className="h-3.5 w-3.5 text-[var(--success)]"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <AlertCircle
          className="h-3.5 w-3.5 text-[var(--muted)]"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
      <span
        className={`text-[12px] ${done ? "text-[var(--success)]" : "text-[var(--muted)]"}`}
      >
        {done ? label : requirement}
      </span>
    </span>
  );

  if (!done && href) {
    return (
      <Link href={href} className="hover:underline">
        {content}
      </Link>
    );
  }
  return content;
}
