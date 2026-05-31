import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureOrgExists } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import { isStripeConfigured } from "@/backend/lib/stripe";
import { Button } from "@/frontend/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

type Params = { params: Promise<{ id: string }> };

export default async function PropertySettingsPage({ params }: Params) {
  const { id: propertyId } = await params;
  const { orgId } = await ensureOrgExists();

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId, isActive: true },
    select: {
      id: true,
      name: true,
      iban: true,
      acceptCash: true,
      stripeAccountId: true,
      stripeOnboardingComplete: true,
    },
  });

  if (!property) notFound();

  const stripeConnected =
    !!property.stripeAccountId && property.stripeOnboardingComplete;
  const stripeEnabled = isStripeConfigured();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <nav className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted)]">
        <Link href="/properties" className="hover:text-[var(--foreground)]">
          Properties
        </Link>
        <span>/</span>
        <Link
          href={`/properties/${property.id}`}
          className="hover:text-[var(--foreground)]"
        >
          {property.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">Settings</span>
      </nav>

      <h1 className="mt-4 font-display text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
        Property settings
      </h1>
      <p className="mt-2 text-[14px] text-[var(--muted)]">
        Payment methods for guest checkout on this property.
      </p>

      <section
        className="mt-8 space-y-4 rounded-[16px] border border-[var(--border)] bg-white p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
          Payment methods
        </h2>

        <ul className="space-y-3 text-[14px]">
          <li className="flex items-center gap-2">
            {stripeConnected ? (
              <CheckCircle2
                className="h-4 w-4 text-[var(--success)]"
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <Circle className="h-4 w-4 text-[var(--muted)]" strokeWidth={2} aria-hidden="true" />
            )}
            <span>Stripe Connect {stripeConnected ? "connected" : "not connected"}</span>
          </li>
          <li className="flex items-center gap-2">
            {property.iban ? (
              <CheckCircle2
                className="h-4 w-4 text-[var(--success)]"
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <Circle className="h-4 w-4 text-[var(--muted)]" strokeWidth={2} aria-hidden="true" />
            )}
            <span>Bank transfer (IBAN) {property.iban ? "configured" : "not set"}</span>
          </li>
          <li className="flex items-center gap-2">
            {property.acceptCash ? (
              <CheckCircle2
                className="h-4 w-4 text-[var(--success)]"
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <Circle className="h-4 w-4 text-[var(--muted)]" strokeWidth={2} aria-hidden="true" />
            )}
            <span>Cash payments {property.acceptCash ? "enabled" : "disabled"}</span>
          </li>
        </ul>

        {stripeEnabled && !stripeConnected && (
          <Button asChild className="mt-2">
            <Link href={`/api/stripe/connect?propertyId=${property.id}`}>
              Connect Stripe
            </Link>
          </Button>
        )}

        <p className="text-[12px] text-[var(--muted)]">
          To update IBAN or cash settings, complete the onboarding payment step or
          contact support — full property settings editor ships soon.
        </p>
      </section>

      <div className="mt-6">
        <Button asChild variant="outline">
          <Link href={`/properties/${property.id}`}>← Back to property</Link>
        </Button>
      </div>
    </div>
  );
}
