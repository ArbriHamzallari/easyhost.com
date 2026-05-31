import { redirect } from "next/navigation";
import { ensureOrgExists, getOnboardingState, saveOrgIntent } from "@/backend/lib/org";
import { WizardStep } from "@/frontend/components/dashboard/wizard-step";
import { IntentPicker } from "@/frontend/components/dashboard/intent-picker-form";

export default async function OnboardingIntentPage() {
  await ensureOrgExists();

  const state = await getOnboardingState();
  if (state.hasProperty) redirect("/dashboard");

  async function handleIntent(formData: FormData) {
    "use server";
    const intentType = formData.get("intentType") as string;
    const result = await saveOrgIntent({ intentType });
    if (result.ok) redirect("/onboarding/property");
  }

  return (
    <WizardStep
      step={1}
      eyebrow="Step 1 of 6"
      title="What kind of host are you?"
      subtitle="This helps us personalise your experience and suggest the right menu templates."
    >
      <form action={handleIntent} className="mx-auto max-w-2xl">
        <IntentPicker name="intentType" />
      </form>
    </WizardStep>
  );
}
