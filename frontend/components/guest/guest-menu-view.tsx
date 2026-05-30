"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { getCategoryLabel } from "@/frontend/lib/guest-category";
import { toMenuItemLocale } from "@/frontend/lib/guest-locale";
import { useGuestLocale } from "@/frontend/components/guest/guest-intl-provider";
import { GuestLocaleSwitcher } from "@/frontend/components/guest/guest-locale-switcher";
import { MenuItemDetailSheet } from "@/frontend/components/guest/menu-item-detail-sheet";
import {
  type GuestCartLine,
  type GuestMenuItem,
  getItemName,
  readCart,
  writeCart,
} from "@/frontend/lib/guest-cart";

type Props = {
  slug: string;
  propertyName: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  welcomeMessage: string | null;
  accentColor: string;
  currency: string;
  categories: string[];
  itemsByCategory: Record<string, GuestMenuItem[]>;
  orderingEnabled: boolean;
};

export function GuestMenuView({
  slug,
  propertyName,
  logoUrl,
  heroImageUrl,
  welcomeMessage,
  accentColor,
  currency,
  categories,
  itemsByCategory,
  orderingEnabled,
}: Props) {
  const t = useTranslations("guestMenu");
  const { locale } = useGuestLocale();
  const menuItemLocale = toMenuItemLocale(locale);

  const [cart, setCart] = useState<GuestCartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [detailItem, setDetailItem] = useState<GuestMenuItem | null>(null);

  useEffect(() => {
    setCart(readCart(slug));
    setHydrated(true);
  }, [slug]);

  const persist = useCallback(
    (lines: GuestCartLine[]) => {
      writeCart(slug, lines);
      setCart(lines);
    },
    [slug]
  );

  const itemIndex = useMemo(() => {
    const map = new Map<string, GuestMenuItem>();
    for (const cat of categories) {
      for (const item of itemsByCategory[cat] ?? []) {
        map.set(item.id, item);
      }
    }
    return map;
  }, [categories, itemsByCategory]);

  const cartCount = cart.reduce((n, l) => n + l.quantity, 0);

  const cartTotal = cart.reduce((sum, line) => {
    const item = itemIndex.get(line.menuItemId);
    if (!item) return sum;
    return sum + parseFloat(item.price) * line.quantity;
  }, 0);

  const cartTotalFormatted = `${currency} ${cartTotal.toFixed(2)}`;

  function getQty(menuItemId: string) {
    return cart.find((l) => l.menuItemId === menuItemId)?.quantity ?? 0;
  }

  function setQty(menuItemId: string, quantity: number) {
    const item = itemIndex.get(menuItemId);
    if (!item) return;
    const max = item.stockQuantity;
    const next = Math.max(0, Math.min(quantity, max));

    const without = cart.filter((l) => l.menuItemId !== menuItemId);
    if (next === 0) {
      persist(without);
      return;
    }
    persist([...without, { menuItemId, quantity: next }]);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-28">
      {heroImageUrl ? (
        <div className="relative">
          <img
            src={heroImageUrl}
            alt=""
            className="h-44 w-full object-cover sm:h-52"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-lg px-5 pb-5">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt=""
                    className="h-11 w-11 rounded-[10px] border-2 border-white/30 object-cover shadow-md"
                  />
                )}
                <div>
                  <h1 className="font-display text-[24px] font-semibold tracking-tight text-white">
                    {propertyName}
                  </h1>
                  <p className="mt-0.5 text-[13px] text-white/85">
                    {welcomeMessage ?? t("menu.subtitle")}
                  </p>
                </div>
              </div>
              <GuestLocaleSwitcher variant="header" />
            </div>
          </div>
        </div>
      ) : (
        <header
          style={{ backgroundColor: accentColor }}
          className="px-5 py-8 text-white"
        >
          <div className="mx-auto flex max-w-lg items-start justify-between gap-4">
            <div>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt=""
                  className="mb-4 h-12 w-12 rounded-[10px] object-cover"
                />
              )}
              <h1 className="font-display text-[28px] font-semibold tracking-tight">
                {propertyName}
              </h1>
              <p className="mt-1 text-[14px] text-white/80">
                {welcomeMessage ?? t("menu.subtitle")}
              </p>
            </div>
            <GuestLocaleSwitcher variant="header" />
          </div>
        </header>
      )}

      <main className="mx-auto max-w-lg space-y-8 px-5 py-8">
        {categories.length === 0 ? (
          <p className="py-16 text-center text-[15px] text-[#717171]">
            {t("menu.empty")}
          </p>
        ) : (
          categories.map((cat) => (
            <section key={cat}>
              <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#717171]">
                {getCategoryLabel(cat, t, (key) => t.has(key))}
              </h2>
              <ul className="space-y-3">
                {(itemsByCategory[cat] ?? []).map((item) => {
                  const name = getItemName(item.name, menuItemLocale);
                  const desc = item.description
                    ? getItemName(item.description, menuItemLocale)
                    : null;
                  const qty = hydrated ? getQty(item.id) : 0;

                  return (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-[16px] border border-[#EBEBEB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    >
                      <button
                        type="button"
                        onClick={() => setDetailItem(item)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-[12px] object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-[#222222]">
                          {name}
                        </div>
                        {desc && (
                          <div className="mt-0.5 text-[12.5px] leading-snug text-[#717171]">
                            {desc}
                          </div>
                        )}
                        <div
                          className="mt-1.5 text-[14px] font-semibold"
                          style={{ color: accentColor }}
                        >
                          {item.currency}{" "}
                          {parseFloat(item.price).toFixed(2)}
                        </div>
                      </div>
                      </button>
                      {orderingEnabled && (
                        <div className="flex shrink-0 items-center gap-2">
                          {qty > 0 ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setQty(item.id, qty - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-[#222]"
                                aria-label={t("menu.decreaseQty")}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-[1.25rem] text-center text-[14px] font-semibold tabular-nums">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQty(item.id, qty + 1)}
                                disabled={qty >= item.stockQuantity}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white disabled:opacity-40"
                                style={{ backgroundColor: accentColor }}
                                aria-label={t("menu.increaseQty")}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setQty(item.id, 1)}
                              className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-white"
                              style={{ backgroundColor: accentColor }}
                            >
                              {t("menu.add")}
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}

        {!orderingEnabled && (
          <div className="rounded-[14px] border border-[#EBEBEB] bg-white px-5 py-4 text-center">
            <p className="text-[13px] text-[#717171]">
              {t("menu.orderingDisabled")}
            </p>
          </div>
        )}
      </main>

      {detailItem && (
        <MenuItemDetailSheet
          item={detailItem}
          locale={menuItemLocale}
          accentColor={accentColor}
          currency={currency}
          quantity={getQty(detailItem.id)}
          orderingEnabled={orderingEnabled}
          onClose={() => setDetailItem(null)}
          onSetQuantity={(q) => setQty(detailItem.id, q)}
        />
      )}

      {orderingEnabled && hydrated && cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EBEBEB] bg-white/95 px-5 py-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg items-center gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <ShoppingBag
                className="h-5 w-5 shrink-0"
                style={{ color: accentColor }}
              />
              <span className="text-[14px] font-medium text-[#222]">
                {t("menu.cartSummary", {
                  count: cartCount,
                  total: cartTotalFormatted,
                })}
              </span>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href={`/m/${slug}/checkout`}>{t("menu.checkout")}</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
