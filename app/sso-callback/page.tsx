"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import type { SignInStatus, SignUpStatus } from "@clerk/shared/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthLoadingGate } from "@/frontend/components/ui/auth-loading-gate";
import { safeRedirectPath } from "@/frontend/lib/safe-redirect";

const DASHBOARD_URL = "/dashboard";
const ONBOARDING_URL = "/onboarding";

export default function SSOCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const signInDestination = safeRedirectPath(
    searchParams.get("redirect_url"),
    DASHBOARD_URL
  );

  const navigateToSignIn = useCallback(() => {
    const redirect = searchParams.get("redirect_url");
    const qs = redirect ? `?redirect_url=${encodeURIComponent(redirect)}` : "";
    router.push(`/sign-in${qs}`);
  }, [router, searchParams]);

  const finalizeSignIn = useCallback(async () => {
    const { error: finErr } = await signIn.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          const destination = decorateUrl("/sign-in");
          if (destination.startsWith("http")) {
            window.location.href = destination;
            return;
          }
          router.push(destination);
          return;
        }

        const destination = decorateUrl(signInDestination);
        if (destination.startsWith("http")) {
          window.location.href = destination;
        } else {
          router.push(destination);
        }
      },
    });
    if (finErr) setError(finErr.message ?? "Sign-in could not be completed.");
  }, [signIn, router, signInDestination]);

  const finalizeSignUp = useCallback(async () => {
    const { error: finErr } = await signUp.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          const destination = decorateUrl("/sign-up");
          if (destination.startsWith("http")) {
            window.location.href = destination;
            return;
          }
          router.push(destination);
          return;
        }

        const destination = decorateUrl(ONBOARDING_URL);
        if (destination.startsWith("http")) {
          window.location.href = destination;
        } else {
          router.push(destination);
        }
      },
    });
    if (finErr) setError(finErr.message ?? "Sign-up could not be completed.");
  }, [signUp, router]);

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || hasRun.current) {
        return;
      }
      hasRun.current = true;

      const signInComplete = (): boolean =>
        (signIn.status as SignInStatus) === "complete";
      const signUpComplete = (): boolean =>
        (signUp.status as SignUpStatus) === "complete";

      try {
        if (signInComplete()) {
          await finalizeSignIn();
          return;
        }

        if (signUp.isTransferable) {
          const { error: transferErr } = await signIn.create({ transfer: true });
          if (transferErr) {
            setError(transferErr.message ?? "OAuth sign-in failed.");
            return;
          }

          if (signInComplete()) {
            await finalizeSignIn();
            return;
          }

          navigateToSignIn();
          return;
        }

        if (
          signIn.status === "needs_first_factor" &&
          !signIn.supportedFirstFactors?.every((f) => f.strategy === "enterprise_sso")
        ) {
          navigateToSignIn();
          return;
        }

        if (signIn.isTransferable) {
          const { error: transferErr } = await signUp.create({ transfer: true });
          if (transferErr) {
            setError(transferErr.message ?? "OAuth sign-up failed.");
            return;
          }

          if (signUpComplete()) {
            await finalizeSignUp();
            return;
          }

          router.push("/sign-up");
          return;
        }

        if (signUpComplete()) {
          await finalizeSignUp();
          return;
        }

        if (signIn.status === "needs_second_factor" || signIn.status === "needs_new_password") {
          navigateToSignIn();
          return;
        }

        if (signIn.existingSession || signUp.existingSession) {
          const sessionId =
            signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId;
          if (sessionId) {
            await clerk.setActive({
              session: sessionId,
              navigate: async ({ session: activeSession, decorateUrl }) => {
                if (activeSession?.currentTask) {
                  const destination = decorateUrl("/sign-in");
                  if (destination.startsWith("http")) {
                    window.location.href = destination;
                    return;
                  }
                  router.push(destination);
                  return;
                }

                const destination = decorateUrl(signInDestination);
                if (destination.startsWith("http")) {
                  window.location.href = destination;
                } else {
                  router.push(destination);
                }
              },
            });
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "OAuth callback failed unexpectedly."
        );
      }
    })();
  }, [
    clerk,
    signIn,
    signUp,
    router,
    finalizeSignIn,
    finalizeSignUp,
    navigateToSignIn,
    signInDestination,
  ]);

  if (!clerk.loaded) {
    return <AuthLoadingGate isLoaded={false} label="OAuth sign-in" />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] px-6 text-center">
        <p className="text-[17px] font-semibold text-[var(--foreground)]">
          Sign-in could not be completed
        </p>
        <p className="max-w-sm text-[14px] text-[var(--muted)]">{error}</p>
        <button
          type="button"
          onClick={navigateToSignIn}
          className="rounded-[10px] bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 py-12">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Finishing sign-in…
      </p>
      <div id="clerk-captcha" className="mt-10 w-full max-w-md min-h-[1px]" />
    </div>
  );
}
