import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;

  const property = await prisma.property.findUnique({
    where: { slug, isActive: true },
    select: {
      // Never select iban, stripeAccountId, or stripeOnboardingComplete here.
      // Payment method details are resolved server-side at checkout time (Phase 4).
      id: true,
      name: true,
      slug: true,
      currency: true,
      accentColor: true,
      logoUrl: true,
      heroImageUrl: true,
      welcomeMessage: true,
      menus: {
        where: { isDraft: false, isActive: true },
        take: 1,
        select: {
          id: true,
          items: {
            where: { isAvailable: true },
            orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              imageUrl: true,
              price: true,
              currency: true,
              stockQuantity: true,
            },
          },
        },
      },
    },
  });

  if (!property || property.menus.length === 0) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const menu = property.menus[0]!;

  // Group items by category
  const itemsByCategory: Record<string, typeof menu.items> = {};
  for (const item of menu.items) {
    if (!itemsByCategory[item.category]) itemsByCategory[item.category] = [];
    itemsByCategory[item.category]!.push(item);
  }

  return NextResponse.json({
    property: {
      name: property.name,
      slug: property.slug,
      currency: property.currency,
      accentColor: property.accentColor,
      logoUrl: property.logoUrl,
      heroImageUrl: property.heroImageUrl,
      welcomeMessage: property.welcomeMessage,
    },
    menuId: menu.id,
    itemsByCategory,
  });
}
