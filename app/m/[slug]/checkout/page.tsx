import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getGuestCheckoutOptions } from "@/backend/lib/orders";
import { CheckoutForm } from "@/frontend/components/guest/checkout-form";
import { GuestIntlProvider } from "@/frontend/components/guest/guest-intl-provider";
import { resolveGuestLocale } from "@/frontend/lib/guest-locale.server";
import { prisma } from "@/backend/lib/prisma";
import type { GuestMenuItem } from "@/frontend/lib/guest-cart";

type Params = { params: Promise<{ slug: string }> };

export default async function GuestCheckoutPage({ params }: Params) {
  const { slug } = await params;
  const locale = await resolveGuestLocale();
  const t = await getTranslations("guestMenu.checkout");

  const checkout = await getGuestCheckoutOptions(slug);
  if (!checkout.ok) notFound();

  const opts = checkout.data;

  const property = await prisma.property.findUnique({
    where: { slug, isActive: true },
    select: {
      name: true,
      accentColor: true,
      stripeAccountId: true,
      menus: {
        where: { isDraft: false, isActive: true },
        take: 1,
        select: {
          items: {
            where: { isAvailable: true, stockQuantity: { gt: 0 } },
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
  if (opts.methods.length === 0) redirect(`/m/${slug}`);

  const items: GuestMenuItem[] = property.menus[0]!.items.map((item) => ({
    id: item.id,
    name: item.name as Record<string, string>,
    description: item.description as Record<string, string> | null,
    category: item.category,
    imageUrl: item.imageUrl,
    price: item.price.toString(),
    currency: item.currency,
    stockQuantity: item.stockQuantity,
  }));

  return (
    <GuestIntlProvider initialLocale={locale}>
      <div className="min-h-screen bg-[#FAFAF7]">
        <header className="border-b border-[#EBEBEB] bg-white px-5 py-4">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <Link
              href={`/m/${slug}`}
              className="text-[13px] font-medium text-[#717171] hover:text-[#222]"
            >
              {t("backToMenu")}
            </Link>
            <h1 className="text-[17px] font-semibold text-[#222]">
              {t("title")}
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-5 py-8">
          <CheckoutForm
            slug={slug}
            propertyName={opts.propertyName}
            accentColor={opts.accentColor ?? "#FF5A1F"}
            currency={opts.currency}
            methods={opts.methods}
            items={items}
            stripePublishableKey={opts.stripePublishableKey}
            stripeAccountId={property.stripeAccountId}
          />
        </main>
      </div>
    </GuestIntlProvider>
  );
}
