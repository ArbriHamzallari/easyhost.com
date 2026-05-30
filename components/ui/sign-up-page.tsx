"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useSignUp } from "@clerk/nextjs";
import type { ClerkAPIError } from "@clerk/shared/types";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import { Home, Loader2 } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const MIN_PASSWORD = 6;
const SSO_CALLBACK = "/sso-callback";
const ONBOARDING_URL = "/onboarding";

const LOADING_MESSAGES = [
  "Creating your account…",
  "Setting up your dashboard…",
  "Almost ready…",
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function signUpErrorsSummary(errors: ReturnType<typeof useSignUp>["errors"]): string {
  const g = errors.global?.map((e) => e.message).filter(Boolean) ?? [];
  if (g.length) return g.join(" ");
  const parts = [
    errors.fields.emailAddress?.message,
    errors.fields.password?.message,
    errors.fields.code?.message,
    errors.fields.captcha?.message,
  ].filter(Boolean);
  return parts.join(" ");
}

const LOCAL_STYLES = `
@keyframes eh-gradient-drift {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.9; }
  33% { transform: translate(6%, -4%) scale(1.05); opacity: 1; }
  66% { transform: translate(-5%, 5%) scale(0.98); opacity: 0.85; }
}
@keyframes eh-shimmer {
  0% { transform: translateX(-30%); }
  100% { transform: translateX(30%); }
}
.eh-gradient-slow {
  animation: eh-gradient-drift 18s ease-in-out infinite;
}
.eh-gradient-slow-reverse {
  animation: eh-gradient-drift 22s ease-in-out infinite reverse;
}
.glass-input-wrap {
  position: relative;
  border-radius: 14px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 35%, transparent),
    color-mix(in srgb, white 40%, transparent),
    color-mix(in srgb, var(--color-primary) 25%, transparent)
  );
  box-shadow: 0 8px 32px rgba(28, 25, 23, 0.08);
}
.glass-input-wrap-inner {
  border-radius: 13px;
  background: color-mix(in srgb, var(--card) 82%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.glass-input-wrap input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.85rem 1rem;
  font-size: 15px;
  color: var(--foreground);
}
.glass-input-wrap input::placeholder {
  color: var(--muted-light);
}
.glass-button-wrap {
  position: relative;
  display: inline-flex;
  width: 100%;
}
.glass-button-wrap::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  padding: 1px;
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--color-primary) 55%, transparent),
    rgba(255,255,255,0.35),
    color-mix(in srgb, var(--color-primary) 40%, transparent)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .eh-gradient-slow, .eh-gradient-slow-reverse { animation: none; }
}
`;

export function SignUpPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [loadMsgIndex, setLoadMsgIndex] = useState(0);
  const [successFlash, setSuccessFlash] = useState(false);
  const [apiError, setApiError] = useState<ClerkAPIError | null>(null);

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;
    router.replace(ONBOARDING_URL);
  }, [authLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!verifyLoading) return;
    const id = setInterval(() => {
      setLoadMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, [verifyLoading]);

  const finalizeSignUp = useCallback(async () => {
    const { error: finErr } = await signUp.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          const u = decorateUrl("/sign-up");
          if (u.startsWith("http")) window.location.href = u;
          else router.push(u);
          return;
        }
        const url = decorateUrl(ONBOARDING_URL);
        if (url.startsWith("http")) window.location.href = url;
        else router.push(url);
      },
    });
    if (finErr) throw finErr;
  }, [router, signUp]);

  const combinedError = useMemo(() => {
    const hook = signUpErrorsSummary(errors);
    const api = apiError?.message ?? "";
    return [hook, api].filter(Boolean).join(" ").trim();
  }, [apiError, errors]);

  const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    setApiError(null);
    const { error } = await signUp.sso({
      strategy,
      redirectUrl: ONBOARDING_URL,
      redirectCallbackUrl: SSO_CALLBACK,
    });
    if (error) setApiError(error as ClerkAPIError);
  };

  const handleStep1Continue = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setApiError({
        code: "invalid_email",
        message: "Enter a valid email address.",
        meta: {},
      });
      return;
    }
    const { error } = await signUp.create({ emailAddress: trimmed });
    if (error) {
      setApiError(error as ClerkAPIError);
      return;
    }
    setStep(2);
  };

  const handleStep2Continue = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (password.length < MIN_PASSWORD) {
      setApiError({
        code: "short_password",
        message: `Password must be at least ${MIN_PASSWORD} characters.`,
        meta: {},
      });
      return;
    }
    setStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (password !== confirmPassword) {
      setApiError({
        code: "password_mismatch",
        message: "Passwords do not match.",
        meta: {},
      });
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setApiError({
        code: "short_password",
        message: `Password must be at least ${MIN_PASSWORD} characters.`,
        meta: {},
      });
      return;
    }

    const { error: pwErr } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });
    if (pwErr) {
      setApiError(pwErr as ClerkAPIError);
      return;
    }

    const { error: sendErr } = await signUp.verifications.sendEmailCode();
    if (sendErr) {
      setApiError(sendErr as ClerkAPIError);
      return;
    }

    setEmailCode("");
    setVerifyOpen(true);
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setVerifyLoading(true);
    setLoadMsgIndex(0);
    try {
      const { error: vErr } = await signUp.verifications.verifyEmailCode({
        code: emailCode.trim(),
      });
      if (vErr) {
        setApiError(vErr as ClerkAPIError);
        return;
      }
      if (signUp.status === "complete") {
        confetti({
          particleCount: 140,
          spread: 72,
          startVelocity: 35,
          origin: { y: 0.6 },
          colors: ["#e16a4a", "#f4efe9", "#1c1917", "#ffffff"],
        });
        setSuccessFlash(true);
        try {
          await finalizeSignUp();
        } catch (finErr) {
          setSuccessFlash(false);
          setApiError(finErr as ClerkAPIError);
        }
      } else {
        setApiError({
          code: "signup_incomplete",
          message: "Verification received but sign-up is not complete yet.",
          meta: {},
        });
      }
    } catch (err) {
      setApiError(err as ClerkAPIError);
    } finally {
      setVerifyLoading(false);
    }
  };

  const goBackStep2 = () => {
    setApiError(null);
    setStep(1);
    void signUp.reset();
  };

  if (!authLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
    );
  }

  if (isSignedIn) return null;

  return (
    <>
      <style>{LOCAL_STYLES}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
        {/* Ambient gradient */}
        <svg
          className="pointer-events-none fixed -z-10 h-full w-full opacity-[0.55] dark:opacity-[0.35]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="eh-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
              <stop offset="45%" stopColor="var(--color-champagne)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--color-sage)" stopOpacity="0.25" />
            </linearGradient>
            <radialGradient id="eh-rad" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="var(--color-primary-soft)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#eh-bg-grad)" />
          <circle
            className="eh-gradient-slow"
            cx="22%"
            cy="28%"
            r="38%"
            fill="url(#eh-rad)"
          />
          <circle
            className="eh-gradient-slow-reverse"
            cx="78%"
            cy="72%"
            r="42%"
            fill="url(#eh-rad)"
          />
        </svg>

        <header className="fixed left-0 right-0 top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_80%,transparent)] backdrop-blur-lg">
          <div className="mx-auto flex h-[65px] max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
                style={{ background: "var(--primary)" }}
              >
                <Home className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="font-display text-[17px] tracking-tight">
                <span className="font-normal">Easy</span>
                <span className="font-semibold">Host</span>
              </span>
            </Link>
            <p className="hidden text-sm sm:block" style={{ color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </header>

        <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 pb-24 pt-28 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
              Get started with EasyHost
            </h1>
            <p className="mt-2 text-[15px]" style={{ color: "var(--muted)" }}>
              {step === 1
                ? "Continue with email or a social account"
                : step === 2
                  ? "Your password must be at least 6 characters long."
                  : "Confirm your password to continue"}
            </p>
            <div className="mx-auto mt-6 flex max-w-xs justify-center gap-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition",
                    step >= n ? "opacity-100" : "opacity-25"
                  )}
                  style={{ background: "var(--color-primary)" }}
                />
              ))}
            </div>
          </div>

          {combinedError ? (
            <div
              className="mb-6 rounded-xl border px-4 py-3 text-sm"
              role="alert"
              style={{
                borderColor: "var(--error)",
                background: "color-mix(in srgb, var(--error) 10%, transparent)",
                color: "var(--error)",
              }}
            >
              {combinedError}
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.28 }}
                className="space-y-6"
              >
                <form onSubmit={handleStep1Continue} className="space-y-4">
                  <div className="glass-input-wrap">
                    <div className="glass-input-wrap-inner">
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={fetchStatus === "fetching"}
                    className="glass-button-wrap relative flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {fetchStatus === "fetching" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : null}
                    Continue
                  </button>
                </form>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wide">
                    <span className="bg-[var(--background)] px-3 text-[var(--muted)]">or</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_90%,transparent)] py-3 text-sm font-medium backdrop-blur-md hover:bg-[var(--card)]"
                    onClick={() => handleOAuth("oauth_google")}
                    disabled={fetchStatus === "fetching"}
                  >
                    <GoogleIcon className="h-5 w-5" />
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_90%,transparent)] py-3 text-sm font-medium backdrop-blur-md hover:bg-[var(--card)]"
                    onClick={() => handleOAuth("oauth_github")}
                    disabled={fetchStatus === "fetching"}
                  >
                    <GitHubIcon className="h-5 w-5" />
                    GitHub
                  </button>
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.28 }}
                className="space-y-6"
              >
                <form onSubmit={handleStep2Continue} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Password</label>
                    <div className="glass-input-wrap">
                      <div className="glass-input-wrap-inner">
                        <input
                          type="password"
                          autoComplete="new-password"
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(ev) => setPassword(ev.target.value)}
                          required
                          minLength={MIN_PASSWORD}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 rounded-xl border border-[var(--border)] py-3 text-sm font-medium hover:bg-[var(--surface)]"
                      onClick={goBackStep2}
                    >
                      Go back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl py-3 text-sm font-semibold text-white"
                      style={{ background: "var(--color-primary)" }}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.28 }}
                className="space-y-6"
              >
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Confirm password</label>
                    <div className="glass-input-wrap">
                      <div className="glass-input-wrap-inner">
                        <input
                          type="password"
                          autoComplete="new-password"
                          placeholder="Repeat your password"
                          value={confirmPassword}
                          onChange={(ev) => setConfirmPassword(ev.target.value)}
                          required
                          minLength={MIN_PASSWORD}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 rounded-xl border border-[var(--border)] py-3 text-sm font-medium hover:bg-[var(--surface)]"
                      onClick={() => {
                        setApiError(null);
                        setStep(2);
                      }}
                    >
                      Go back
                    </button>
                    <button
                      type="submit"
                      disabled={fetchStatus === "fetching"}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
                      style={{ background: "var(--color-primary)" }}
                    >
                      {fetchStatus === "fetching" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      Create account
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <p className="mt-10 text-center text-sm sm:hidden" style={{ color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold" style={{ color: "var(--color-primary)" }}>
              Sign in
            </Link>
          </p>

          <div id="clerk-captcha" className="mt-8 min-h-[1px] w-full" />
        </main>

        <AnimatePresence>
          {verifyOpen ? (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-elevated"
              >
                {!successFlash ? (
                  <>
                    <h2 className="font-display text-xl">Check your inbox</h2>
                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                      We sent a verification code to <strong>{email.trim()}</strong>.
                    </p>
                    <form className="mt-5 space-y-4" onSubmit={handleVerifyEmail}>
                      <div className="glass-input-wrap">
                        <div className="glass-input-wrap-inner">
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="6-digit code"
                            value={emailCode}
                            onChange={(ev) => setEmailCode(ev.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={verifyLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
                        style={{ background: "var(--color-primary)" }}
                      >
                        {verifyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Verify & continue
                      </button>
                      <button
                        type="button"
                        className="w-full text-center text-sm font-medium hover:underline"
                        style={{ color: "var(--color-primary)" }}
                        onClick={async () => {
                          setApiError(null);
                          const { error } = await signUp.verifications.sendEmailCode();
                          if (error) setApiError(error as ClerkAPIError);
                        }}
                      >
                        Resend code
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <p className="font-display text-2xl text-[var(--foreground)]">Welcome to EasyHost!</p>
                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                      Redirecting to your dashboard…
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {verifyLoading && !successFlash ? (
            <motion.div
              className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[color-mix(in_srgb,var(--background)_92%,black)] px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2
                className="mb-6 h-10 w-10 animate-spin"
                style={{ color: "var(--color-primary)" }}
              />
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadMsgIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="max-w-sm font-display text-lg text-[var(--foreground)]"
                >
                  {LOADING_MESSAGES[loadMsgIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}

export default SignUpPage;
