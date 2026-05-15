import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getActiveOnboardingProperty,
  updatePropertyBranding,
} from "@/backend/lib/org";
import { WizardStep } from "@/frontend/components/dashboard/wizard-step";
import { CloudinaryUpload } from "@/frontend/components/dashboard/cloudinary-upload";
import { ColorPicker } from "@/frontend/components/dashboard/color-picker";
import { Button } from "@/frontend/components/ui/button";

export default async function OnboardingBrandingPage() {
  const propertyId = await getActiveOnboardingProperty();
  if (!propertyId) redirect("/onboarding/property");

  async function handleBranding(formData: FormData) {
    "use server";
    const pid = await getActiveOnboardingProperty();
    if (!pid) redirect("/onboarding/property");

    const logoUrl = (formData.get("logoUrl") as string) || undefined;
    const accentColor = (formData.get("accentColor") as string) || undefined;
    const heroImageUrl = (formData.get("heroImageUrl") as string) || undefined;

    await updatePropertyBranding({ propertyId: pid, logoUrl, accentColor, heroImageUrl });
    redirect("/onboarding/payment");
  }

  return (
    <WizardStep
      step={4}
      eyebrow="Step 4 of 6"
      title="Make it yours"
      subtitle="Add your logo and brand colors so the guest menu feels like part of your property. You can always update this later."
    >
      <div className="mx-auto mb-8 max-w-xl rounded-[12px] border border-[var(--border)] bg-white px-4 py-3 text-[13px] text-[var(--muted)]">
        <span className="font-semibold text-[var(--foreground)]">Optional now, required later.</span>{" "}
        Branding must be configured before generating your QR code.
      </div>

      <form action={handleBranding} className="mx-auto max-w-xl space-y-7">
        <CloudinaryUpload
          name="logoUrl"
          label="Logo"
          hint="Square image, PNG or JPG. Shown at the top of your guest menu."
          aspectRatio="square"
        />

        <ColorPicker
          name="accentColor"
          label="Brand color"
          hint="Used for buttons and highlights on your guest menu."
          defaultValue="#FF5A1F"
        />

        <CloudinaryUpload
          name="heroImageUrl"
          label="Hero image"
          hint="A wide photo of your property — shown as the header on the guest menu."
          aspectRatio="wide"
        />

        <div className="flex items-center justify-between pt-2">
          <Button asChild variant="ghost" size="lg">
            <Link href="/onboarding/payment">Skip for now</Link>
          </Button>
          <Button type="submit" size="lg">
            Continue
          </Button>
        </div>
      </form>
    </WizardStep>
  );
}
