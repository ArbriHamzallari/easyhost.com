import { notFound } from "next/navigation";
import { prisma } from "@/backend/lib/prisma";
import { isStripeConfigured } from "@/backend/lib/stripe";
import { GuestMenuView } from "@/frontend/components/guest/guest-menu-view";
import { GuestIntlProvider } from "@/frontend/components/guest/guest-intl-provider";
import { resolveGuestLocale } from "@/frontend/lib/guest-locale.server";
import { toMenuItemLocale } from "@/frontend/lib/guest-locale";
import type { GuestMenuItem } from "@/frontend/lib/guest-cart";

type Params = { params: Promise<{ slug: string }> };

function pickWelcomeMessage(
  raw: unknown,
  locale: string
): string | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }
  const obj = raw as Record<string, string>;
  const key = toMenuItemLocale(locale);
  return obj[key] ?? obj.en ?? null;
}

export default async function GuestMenuPage({ params }: Params) {
  const { slug } = await params;
  const locale = await resolveGuestLocale();

  const property = await prisma.property.findUnique({
    where: { slug, isActive: true },
    select: {
      name: true,
      accentColor: true,
      logoUrl: true,
      heroImageUrl: true,
      welcomeMessage: true,
      currency: true,
      iban: true,
      acceptCash: true,
      stripeAccountId: true,
      stripeOnboardingComplete: true,
      menus: {
        where: { isDraft: false, isActive: true },
        take: 1,
        select: {
          items: {
            where: { isAvailable: true, stockQuantity: { gt: 0 } },
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

  if (!property || property.menus.length === 0) notFound();

  const menu = property.menus[0]!;
  const accent = property.accentColor ?? "#FF5A1F";
  const stripeReady =
    !!property.stripeAccountId &&
    property.stripeOnboardingComplete &&
    isStripeConfigured();
  const orderingEnabled = !!(property.iban || property.acceptCash || stripeReady);

  const categories: string[] = [];
  const itemsByCategory: Record<string, GuestMenuItem[]> = {};

  for (const item of menu.items) {
    const row: GuestMenuItem = {
      id: item.id,
      name: item.name as Record<string, string>,
      description: item.description as Record<string, string> | null,
      category: item.category,
      imageUrl: item.imageUrl,
      price: item.price.toString(),
      currency: item.currency,
      stockQuantity: item.stockQuantity,
    };
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
      categories.push(item.category);
    }
    itemsByCategory[item.category]!.push(row);
  }

  return (
    <GuestIntlProvider initialLocale={locale}>
      <GuestMenuView
        slug={slug}
        propertyName={property.name}
        logoUrl={property.logoUrl}
        heroImageUrl={property.heroImageUrl}
        welcomeMessage={pickWelcomeMessage(property.welcomeMessage, locale)}
        accentColor={accent}
        currency={property.currency}
        categories={categories}
        itemsByCategory={itemsByCategory}
        orderingEnabled={orderingEnabled}
      />
    </GuestIntlProvider>
  );
}
