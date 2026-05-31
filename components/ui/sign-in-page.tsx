"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { ClerkAPIError } from "@clerk/shared/types";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Maria Rossi",
    handle: "@mariabnb",
    text: "EasyHost doubled our guest extras revenue. Setup took 10 minutes!",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Thomas Weber",
    handle: "@thomashost",
    text: "Our guests love ordering late checkout and snacks from their phone.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Sophie Laurent",
    handle: "@sophiebnb",
    text: "Finally a tool that actually helps hosts earn more. Simple and beautiful.",
  },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=2160&q=80";

const SSO_CALLBACK = "/sso-callback";
const DASHBOARD_URL = "/dashboard";
const REMEMBER_KEY = "easyhost_signin_email";

type AuthMode = "sign-in" | "reset-request" | "reset-verify" | "reset-password";

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

function hookErrorsSummary(
  errors: ReturnType<typeof useSignIn>["errors"]
): string {
  const g = errors.global?.map((e) => e.message).filter(Boolean) ?? [];
  if (g.length) return g.join(" ");
  const parts = [
    errors.fields.identifier?.message,
    errors.fields.password?.message,
    errors.fields.code?.message,
  ].filter(Boolean);
  return parts.join(" ");
}

function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-64 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl dark:bg-black/20",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <Image
          src={testimonial.avatarSrc}
          alt={testimonial.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
          unoptimized
        />
        <div>
          <p className="text-sm font-medium text-white">{testimonial.name}</p>
          <p className="text-xs text-white/60">{testimonial.handle}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-white/90">{testimonial.text}</p>
    </div>
  );
}

export function SignInPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [email, setEmail] = useState(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem(REMEMBER_KEY) ?? "")
      : ""
  );
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem(REMEMBER_KEY))
  );
  const [showPw, setShowPw] = useState(false);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [apiError, setApiError] = useState<ClerkAPIError | null>(null);

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;
    router.replace(DASHBOARD_URL);
  }, [authLoaded, isSignedIn, router]);

  const navigateAfterSignIn = useCallback(
    async (destination: string) => {
      const { error: finErr } = await signIn.finalize({
        navigate: async ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            const url = decorateUrl(`/sign-in`);
            if (url.startsWith("http")) window.location.href = url;
            else router.push(url);
            return;
          }
          const url = decorateUrl(destination);
          if (url.startsWith("http")) window.location.href = url;
          else router.push(url);
        },
      });
      if (finErr) setApiError(finErr as ClerkAPIError);
    },
    [router, signIn]
  );

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (remember && email) localStorage.setItem(REMEMBER_KEY, email);
    else localStorage.removeItem(REMEMBER_KEY);

    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      setApiError(error as ClerkAPIError);
      return;
    }

    if (signIn.status === "complete") {
      await navigateAfterSignIn(DASHBOARD_URL);
    } else if (signIn.status === "needs_second_factor") {
      setApiError({
        code: "second_factor_required",
        message: "Additional verification is required for your account.",
        meta: {},
      });
    } else if (signIn.status === "needs_client_trust") {
      setApiError({
        code: "client_trust_required",
        message: "Complete verification (e.g. email code) to finish signing in.",
        meta: {},
      });
    } else {
      setApiError({
        code: "sign_in_incomplete",
        message: "Could not complete sign-in. Try again or contact support.",
        meta: {},
      });
    }
  };

  const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
    setApiError(null);
    const { error } = await signIn.sso({
      strategy,
      redirectCallbackUrl: SSO_CALLBACK,
      redirectUrl: DASHBOARD_URL,
    });
    if (error) setApiError(error as ClerkAPIError);
  };

  const goResetRequest = () => {
    setMode("reset-request");
    setApiError(null);
    setCodeSent(false);
    setResetCode("");
    setNewPassword("");
  };

  const handleBackToSignIn = async () => {
    setApiError(null);
    setMode("sign-in");
    setCodeSent(false);
    setResetCode("");
    setNewPassword("");
    await signIn.reset();
  };

  const handleResetSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const { error: cErr } = await signIn.create({
      identifier: email.trim(),
    });
    if (cErr) {
      setApiError(cErr as ClerkAPIError);
      return;
    }
    const { error: sErr } = await signIn.resetPasswordEmailCode.sendCode();
    if (sErr) {
      setApiError(sErr as ClerkAPIError);
      return;
    }
    setCodeSent(true);
    setMode("reset-verify");
  };

  const handleResetVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const { error } = await signIn.resetPasswordEmailCode.verifyCode({
      code: resetCode.trim(),
    });
    if (error) {
      setApiError(error as ClerkAPIError);
      return;
    }
    setMode("reset-password");
  };

  const handleResetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password: newPassword,
      signOutOfOtherSessions: true,
    });
    if (error) {
      setApiError(error as ClerkAPIError);
      return;
    }
    if (signIn.status === "complete") {
      await navigateAfterSignIn(DASHBOARD_URL);
    } else if (signIn.status === "needs_second_factor") {
      setApiError({
        code: "second_factor_required",
        message: "Additional verification is required after resetting your password.",
        meta: {},
      });
    } else {
      setApiError({
        code: "reset_incomplete",
        message: "Password reset did not complete. Try again.",
        meta: {},
      });
    }
  };

  const combinedError = useMemo(() => {
    const hook = hookErrorsSummary(errors);
    const api = apiError?.message ?? "";
    return [hook, api].filter(Boolean).join(" ").trim();
  }, [apiError, errors]);

  if (!authLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" style={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  if (isSignedIn) return null;

  const glassInput =
    "w-full rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-[15px] text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] outline-none backdrop-blur-md placeholder:text-[var(--muted-light)] focus:border-orange-500/55 focus:ring-2 focus:ring-orange-500/25 dark:bg-black/20";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--background)]">
      <div className="flex min-h-screen w-full">
        <div className="relative flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <p className="animate-element animate-delay-100 text-4xl font-semibold leading-tight text-[var(--foreground)] md:text-5xl">
              Welcome back
            </p>
            <p
              className="animate-element animate-delay-200 mt-2 text-[15px]"
              style={{ color: "var(--muted)" }}
            >
              Sign in to manage your properties and guest orders
            </p>

            {combinedError ? (
              <div
                className="animate-element animate-delay-200 mt-6 rounded-xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "var(--error)",
                  background: "color-mix(in srgb, var(--error) 12%, transparent)",
                  color: "var(--error)",
                }}
                role="alert"
              >
                {combinedError}
              </div>
            ) : null}

            {mode === "sign-in" ? (
              <form
                className="animate-element animate-delay-300 mt-8 space-y-5"
                onSubmit={handleEmailPasswordSignIn}
              >
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={glassInput}
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-[var(--foreground)]">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-orange-500 hover:underline"
                      style={{ color: "var(--color-primary)" }}
                      onClick={goResetRequest}
                    >
                      Reset password
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      className={cn(glassInput, "pr-12")}
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--muted)] hover:bg-white/10"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={remember}
                    onChange={(ev) => setRemember(ev.target.checked)}
                  />
                  Keep me signed in
                </label>

                <button
                  type="submit"
                  disabled={fetchStatus === "fetching"}
                  className="relative flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold text-white shadow-elevated transition hover:opacity-95 disabled:opacity-60"
                  style={{ background: "var(--color-primary)" }}
                >
                  {fetchStatus === "fetching" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : null}
                  Sign in
                </button>
              </form>
            ) : null}

            {mode === "reset-request" ? (
              <form className="animate-element mt-8 space-y-5" onSubmit={handleResetSendCode}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Enter the email for your account. We will send a reset code.
                </p>
                <div>
                  <label htmlFor="reset-email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    className={glassInput}
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-[var(--border)] py-3 text-sm font-medium"
                    onClick={handleBackToSignIn}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={fetchStatus === "fetching"}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {fetchStatus === "fetching" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Send code
                  </button>
                </div>
              </form>
            ) : null}

            {mode === "reset-verify" && codeSent ? (
              <form className="animate-element mt-8 space-y-5" onSubmit={handleResetVerifyCode}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Enter the code we sent to your email.
                </p>
                <div>
                  <label htmlFor="reset-code" className="mb-2 block text-sm font-medium">
                    Code
                  </label>
                  <input
                    id="reset-code"
                    type="text"
                    autoComplete="one-time-code"
                    className={glassInput}
                    value={resetCode}
                    onChange={(ev) => setResetCode(ev.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-[var(--border)] py-3 text-sm font-medium"
                    onClick={handleBackToSignIn}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={fetchStatus === "fetching"}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {fetchStatus === "fetching" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Verify
                  </button>
                </div>
              </form>
            ) : null}

            {mode === "reset-password" ? (
              <form className="animate-element mt-8 space-y-5" onSubmit={handleResetNewPassword}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Choose a new password for your account.
                </p>
                <div>
                  <label htmlFor="new-password" className="mb-2 block text-sm font-medium">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPw ? "text" : "password"}
                      autoComplete="new-password"
                      className={cn(glassInput, "pr-12")}
                      value={newPassword}
                      onChange={(ev) => setNewPassword(ev.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--muted)] hover:bg-white/10"
                      onClick={() => setShowNewPw((v) => !v)}
                      aria-label={showNewPw ? "Hide password" : "Show password"}
                    >
                      {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={fetchStatus === "fetching"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: "var(--color-primary)" }}
                >
                  {fetchStatus === "fetching" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Update password
                </button>
              </form>
            ) : null}

            {mode === "sign-in" ? (
              <>
                <div className="animate-element animate-delay-400 relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wide">
                    <span className="bg-[var(--background)] px-3 text-[var(--muted)]">or continue with</span>
                  </div>
                </div>

                <div className="animate-element animate-delay-500 flex flex-col gap-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 py-4 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    onClick={() => handleOAuth("oauth_google")}
                    disabled={fetchStatus === "fetching"}
                  >
                    <GoogleIcon className="h-5 w-5" />
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 py-4 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    onClick={() => handleOAuth("oauth_github")}
                    disabled={fetchStatus === "fetching"}
                  >
                    <GitHubIcon className="h-5 w-5" />
                    Continue with GitHub
                  </button>
                </div>
              </>
            ) : null}

            <p className="animate-element animate-delay-600 mt-10 text-center text-sm" style={{ color: "var(--muted)" }}>
              New to EasyHost?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-orange-500 hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Create Account
              </Link>
            </p>

            <div id="clerk-captcha" className="mt-6 min-h-[1px] w-full" />
          </div>
        </div>

        <div className="relative hidden flex-1 p-4 md:block">
          <div className="relative h-full min-h-[calc(100vh-2rem)] overflow-hidden rounded-3xl">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 grain" />

          <div className="absolute bottom-10 left-10 right-10 space-y-4 lg:left-14 lg:right-14">
            <p className="animate-slide-right max-w-lg font-display text-3xl leading-tight text-white lg:text-[2.25rem]">
              The modern upsell layer for hospitality hosts.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <TestimonialCard
                testimonial={testimonials[0]!}
                className="animate-testimonial animate-delay-100"
              />
              <TestimonialCard
                testimonial={testimonials[1]!}
                className="animate-testimonial animate-delay-300 sm:col-span-2 lg:col-span-1 xl:col-span-1 xl:col-start-2 xl:row-start-1"
              />
              <TestimonialCard
                testimonial={testimonials[2]!}
                className="animate-testimonial animate-delay-500 sm:col-span-2 lg:col-span-1"
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
