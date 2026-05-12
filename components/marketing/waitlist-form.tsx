"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { joinWaitlist } from "@/lib/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status =
  | { kind: "idle" }
  | { kind: "success"; alreadyOnList: boolean }
  | { kind: "error"; message: string };

export function WaitlistForm({ source }: { source?: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "idle" });
    startTransition(async () => {
      const result = await joinWaitlist({ email, language: locale, source });
      if (result.ok) {
        setStatus({ kind: "success", alreadyOnList: result.alreadyOnList });
        setEmail("");
      } else {
        const message =
          result.error === "invalid_email"
            ? t("waitlist.invalidEmail")
            : t("waitlist.serverError");
        setStatus({ kind: "error", message });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <div className="group flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-1.5 sm:rounded-[var(--radius-pill)] sm:bg-white sm:p-1.5 sm:shadow-[0_1px_2px_rgba(28,25,23,0.04),0_8px_24px_-12px_rgba(28,25,23,0.18)] sm:ring-1 sm:ring-[var(--border)] sm:focus-within:ring-[var(--primary)]/40">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("common.emailPlaceholder")}
          aria-label="email"
          className="sm:h-11 sm:border-0 sm:bg-transparent sm:px-4 sm:shadow-none sm:ring-0 sm:focus-visible:ring-0"
          disabled={isPending}
        />
        <Button
          type="submit"
          size="md"
          disabled={isPending}
          className="rounded-[var(--radius-pill)] sm:rounded-[999px] sm:px-6"
        >
          {isPending ? "…" : t("waitlist.submit")}
        </Button>
      </div>
      <div className="min-h-[20px]" aria-live="polite">
        {status.kind === "success" && (
          <p role="status" className="mt-3 text-[13px] text-[var(--success)]">
            {status.alreadyOnList
              ? t("waitlist.alreadyOnList")
              : t("waitlist.success")}
          </p>
        )}
        {status.kind === "error" && (
          <p role="alert" className="mt-3 text-[13px] text-[var(--error)]">
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
