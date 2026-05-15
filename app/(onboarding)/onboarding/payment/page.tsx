import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getActiveOnboardingProperty,
  updatePropertyPayment,
} from "@/backend/lib/org";
import { WizardStep } from "@/frontend/components/dashboard/wizard-step";
import { CashToggle } from "@/frontend/components/dashboard/cash-toggle";
import { Button } from "@/frontend/components/ui/button";

export default async function OnboardingPaymentPage() {
  const propertyId = await getActiveOnboardingProperty();
  if (!propertyId) redirect("/onboarding/property");

  async function handlePayment(formData: FormData) {
    "use server";
    const pid = await getActiveOnboardingProperty();
    if (!pid) redirect("/onboarding/property");

    const iban = (formData.get("iban") as string)?.trim().replace(/\s/g, "") || undefined;
    const acceptCash = formData.get("acceptCash") === "on";

    await updatePropertyPayment({ propertyId: pid, iban, acceptCash });
    redirect("/onboarding/complete");
  }

  return (
    <WizardStep
      step={5}
      eyebrow="Step 5 of 6"
      title="How will guests pay you?"
      subtitle="At least one payment method is required before your QR code can go live. You can add more from your settings later."
    >
      <div className="mx-auto mb-8 max-w-xl rounded-[12px] border border-[var(--border)] bg-white px-4 py-3 text-[13px] text-[var(--muted)]">
        <span className="font-semibold text-[var(--foreground)]">Your money, directly to you.</span>{" "}
        Guest payments go straight to your bank account. EasyHost never handles your money.
      </div>

      <form action={handlePayment} className="mx-auto max-w-xl space-y-6">
        {/* IBAN */}
        <div className="rounded-[16px] border border-[var(--border)] bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <div className="flex-1">
              <label htmlFor="iban" className="block text-[14px] font-semibold text-[var(--foreground)]">
                Bank transfer (IBAN)
              </label>
              <p className="mt-0.5 text-[12.5px] text-[var(--muted)]">
                Guests receive your IBAN at checkout and pay via bank transfer.
              </p>
              <input
                id="iban"
                name="iban"
                type="text"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="e.g. AL47212110090000000235698741"
                className="mt-3 w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 font-mono text-[13px] uppercase text-[var(--foreground)] placeholder:font-sans placeholder:normal-case placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>
        </div>

        {/* Cash */}
        <div className="rounded-[16px] border border-[var(--border)] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v2m0 8v2M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--foreground)]">Accept cash</div>
                <div className="mt-0.5 text-[12.5px] text-[var(--muted)]">
                  Guests can mark their order as &ldquo;pay in cash.&rdquo; No setup needed.
                </div>
              </div>
            </div>
            <CashToggle name="acceptCash" defaultChecked />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button asChild variant="ghost" size="lg">
            <Link href="/onboarding/complete">Skip for now</Link>
          </Button>
          <Button type="submit" size="lg">
            Save &amp; continue
          </Button>
        </div>
      </form>
    </WizardStep>
  );
}
