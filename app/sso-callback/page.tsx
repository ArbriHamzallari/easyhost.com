"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import type { SignInStatus, SignUpStatus } from "@clerk/shared/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const DASHBOARD_URL = "/dashboard";
const ONBOARDING_URL = "/onboarding";

export default function SSOCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  const navigateToSignIn = () => {
    router.push("/sign-in");
  };

  const finalizeSignIn = async () => {
    await signIn.finalize({
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

        const destination = decorateUrl(DASHBOARD_URL);
        if (destination.startsWith("http")) {
          window.location.href = destination;
        } else {
          router.push(destination);
        }
      },
    });
  };

  const finalizeSignUp = async () => {
    await signUp.finalize({
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
  };

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

      if (signInComplete()) {
        await finalizeSignIn();
        return;
      }

      if (signUp.isTransferable) {
        const { error } = await signIn.create({ transfer: true });
        if (error) {
          navigateToSignIn();
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
        const { error } = await signUp.create({ transfer: true });
        if (error) {
          navigateToSignIn();
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

              const destination = decorateUrl(DASHBOARD_URL);
              if (destination.startsWith("http")) {
                window.location.href = destination;
              } else {
                router.push(destination);
              }
            },
          });
        }
      }
    })();
  }, [clerk, signIn, signUp, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 py-12">
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Finishing sign-in…
      </p>
      <div id="clerk-captcha" className="mt-10 w-full max-w-md min-h-[1px]" />
    </div>
  );
}
