"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[onboarding error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] p-6">
      <div className="max-w-lg rounded-[20px] border border-[var(--border)] bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h1 className="font-display text-[24px] font-semibold text-[var(--foreground)]">
          Something went wrong during onboarding.
        </h1>
        <p className="mt-3 text-[14px] text-[var(--muted)]">
          {error.message}
        </p>
        <p className="mt-2 text-[13px] text-[var(--muted)]">
          Database issues: run <code className="font-mono text-[12px]">npx prisma db push</code>.
          Branding uploads: set <code className="font-mono text-[12px]">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and{" "}
          <code className="font-mono text-[12px]">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> in{" "}
          <code className="font-mono text-[12px]">.env.local</code>, or skip image fields.
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer text-[12px] font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
            Error details
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-[8px] bg-[var(--surface)] p-3 text-[11px] font-mono text-[var(--foreground)]">
            {error.message}
            {error.digest && `\n\nDigest: ${error.digest}`}
          </pre>
        </details>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-[8px] bg-[var(--primary)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-[13px] font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
