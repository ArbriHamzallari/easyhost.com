import { redirect } from "next/navigation";
import { getOnboardingState } from "@/backend/lib/org";

// /welcome was the Phase 1 waitlist confirmation page. On the Phase 2 branch,
// new sign-ups go straight to the property wizard. This route only exists to
// catch any stale Clerk redirect URLs and forward to the right place.

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const state = await getOnboardingState();

  if (!state.hasOrg) redirect("/sign-in");
  redirect(state.hasProperty ? "/dashboard" : "/onboarding");
}
