import "server-only";

import { z } from "zod";
import { prisma } from "./prisma";
import { getOrgUser, UnauthenticatedError } from "./auth";
import { getOrgAccess, SubscriptionLockedError } from "./subscription";

import type { InventoryRow } from "@/lib/inventory-types";

export type { InventoryRow };

export type InventoryResult =
  | { ok: true }
  | { ok: false; error: "unauthenticated" | "forbidden" | "invalid_input" | "subscription_locked" | "server_error" };

const UpdateStockSchema = z.object({
  menuItemId: z.string().min(1),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
});

export async function getPropertyInventory(
  propertyId: string
): Promise<InventoryRow[] | null> {
  const user = await getOrgUser();

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: user.orgId },
    select: { id: true },
  });
  if (!property) return null;

  const menu = await prisma.menu.findFirst({
    where: { propertyId },
    select: { id: true },
  });
  if (!menu) return [];

  const items = await prisma.menuItem.findMany({
    where: { menuId: menu.id },
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    select: {
      id: true,
      name: true,
      category: true,
      stockQuantity: true,
      lowStockThreshold: true,
      isAvailable: true,
    },
  });

  return items.map((item) => {
    const nameJson = item.name as Record<string, string>;
    return {
      id: item.id,
      name: nameJson.en ?? nameJson.al ?? "Item",
      category: item.category,
      stockQuantity: item.stockQuantity,
      lowStockThreshold: item.lowStockThreshold,
      isAvailable: item.isAvailable,
    };
  });
}

export async function updateMenuItemStock(input: {
  propertyId: string;
  menuItemId: string;
  stockQuantity: number;
  lowStockThreshold?: number;
}): Promise<InventoryResult> {
  const parsed = UpdateStockSchema.safeParse({
    menuItemId: input.menuItemId,
    stockQuantity: input.stockQuantity,
    lowStockThreshold: input.lowStockThreshold,
  });
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  try {
    const user = await getOrgUser();
    const access = await getOrgAccess(user.orgId);
    if (!access.canUseProduct) {
      return { ok: false, error: "subscription_locked" };
    }

    const item = await prisma.menuItem.findFirst({
      where: {
        id: parsed.data.menuItemId,
        menu: { property: { id: input.propertyId, orgId: user.orgId } },
      },
      select: { id: true },
    });
    if (!item) return { ok: false, error: "forbidden" };

    await prisma.menuItem.update({
      where: { id: item.id },
      data: {
        stockQuantity: parsed.data.stockQuantity,
        ...(parsed.data.lowStockThreshold !== undefined
          ? { lowStockThreshold: parsed.data.lowStockThreshold }
          : {}),
        isAvailable: parsed.data.stockQuantity > 0,
      },
    });

    return { ok: true };
  } catch (err) {
    if (err instanceof UnauthenticatedError) {
      return { ok: false, error: "unauthenticated" };
    }
    if (err instanceof SubscriptionLockedError) {
      return { ok: false, error: "subscription_locked" };
    }
    console.error("[inventory] updateMenuItemStock:", err);
    return { ok: false, error: "server_error" };
  }
}
