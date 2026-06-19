"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

const TIMEOUT_MS = 8000;

type AuthLoadingGateProps = {
  isLoaded: boolean;
  children?: React.ReactNode;
  label?: string;
};

export function AuthLoadingGate({
  isLoaded,
  children,
  label = "authentication",
}: AuthLoadingGateProps) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (isLoaded) return <>{children}</>;

  if (timedOut) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] px-6 text-center">
        <p className="text-[17px] font-semibold text-[var(--foreground)]">
          Authentication failed to load
        </p>
        <p className="max-w-sm text-[14px] leading-relaxed text-[var(--muted)]">
          {label} could not initialize. This is usually a domain or configuration
          issue — check that Clerk DNS is verified and your browser can reach{" "}
          <span className="font-mono text-[13px]">accounts.easyhost.pro</span>.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
        <p className="text-[12px] text-[var(--muted-light)]">
          Still stuck? Contact{" "}
          <a
            href="mailto:hello@easyhost.pro"
            className="underline hover:text-[var(--foreground)]"
          >
            hello@easyhost.pro
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <Loader2
        className="h-8 w-8 animate-spin"
        style={{ color: "var(--color-primary)" }}
        aria-label="Loading authentication"
      />
    </div>
  );
}
