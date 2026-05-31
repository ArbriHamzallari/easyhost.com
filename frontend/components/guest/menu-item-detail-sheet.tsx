"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import type { GuestMenuItem } from "@/frontend/lib/guest-cart";
import { getItemName } from "@/frontend/lib/guest-cart";

type Props = {
  item: GuestMenuItem;
  locale: string;
  accentColor: string;
  currency: string;
  quantity: number;
  orderingEnabled: boolean;
  onClose: () => void;
  onSetQuantity: (qty: number) => void;
};

export function MenuItemDetailSheet({
  item,
  locale,
  accentColor,
  currency,
  quantity,
  orderingEnabled,
  onClose,
  onSetQuantity,
}: Props) {
  const t = useTranslations("guestMenu.itemDetail");
  const name = getItemName(item.name, locale);
  const desc = item.description
    ? getItemName(item.description, locale)
    : null;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#FAFAF7]">
      <div className="flex items-center justify-between border-b border-[#EBEBEB] bg-white px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#FAFAF7]"
          aria-label={t("close")}
        >
          <X className="h-5 w-5 text-[#222]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {item.imageUrl ? (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={item.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="aspect-[4/3] w-full"
            style={{ backgroundColor: `${accentColor}18` }}
          />
        )}

        <div className="px-5 py-6">
          <h2 className="font-display text-[26px] font-semibold tracking-tight text-[#222]">
            {name}
          </h2>
          {desc && (
            <p className="mt-2 text-[15px] leading-relaxed text-[#717171]">
              {desc}
            </p>
          )}
          <p
            className="mt-4 text-[22px] font-semibold tabular-nums"
            style={{ color: accentColor }}
          >
            {currency} {parseFloat(item.price).toFixed(2)}
          </p>
          <p className="mt-1 text-[13px] text-[#717171]">
            {item.stockQuantity > 0
              ? t("inStock", { count: item.stockQuantity })
              : t("outOfStock")}
          </p>
        </div>
      </div>

      {orderingEnabled && item.stockQuantity > 0 && (
        <div className="border-t border-[#EBEBEB] bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {quantity > 0 ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => onSetQuantity(quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EBEBEB]"
                  aria-label="-"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="min-w-[2rem] text-center text-[18px] font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onSetQuantity(quantity + 1)}
                  disabled={quantity >= item.stockQuantity}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white disabled:opacity-40"
                  style={{ backgroundColor: accentColor }}
                  aria-label="+"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <Button
                type="button"
                size="lg"
                className="shrink-0"
                onClick={onClose}
              >
                {t("close")}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              size="lg"
              className="w-full"
              style={{ backgroundColor: accentColor }}
              onClick={() => {
                onSetQuantity(1);
                onClose();
              }}
            >
              {t("addToCart")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
