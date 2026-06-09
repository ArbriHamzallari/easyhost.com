import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyInventory } from "@/backend/lib/inventory";
import { prisma } from "@/backend/lib/prisma";
import { ensureOrgExists } from "@/backend/lib/org";
import { InventoryTable } from "@/frontend/components/dashboard/inventory-table";
import { Package } from "lucide-react";

type Params = { params: Promise<{ id: string }> };

export default async function PropertyInventoryPage({ params }: Params) {
  const { id: propertyId } = await params;
  const { orgId } = await ensureOrgExists();

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId },
    select: { id: true, name: true },
  });
  if (!property) notFound();

  const items = await getPropertyInventory(propertyId);
  if (items === null) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
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
        <span className="text-[var(--foreground)]">Inventory</span>
      </nav>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--primary-soft)]">
          <Package className="h-5 w-5 text-[var(--primary)]" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
            Inventory
          </h1>
          <p className="mt-0.5 text-[13.5px] text-[var(--muted)]">
            Update stock levels and low-stock thresholds per item.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <InventoryTable propertyId={propertyId} items={items} />
      </div>
    </div>
  );
}
