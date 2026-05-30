import "server-only";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { Prisma } from "../../generated/prisma";
import { prisma } from "./prisma";
import { translateMenuText } from "./translate";
import { getOrgAccess } from "./subscription";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type MenuErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "invalid_input"
  | "server_error";

export type MenuResult =
  | { ok: true }
  | { ok: false; error: MenuErrorCode };

export type AppLocale = "en" | "al" | "it" | "de";
export type MultilingualText = Record<AppLocale, string>;

export type MenuItemRow = {
  id: string;
  name: MultilingualText;
  description: MultilingualText | null;
  category: string;
  imageUrl: string | null;
  price: string; // Decimal serialised as string
  currency: string;
  isAvailable: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  displayOrder: number;
};

export type MenuWithItems = {
  id: string;
  isDraft: boolean;
  name: MultilingualText;
  itemsByCategory: Record<string, MenuItemRow[]>;
};

export type MenuStatus = {
  menuId: string | null;
  isDraft: boolean;
  itemCount: number;
  hasPaymentMethod: boolean;
  canPublish: boolean;
  canGenerateQR: boolean;
  subscriptionLocked: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Zod schemas
// ─────────────────────────────────────────────────────────────────────────────

const LOCALES = ["en", "al", "it", "de"] as const;

const MenuItemInputSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  sourceLang: z.enum(LOCALES),
  description: z.string().max(500).trim().optional(),
  category: z.string().min(1).max(100).trim(),
  price: z.number().positive().max(99999),
  imageUrl: z.string().url().optional().or(z.literal("")),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
});

export type MenuItemInput = z.infer<typeof MenuItemInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth helper — minimal, self-contained
// ─────────────────────────────────────────────────────────────────────────────

class AuthError extends Error {
  constructor() {
    super("unauthenticated");
    this.name = "AuthError";
  }
}

async function getOrgUser(): Promise<{ orgId: string; userId: string }> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new AuthError();

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true, orgId: true },
  });
  if (!user) throw new AuthError();

  return { orgId: user.orgId, userId: user.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function logError(scope: string, err: unknown): void {
  if (err instanceof Error) {
    console.error(`[menu] ${scope}: ${err.name}: ${err.message}`);
  } else {
    console.error(`[menu] ${scope}:`, err);
  }
}

function toResult(scope: string, err: unknown): MenuResult {
  if (err instanceof AuthError) return { ok: false, error: "unauthenticated" };
  logError(scope, err);
  return { ok: false, error: "server_error" };
}

function rowToItem(item: {
  id: string;
  name: unknown;
  description: unknown;
  category: string;
  imageUrl: string | null;
  price: { toString(): string };
  currency: string;
  isAvailable: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  displayOrder: number;
}): MenuItemRow {
  return {
    ...item,
    name: item.name as MultilingualText,
    description: item.description as MultilingualText | null,
    price: item.price.toString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getOrCreateMenu
// ─────────────────────────────────────────────────────────────────────────────

export async function getOrCreateMenu(
  propertyId: string
): Promise<{ ok: true; menuId: string } | { ok: false; error: MenuErrorCode }> {
  try {
    const user = await getOrgUser();

    const property = await prisma.property.findFirst({
      where: { id: propertyId, orgId: user.orgId },
      select: { id: true },
    });
    if (!property) return { ok: false, error: "forbidden" };

    const existing = await prisma.menu.findFirst({
      where: { propertyId },
      select: { id: true },
    });
    if (existing) return { ok: true, menuId: existing.id };

    const menu = await prisma.menu.create({
      data: {
        propertyId,
        name: { en: "Menu", al: "Menu", it: "Menu", de: "Menü" },
      },
      select: { id: true },
    });
    return { ok: true, menuId: menu.id };
  } catch (err) {
    return toResult("getOrCreateMenu", err) as { ok: false; error: MenuErrorCode };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getMenuWithItems
// ─────────────────────────────────────────────────────────────────────────────

export async function getMenuWithItems(
  propertyId: string
): Promise<{ ok: true; data: MenuWithItems } | { ok: false; error: MenuErrorCode }> {
  try {
    const user = await getOrgUser();

    const menu = await prisma.menu.findFirst({
      where: { propertyId, property: { orgId: user.orgId } },
      select: {
        id: true,
        isDraft: true,
        name: true,
        items: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            imageUrl: true,
            price: true,
            currency: true,
            isAvailable: true,
            stockQuantity: true,
            lowStockThreshold: true,
            displayOrder: true,
          },
        },
      },
    });

    if (!menu) return { ok: false, error: "not_found" };

    const itemsByCategory: Record<string, MenuItemRow[]> = {};
    for (const raw of menu.items) {
      const item = rowToItem(raw);
      if (!itemsByCategory[item.category]) itemsByCategory[item.category] = [];
      itemsByCategory[item.category]!.push(item);
    }

    return {
      ok: true,
      data: {
        id: menu.id,
        isDraft: menu.isDraft,
        name: menu.name as MultilingualText,
        itemsByCategory,
      },
    };
  } catch (err) {
    return toResult("getMenuWithItems", err) as { ok: false; error: MenuErrorCode };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getMenuStatus
// ─────────────────────────────────────────────────────────────────────────────

export async function getMenuStatus(
  propertyId: string
): Promise<{ ok: true; data: MenuStatus } | { ok: false; error: MenuErrorCode }> {
  try {
    const user = await getOrgUser();

    const property = await prisma.property.findFirst({
      where: { id: propertyId, orgId: user.orgId },
      select: {
        iban: true,
        acceptCash: true,
        stripeAccountId: true,
        stripeOnboardingComplete: true,
        menus: {
          take: 1,
          select: {
            id: true,
            isDraft: true,
            _count: { select: { items: true } },
          },
        },
      },
    });
    if (!property) return { ok: false, error: "forbidden" };

    const menu = property.menus[0] ?? null;
    const hasPaymentMethod = !!(
      (property.stripeAccountId && property.stripeOnboardingComplete) ||
      property.iban ||
      property.acceptCash
    );
    const itemCount = menu?._count.items ?? 0;
    const access = await getOrgAccess(user.orgId);
    const canPublish =
      itemCount >= 1 && hasPaymentMethod && access.canPublishMenu;
    const canGenerateQR =
      !!(menu && !menu.isDraft) && access.canGenerateQr;

    return {
      ok: true,
      data: {
        menuId: menu?.id ?? null,
        isDraft: menu?.isDraft ?? true,
        itemCount,
        hasPaymentMethod,
        canPublish,
        canGenerateQR,
        subscriptionLocked: access.needsUpgrade,
      },
    };
  } catch (err) {
    return toResult("getMenuStatus", err) as { ok: false; error: MenuErrorCode };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// addMenuItem
// ─────────────────────────────────────────────────────────────────────────────

export async function addMenuItem(
  menuId: string,
  data: MenuItemInput
): Promise<{ ok: true; itemId: string } | { ok: false; error: MenuErrorCode }> {
  "use server";
  const parsed = MenuItemInputSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  try {
    const user = await getOrgUser();

    const menu = await prisma.menu.findFirst({
      where: { id: menuId, property: { orgId: user.orgId } },
      select: { id: true },
    });
    if (!menu) return { ok: false, error: "forbidden" };

    const { name, sourceLang, description, ...rest } = parsed.data;

    const [translatedName, translatedDesc] = await Promise.all([
      translateMenuText(name, sourceLang),
      description ? translateMenuText(description, sourceLang) : Promise.resolve(null),
    ]);

    const last = await prisma.menuItem.findFirst({
      where: { menuId },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });

    const item = await prisma.menuItem.create({
      data: {
        menuId,
        name: translatedName,
        description: translatedDesc ?? undefined,
        category: rest.category,
        price: rest.price,
        imageUrl: rest.imageUrl || null,
        stockQuantity: rest.stockQuantity,
        lowStockThreshold: rest.lowStockThreshold ?? 3,
        displayOrder: (last?.displayOrder ?? -1) + 1,
      },
      select: { id: true },
    });

    return { ok: true, itemId: item.id };
  } catch (err) {
    return toResult("addMenuItem", err) as { ok: false; error: MenuErrorCode };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// updateMenuItem
// ─────────────────────────────────────────────────────────────────────────────

const UpdateMenuItemSchema = MenuItemInputSchema.partial();
export type UpdateMenuItemInput = z.infer<typeof UpdateMenuItemSchema>;

export async function updateMenuItem(
  itemId: string,
  data: UpdateMenuItemInput
): Promise<MenuResult> {
  "use server";
  const parsed = UpdateMenuItemSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  try {
    const user = await getOrgUser();

    const item = await prisma.menuItem.findFirst({
      where: { id: itemId, menu: { property: { orgId: user.orgId } } },
      select: { id: true },
    });
    if (!item) return { ok: false, error: "forbidden" };

    const { name, sourceLang, description, ...rest } = parsed.data;

    let translatedName: MultilingualText | undefined;
    let translatedDesc: MultilingualText | null | undefined;

    if (name && sourceLang) {
      translatedName = await translateMenuText(name, sourceLang);
    }
    if (description !== undefined) {
      if (description && sourceLang) {
        translatedDesc = await translateMenuText(description, sourceLang);
      } else if (!description) {
        translatedDesc = null;
      }
    }

    await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        ...(translatedName && { name: translatedName }),
        ...(translatedDesc !== undefined && {
          description: translatedDesc === null ? Prisma.DbNull : translatedDesc,
        }),
        ...(rest.category !== undefined && { category: rest.category }),
        ...(rest.price !== undefined && { price: rest.price }),
        ...(rest.imageUrl !== undefined && { imageUrl: rest.imageUrl || null }),
        ...(rest.stockQuantity !== undefined && { stockQuantity: rest.stockQuantity }),
        ...(rest.lowStockThreshold !== undefined && {
          lowStockThreshold: rest.lowStockThreshold,
        }),
      },
    });

    return { ok: true };
  } catch (err) {
    return toResult("updateMenuItem", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// deleteMenuItem
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteMenuItem(itemId: string): Promise<MenuResult> {
  "use server";
  try {
    const user = await getOrgUser();

    const item = await prisma.menuItem.findFirst({
      where: { id: itemId, menu: { property: { orgId: user.orgId } } },
      select: { id: true },
    });
    if (!item) return { ok: false, error: "forbidden" };

    await prisma.menuItem.delete({ where: { id: itemId } });
    return { ok: true };
  } catch (err) {
    return toResult("deleteMenuItem", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// toggleItemAvailability
// ─────────────────────────────────────────────────────────────────────────────

export async function toggleItemAvailability(itemId: string): Promise<MenuResult> {
  "use server";
  try {
    const user = await getOrgUser();

    const item = await prisma.menuItem.findFirst({
      where: { id: itemId, menu: { property: { orgId: user.orgId } } },
      select: { id: true, isAvailable: true },
    });
    if (!item) return { ok: false, error: "forbidden" };

    await prisma.menuItem.update({
      where: { id: itemId },
      data: { isAvailable: !item.isAvailable },
    });
    return { ok: true };
  } catch (err) {
    return toResult("toggleItemAvailability", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// updateItemDisplayOrder
// ─────────────────────────────────────────────────────────────────────────────

export async function updateItemDisplayOrder(
  updates: { id: string; displayOrder: number }[],
  menuId: string
): Promise<MenuResult> {
  "use server";
  if (!updates.length) return { ok: true };

  try {
    const user = await getOrgUser();

    const menu = await prisma.menu.findFirst({
      where: { id: menuId, property: { orgId: user.orgId } },
      select: { id: true },
    });
    if (!menu) return { ok: false, error: "forbidden" };

    await prisma.$transaction(
      updates.map(({ id, displayOrder }) =>
        prisma.menuItem.update({
          where: { id, menuId },
          data: { displayOrder },
        })
      )
    );

    return { ok: true };
  } catch (err) {
    return toResult("updateItemDisplayOrder", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// updateItemStock
// ─────────────────────────────────────────────────────────────────────────────

export async function updateItemStock(
  itemId: string,
  quantity: number
): Promise<MenuResult> {
  "use server";
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { ok: false, error: "invalid_input" };
  }

  try {
    const user = await getOrgUser();

    const item = await prisma.menuItem.findFirst({
      where: { id: itemId, menu: { property: { orgId: user.orgId } } },
      select: { id: true },
    });
    if (!item) return { ok: false, error: "forbidden" };

    await prisma.menuItem.update({
      where: { id: itemId },
      data: { stockQuantity: quantity },
    });
    return { ok: true };
  } catch (err) {
    return toResult("updateItemStock", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// publishMenu
// ─────────────────────────────────────────────────────────────────────────────

export async function publishMenu(menuId: string): Promise<MenuResult> {
  "use server";
  try {
    const user = await getOrgUser();
    const access = await getOrgAccess(user.orgId);
    if (!access.canPublishMenu) {
      return { ok: false, error: "forbidden" };
    }

    const menu = await prisma.menu.findFirst({
      where: { id: menuId, property: { orgId: user.orgId } },
      select: {
        id: true,
        _count: { select: { items: true } },
        property: {
          select: {
            iban: true,
            acceptCash: true,
            stripeAccountId: true,
            stripeOnboardingComplete: true,
          },
        },
      },
    });
    if (!menu) return { ok: false, error: "forbidden" };

    const hasPaymentMethod = !!(
      (menu.property.stripeAccountId && menu.property.stripeOnboardingComplete) ||
      menu.property.iban ||
      menu.property.acceptCash
    );

    if (menu._count.items === 0) return { ok: false, error: "invalid_input" };
    if (!hasPaymentMethod) return { ok: false, error: "invalid_input" };

    await prisma.menu.update({
      where: { id: menuId },
      data: { isDraft: false },
    });
    return { ok: true };
  } catch (err) {
    return toResult("publishMenu", err);
  }
}
