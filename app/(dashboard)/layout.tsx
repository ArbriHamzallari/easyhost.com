import { redirect } from "next/navigation";
import { getOnboardingState } from "@/backend/lib/org";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Single DB roundtrip: getOnboardingState() seeds the user record on first
  // login (via requireUser inside) and returns onboarding state.
  const state = await getOnboardingState();

  if (!state.hasOrg) redirect("/sign-in");
  if (!state.hasProperty) redirect("/onboarding");

  return <>{children}</>;
}
