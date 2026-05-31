import { redirect } from "next/navigation";
import { getOnboardingState } from "@/backend/lib/org";
import { Sidebar } from "@/frontend/components/dashboard/sidebar";
import { DashboardThemeInit } from "@/frontend/components/theme/dashboard-theme-init";

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

  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)" }}>
      <DashboardThemeInit />
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
