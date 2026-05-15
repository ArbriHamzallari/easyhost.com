import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getActiveOnboardingProperty,
  getPropertyOnboardingChecklist,
} from "@/backend/lib/org";
import { WizardStep } from "@/frontend/components/dashboard/wizard-step";
import { Button } from "@/frontend/components/ui/button";
import { Check, Circle } from "lucide-react";

export default async function OnboardingCompletePage() {
  const propertyId = await getActiveOnboardingProperty();
  if (!propertyId) redirect("/onboarding");

  const checklist = await getPropertyOnboardingChecklist(propertyId);
  if (!checklist) redirect("/onboarding"); // shouldn't happen — would only fail on auth/perm

  const items = [
    { done: true, label: "Property created", link: null, note: null },
    { done: checklist.hasBranding, label: "Branding set up", link: "/onboarding/branding", note: null },
    { done: checklist.hasPayment, label: "Payment method configured", link: "/onboarding/payment", note: null },
    { done: checklist.hasMenu, label: "First menu item added", link: null, note: "Next step →" },
    { done: checklist.hasQr, label: "QR code generated", link: null, note: "After menu →" },
  ];

  const completedCount = items.filter((i) => i.done).length;
  const allDone = completedCount === items.length;

  return (
    <WizardStep
      step={6}
      eyebrow="You're almost there"
      title={allDone ? "You're all set!" : "Your property is ready."}
      subtitle={
        allDone
          ? "Everything is configured. Your guests can start ordering."
          : `${completedCount} of ${items.length} steps complete. You can finish the rest from your dashboard.`
      }
    >
      <div className="mx-auto max-w-md space-y-6">
        <div className="rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    item.done
                      ? "bg-[var(--success)] text-white"
                      : "border-2 border-[var(--border)]"
                  }`}
                >
                  {item.done ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-label="done" />
                  ) : (
                    <Circle className="h-3 w-3 text-[var(--muted)]" aria-label="pending" />
                  )}
                </div>
                <span
                  className={`flex-1 text-[14px] ${
                    item.done ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                  }`}
                >
                  {item.label}
                </span>
                {!item.done && item.link && (
                  <Link
                    href={item.link}
                    className="text-[12px] font-medium text-[var(--primary)] hover:underline"
                  >
                    Complete →
                  </Link>
                )}
                {!item.done && item.note && (
                  <span className="text-[11px] text-[var(--muted)]">{item.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="min-w-[220px]">
            <Link href="/dashboard">Go to your dashboard →</Link>
          </Button>
          <p className="mt-3 text-[12px] text-[var(--muted)]">
            Your 7-day free trial has started. No credit card needed yet.
          </p>
        </div>
      </div>
    </WizardStep>
  );
}
