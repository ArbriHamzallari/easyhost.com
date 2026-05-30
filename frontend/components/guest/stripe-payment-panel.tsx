"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { Button } from "@/frontend/components/ui/button";
import { clearCart } from "@/frontend/lib/guest-cart";

type InnerProps = {
  slug: string;
  orderId: string;
  returnUrl: string;
  amountLabel: string;
};

function StripePayButton({ slug, orderId, returnUrl, amountLabel }: InnerProps) {
  const t = useTranslations("guestMenu.checkout");
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message ?? t("errors.generic"));
      setSubmitting(false);
      return;
    }

    clearCart(slug);
    router.push(`/m/${slug}/success?order=${encodeURIComponent(orderId)}`);
  }

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="rounded-[10px] bg-[#FFE8DE] px-3 py-2 text-[13px] text-[#C13515]">
          {error}
        </p>
      )}
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={!stripe || submitting}
        onClick={handlePay}
      >
        {submitting ? t("processingPayment") : t("payWithCard", { amount: amountLabel })}
      </Button>
    </div>
  );
}

type Props = InnerProps & {
  publishableKey: string;
  clientSecret: string;
  stripeAccountId: string;
};

export function StripePaymentPanel({
  publishableKey,
  clientSecret,
  stripeAccountId,
  ...inner
}: Props) {
  const stripePromise = useMemo(
    () =>
      loadStripe(publishableKey, {
        stripeAccount: stripeAccountId,
      }),
    [publishableKey, stripeAccountId]
  );

  return (
    <Elements
      stripe={stripePromise as Promise<Stripe | null>}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <StripePayButton {...inner} />
    </Elements>
  );
}
