import { redirect } from "next/navigation";
import { ensureOrgExists, createProperty } from "@/backend/lib/org";
import { WizardStep } from "@/frontend/components/dashboard/wizard-step";
import { PropertyTypeGrid } from "@/frontend/components/dashboard/property-type-grid";
import { Button } from "@/frontend/components/ui/button";

export default async function OnboardingPropertyPage() {
  await ensureOrgExists();

  async function handleProperty(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string)?.trim();
    const type = formData.get("type") as string;

    if (!name || !type) return;

    const result = await createProperty({ name, type });
    if (result.ok) redirect("/onboarding/address");
  }

  return (
    <WizardStep
      step={2}
      eyebrow="Step 2 of 6"
      title="Tell us about your property"
      subtitle="You can add more properties later from your dashboard."
    >
      <form action={handleProperty} className="mx-auto max-w-xl space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-[13px] font-medium text-[var(--foreground)]"
          >
            Property name <span className="text-[var(--primary)]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Sunset Villa, Studio 4B, The Blue Door…"
            className="mt-1.5 w-full rounded-[10px] border border-[var(--border)] bg-white px-4 py-3 text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <div>
          <div className="mb-2 text-[13px] font-medium text-[var(--foreground)]">
            Property type <span className="text-[var(--primary)]">*</span>
          </div>
          <PropertyTypeGrid name="type" />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg">
            Continue
          </Button>
        </div>
      </form>
    </WizardStep>
  );
}
