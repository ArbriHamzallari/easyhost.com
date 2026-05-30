"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { Button } from "@/frontend/components/ui/button";
import type { SubscriptionTier } from "@/backend/lib/subscription";

type Props = {
  orgId: string;
  customerEmail: string;
  currentTier: SubscriptionTier;
  isActive: boolean;
  starterPriceId: string | null;
  proPriceId: string | null;
  clientToken: string | null;
  paddleEnvironment: string;
  earlyBirdDiscountId?: string | null;
};

export function BillingPlans({
  orgId,
  customerEmail,
  currentTier,
  isActive,
  starterPriceId,
  proPriceId,
  clientToken,
  paddleEnvironment,
  earlyBirdDiscountId,
}: Props) {
  const router = useRouter();
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientToken) return;
    initializePaddle({
      environment:
        paddleEnvironment === "production" ? "production" : "sandbox",
      token: clientToken,
    }).then((instance) => {
      if (instance) setPaddle(instance);
    });
  }, [clientToken, paddleEnvironment]);

  async function openCheckout(tier: SubscriptionTier) {
    const priceId = tier === "pro" ? proPriceId : starterPriceId;
    if (!paddle || !priceId) {
      setError("Checkout is not configured. Contact support.");
      return;
    }

    setLoading(tier);
    setError(null);

    try {
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email: customerEmail },
        customData: { orgId },
        ...(earlyBirdDiscountId ? { discountId: earlyBirdDiscountId } : {}),
        settings: {
          successUrl: `${window.location.origin}/settings/billing?success=1`,
        },
      });
    } catch {
      setError("Could not open checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      router.replace("/settings/billing");
      router.refresh();
    }
  }, [router]);

  if (!clientToken) {
    return (
      <p className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] text-[var(--muted)]">
        Paddle billing is not configured in this environment.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-[10px] bg-[#FFE8DE] px-3 py-2 text-[13px] text-[#C13515]">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <PlanCard
          name="Starter"
          price="€15"
          period="/ month"
          description="1 property · perfect for a single rental"
          highlight={currentTier === "starter" && isActive}
          highlightLabel="Current plan"
          cta="Choose Starter"
          loading={loading === "starter"}
          onSelect={() => openCheckout("starter")}
          disabled={!starterPriceId}
        />
        <PlanCard
          name="Pro"
          price="€29"
          period="/ month"
          description="Up to 5 properties · for growing hosts"
          highlight={currentTier === "pro" && isActive}
          highlightLabel="Current plan"
          cta="Choose Pro"
          loading={loading === "pro"}
          onSelect={() => openCheckout("pro")}
          disabled={!proPriceId}
        />
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  description,
  highlight,
  highlightLabel,
  cta,
  loading,
  onSelect,
  disabled,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  highlight?: boolean;
  highlightLabel?: string;
  cta: string;
  loading: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-[16px] border p-5 ${
        highlight
          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
          : "border-[var(--border)] bg-white"
      }`}
    >
      {highlight && highlightLabel && (
        <span className="mb-2 inline-block w-fit rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
          {highlightLabel}
        </span>
      )}
      <h3 className="text-[17px] font-semibold text-[var(--foreground)]">{name}</h3>
      <p className="mt-1 text-[13px] text-[var(--muted)]">{description}</p>
      <p className="mt-4 font-display text-[32px] font-semibold tracking-tight text-[var(--foreground)]">
        {price}
        <span className="text-[14px] font-normal text-[var(--muted)]">{period}</span>
      </p>
      <Button
        type="button"
        className="mt-5 w-full"
        variant={highlight ? "secondary" : "primary"}
        disabled={disabled || loading || highlight}
        onClick={onSelect}
      >
        {loading ? "Opening…" : highlight ? "Active" : cta}
      </Button>
    </div>
  );
}
