import Link from "next/link";
import { ensureOrgExists } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import { isPaddleConfigured } from "@/backend/lib/paddle";
import { getOrgAccess, type SubscriptionTier } from "@/backend/lib/subscription";
import { TrialBanner } from "@/frontend/components/dashboard/trial-banner";
import { BillingPlans } from "@/frontend/components/dashboard/billing-plans";
import { Button } from "@/frontend/components/ui/button";

type Props = { searchParams: Promise<{ success?: string; error?: string }> };

export default async function BillingSettingsPage({ searchParams }: Props) {
  const { success, error: errorParam } = await searchParams;
  const { orgId, userId } = await ensureOrgExists();

  const [org, user, access] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        subscriptionStatus: true,
        subscriptionTier: true,
        trialEndsAt: true,
        paddleCustomerId: true,
        paddleSubscriptionId: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    }),
    getOrgAccess(orgId),
  ]);

  if (!org || !user) {
    return null;
  }

  const tier = (org.subscriptionTier === "pro" ? "pro" : "starter") as SubscriptionTier;
  const isActive = org.subscriptionStatus === "active";
  const paddleReady = isPaddleConfigured();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <p className="text-[13px] font-medium text-[var(--muted)]">Settings</p>
        <h1 className="mt-1 font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
          Billing &amp; plan
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
          Manage your EasyHost subscription. Guest payments always go directly to
          you — this is only for your host plan.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <TrialBanner
          daysLeft={access.daysLeftInTrial}
          subscriptionStatus={org.subscriptionStatus}
        />

        {success === "1" && (
          <div className="rounded-[12px] border border-[var(--success)]/30 bg-[#E8F5E9] px-4 py-3 text-[13px] text-[#008A05]">
            Thanks! Your payment is processing — this page will update when Paddle
            confirms your subscription.
          </div>
        )}

        {errorParam && (
          <div className="rounded-[12px] border border-[var(--error)]/30 bg-[#FFE8DE] px-4 py-3 text-[13px] text-[var(--error)]">
            Something went wrong opening billing. Please try again.
          </div>
        )}
      </div>

      <section
        className="mb-8 rounded-[16px] border border-[var(--border)] bg-white p-5"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
          Current status
        </h2>
        <dl className="mt-4 grid gap-3 text-[14px] sm:grid-cols-2">
          <div>
            <dt className="text-[12px] font-medium uppercase tracking-wide text-[var(--muted)]">
              Plan
            </dt>
            <dd className="mt-0.5 capitalize text-[var(--foreground)]">
              {isActive ? tier : access.canUseProduct ? `${tier} (trial)` : "None"}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-medium uppercase tracking-wide text-[var(--muted)]">
              Status
            </dt>
            <dd className="mt-0.5 capitalize text-[var(--foreground)]">
              {org.subscriptionStatus.replace(/_/g, " ")}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-medium uppercase tracking-wide text-[var(--muted)]">
              Properties
            </dt>
            <dd className="mt-0.5 text-[var(--foreground)]">
              {access.propertyCount} of {access.maxProperties} used
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-medium uppercase tracking-wide text-[var(--muted)]">
              Guest orders
            </dt>
            <dd className="mt-0.5 text-[var(--foreground)]">
              {access.canAcceptOrders ? "Enabled" : "Locked — upgrade to enable"}
            </dd>
          </div>
        </dl>

        {org.paddleCustomerId && paddleReady && (
          <div className="mt-5 border-t border-[var(--border)] pt-5">
            <Button asChild variant="outline">
              <Link href="/api/billing/portal">Manage subscription in Paddle →</Link>
            </Button>
            <p className="mt-2 text-[12px] text-[var(--muted)]">
              Update payment method, view invoices, or cancel your plan.
            </p>
          </div>
        )}
      </section>

      {!isActive && (
        <section>
          <h2 className="mb-4 text-[15px] font-semibold text-[var(--foreground)]">
            {access.needsUpgrade ? "Choose a plan" : "Change plan"}
          </h2>
          <BillingPlans
            orgId={orgId}
            customerEmail={user.email}
            currentTier={tier}
            isActive={isActive}
            starterPriceId={process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID ?? null}
            proPriceId={process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID ?? null}
            clientToken={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? null}
            paddleEnvironment={
              process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox"
            }
            earlyBirdDiscountId={process.env.PADDLE_EARLY_BIRD_DISCOUNT_ID ?? null}
          />
          {process.env.PADDLE_EARLY_BIRD_DISCOUNT_ID && (
            <p className="mt-3 text-center text-[12px] text-[var(--muted)]">
              Early bird: 50% off for life applied at checkout (first 100 hosts).
            </p>
          )}
        </section>
      )}

      {isActive && tier === "starter" && access.propertyCount >= access.maxProperties && (
        <section className="mt-8">
          <h2 className="mb-4 text-[15px] font-semibold text-[var(--foreground)]">
            Need more properties?
          </h2>
          <BillingPlans
            orgId={orgId}
            customerEmail={user.email}
            currentTier={tier}
            isActive={isActive}
            starterPriceId={process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID ?? null}
            proPriceId={process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID ?? null}
            clientToken={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? null}
            paddleEnvironment={
              process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox"
            }
            earlyBirdDiscountId={process.env.PADDLE_EARLY_BIRD_DISCOUNT_ID ?? null}
          />
        </section>
      )}
    </div>
  );
}
