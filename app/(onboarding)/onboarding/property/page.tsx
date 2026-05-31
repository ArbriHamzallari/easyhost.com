import { ensureOrgExists, createProperty } from "@/backend/lib/org";
import { prisma } from "@/backend/lib/prisma";
import { WizardStep } from "@/frontend/components/dashboard/wizard-step";
import { PropertyCreateForm } from "@/frontend/components/dashboard/property-create-form";

export default async function OnboardingPropertyPage() {
  const { orgId } = await ensureOrgExists();
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { subscriptionTier: true },
  });
  const tier = org?.subscriptionTier === "pro" ? "pro" : "starter";

  return (
    <WizardStep
      step={2}
      eyebrow="Step 2 of 6"
      title="Tell us about your property"
      subtitle="You can add more properties later from your dashboard."
    >
      <PropertyCreateForm subscriptionTier={tier} createProperty={createProperty} />
    </WizardStep>
  );
}
