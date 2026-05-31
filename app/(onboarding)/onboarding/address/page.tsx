import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getActiveOnboardingProperty,
  updatePropertyLocation,
} from "@/backend/lib/org";
import { WizardStep } from "@/frontend/components/dashboard/wizard-step";
import { AddressAutocomplete } from "@/frontend/components/dashboard/address-autocomplete";
import { Button } from "@/frontend/components/ui/button";

const CURRENCIES = [
  { code: "EUR", label: "Euro (€)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "CHF", label: "Swiss Franc (CHF)" },
  { code: "ALL", label: "Albanian Lek (ALL)" },
  { code: "DKK", label: "Danish Krone (DKK)" },
  { code: "SEK", label: "Swedish Krona (SEK)" },
  { code: "NOK", label: "Norwegian Krone (NOK)" },
  { code: "PLN", label: "Polish Zloty (PLN)" },
  { code: "CZK", label: "Czech Koruna (CZK)" },
];

export default async function OnboardingAddressPage() {
  const propertyId = await getActiveOnboardingProperty();
  if (!propertyId) redirect("/onboarding/property");

  async function handleAddress(formData: FormData) {
    "use server";
    const pid = await getActiveOnboardingProperty();
    if (!pid) redirect("/onboarding/property");

    const address = (formData.get("address") as string)?.trim();
    const timezone = (formData.get("timezone") as string)?.trim() || "Europe/Tirane";
    const currency = (formData.get("currency") as string) || "EUR";

    if (!address) return;

    const result = await updatePropertyLocation({
      propertyId: pid,
      address,
      timezone,
      currency,
    });
    if (result.ok) redirect("/onboarding/branding");
  }

  return (
    <WizardStep
      step={3}
      eyebrow="Step 3 of 6"
      title="Where is your property?"
      subtitle="We use this to set your timezone automatically so order times are always correct."
    >
      <form action={handleAddress} className="mx-auto max-w-xl space-y-6">
        <AddressAutocomplete />

        <div>
          <label
            htmlFor="currency"
            className="block text-[13px] font-medium text-[var(--foreground)]"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue="EUR"
            className="mt-1.5 w-full rounded-[10px] border border-[var(--border)] bg-white px-4 py-3 text-[14px] text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          >
            {CURRENCIES.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button asChild variant="ghost" size="lg">
            <Link href="/onboarding/property">Back</Link>
          </Button>
          <Button type="submit" size="lg">
            Continue
          </Button>
        </div>
      </form>
    </WizardStep>
  );
}
