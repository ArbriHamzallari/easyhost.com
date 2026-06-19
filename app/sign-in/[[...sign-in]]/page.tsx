import { Suspense } from "react";
import { SignInPage } from "@/components/ui/sign-in-page";
import { AuthLoadingGate } from "@/frontend/components/ui/auth-loading-gate";

export default function Page() {
  return (
    <Suspense fallback={<AuthLoadingGate isLoaded={false} label="Sign-in" />}>
      <SignInPage />
    </Suspense>
  );
}
