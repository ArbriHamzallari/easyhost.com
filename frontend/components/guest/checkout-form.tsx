"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/frontend/components/ui/button";
import { StripePaymentPanel } from "@/frontend/components/guest/stripe-payment-panel";
import { useGuestLocale } from "@/frontend/components/guest/guest-intl-provider";
import { toMenuItemLocale } from "@/frontend/lib/guest-locale";
import {
  clearCart,
  getItemName,
  readCart,
  type GuestMenuItem,
} from "@/frontend/lib/guest-cart";
import type { GuestPaymentMethod } from "@/backend/lib/orders";

type Props = {
  slug: string;
  propertyName: string;
  accentColor: string;
  currency: string;
  methods: GuestPaymentMethod[];
  items: GuestMenuItem[];
  stripePublishableKey: string | null;
  stripeAccountId: string | null;
};

type StripeCheckout = {
  clientSecret: string;
  orderId: string;
};

export function CheckoutForm({
  slug,
  propertyName,
  accentColor,
  currency,
  methods,
  items,
  stripePublishableKey,
  stripeAccountId,
}: Props) {
  const t = useTranslations("guestMenu.checkout");
  const { locale } = useGuestLocale();
  const menuItemLocale = toMenuItemLocale(locale);
  const router = useRouter();

  const [cart, setCart] = useState(readCart(slug));
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<GuestPaymentMethod>(
    methods[0] ?? "cash"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeCheckout, setStripeCheckout] = useState<StripeCheckout | null>(
    null
  );

  useEffect(() => {
    setCart(readCart(slug));
  }, [slug]);

  useEffect(() => {
    if (paymentMethod !== "stripe") setStripeCheckout(null);
  }, [paymentMethod]);

  const itemMap = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items]
  );

  const lines = cart
    .map((line) => {
      const item = itemMap.get(line.menuItemId);
      if (!item) return null;
      return { line, item };
    })
    .filter(Boolean) as {
    line: { menuItemId: string; quantity: number };
    item: GuestMenuItem;
  }[];

  const total = lines.reduce(
    (sum, { line, item }) => sum + parseFloat(item.price) * line.quantity,
    0
  );

  const totalFormatted = `${currency} ${total.toFixed(2)}`;
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/m/${slug}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          paymentMethod,
          language: locale,
        }),
      });

      const data = (await res.json()) as {
        orderId?: string;
        clientSecret?: string;
        error?: string;
      };

      if (!res.ok) {
        const msg =
          data.error === "out_of_stock"
            ? t("errors.outOfStock")
            : data.error === "payment_unavailable"
              ? t("errors.paymentUnavailable")
              : t("errors.generic");
        setError(msg);
        return;
      }

      if (paymentMethod === "stripe" && data.clientSecret && data.orderId) {
        if (!stripePublishableKey || !stripeAccountId) {
          setError(t("errors.paymentUnavailable"));
          return;
        }
        setStripeCheckout({
          clientSecret: data.clientSecret,
          orderId: data.orderId,
        });
        return;
      }

      clearCart(slug);
      router.push(
        `/m/${slug}/success?order=${encodeURIComponent(data.orderId!)}`
      );
    } catch {
      setError(t("errors.network"));
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[15px] text-[#717171]">{t("emptyCart")}</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link href={`/m/${slug}`}>{t("backToMenuLink")}</Link>
        </Button>
      </div>
    );
  }

  const showStripePanel =
    paymentMethod === "stripe" &&
    stripeCheckout &&
    stripePublishableKey &&
    stripeAccountId;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[16px] border border-[#EBEBEB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#717171]">
          {t("yourOrder")}
        </h2>
        <ul className="mt-3 divide-y divide-[#EBEBEB]">
          {lines.map(({ line, item }) => (
            <li
              key={item.id}
              className="flex justify-between gap-3 py-3 text-[14px] first:pt-0 last:pb-0"
            >
              <span className="text-[#222]">
                {getItemName(item.name, menuItemLocale)} × {line.quantity}
              </span>
              <span className="shrink-0 font-semibold tabular-nums">
                {currency}{" "}
                {(parseFloat(item.price) * line.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div
          className="mt-4 flex justify-between border-t border-[#EBEBEB] pt-4 text-[16px] font-semibold"
          style={{ color: accentColor }}
        >
          <span>{t("total")}</span>
          <span className="tabular-nums">{totalFormatted}</span>
        </div>
      </section>

      {!showStripePanel && (
        <>
          <section className="space-y-4 rounded-[16px] border border-[#EBEBEB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#717171]">
              {t("yourDetails")}
            </h2>
            <div>
              <label
                htmlFor="guestName"
                className="mb-1 block text-[13px] font-medium text-[#222]"
              >
                {t("name")}
              </label>
              <input
                id="guestName"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-[10px] border border-[#EBEBEB] bg-[#FAFAF7] px-3 py-2.5 text-[14px] focus:border-[#FF5A1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20"
                autoComplete="name"
              />
            </div>
            <div>
              <label
                htmlFor="guestEmail"
                className="mb-1 block text-[13px] font-medium text-[#222]"
              >
                {t("email")}
              </label>
              <input
                id="guestEmail"
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full rounded-[10px] border border-[#EBEBEB] bg-[#FAFAF7] px-3 py-2.5 text-[14px] focus:border-[#FF5A1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20"
                autoComplete="email"
              />
            </div>
          </section>

          <section className="space-y-3 rounded-[16px] border border-[#EBEBEB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#717171]">
              {t("payment")}
            </h2>
            {methods.map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#EBEBEB] p-3 has-[:checked]:border-[#FF5A1F] has-[:checked]:bg-[#FFE8DE]/40"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="mt-1"
                />
                <div>
                  <div className="text-[14px] font-semibold text-[#222]">
                    {method === "cash"
                      ? t("payCash")
                      : method === "bank_transfer"
                        ? t("payBank")
                        : t("payCard")}
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-[#717171]">
                    {method === "cash"
                      ? t("payCashDesc")
                      : method === "bank_transfer"
                        ? t("payBankDesc")
                        : t("payCardDesc")}
                  </p>
                </div>
              </label>
            ))}
          </section>
        </>
      )}

      {showStripePanel && (
        <section className="rounded-[16px] border border-[#EBEBEB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-[#717171]">
            {t("cardPayment")}
          </h2>
          <StripePaymentPanel
            publishableKey={stripePublishableKey}
            clientSecret={stripeCheckout.clientSecret}
            stripeAccountId={stripeAccountId}
            slug={slug}
            orderId={stripeCheckout.orderId}
            returnUrl={`${appUrl}/m/${slug}/success?order=${encodeURIComponent(stripeCheckout.orderId)}`}
            amountLabel={totalFormatted}
          />
        </section>
      )}

      {error && (
        <p className="rounded-[10px] bg-[#FFE8DE] px-3 py-2 text-[13px] text-[#C13515]">
          {error}
        </p>
      )}

      {!showStripePanel && (
        <>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting
              ? paymentMethod === "stripe"
                ? t("processingPayment")
                : t("placingOrder")
              : paymentMethod === "stripe"
                ? t("payWithCard", { amount: totalFormatted })
                : t("placeOrder", { amount: totalFormatted })}
          </Button>

          <p className="text-center text-[12px] text-[#B0B0B0]">
            {t("disclaimer", { property: propertyName })}
          </p>
        </>
      )}
    </form>
  );
}
