"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type Variant = "property_limit" | "subscription_locked";

type Props = {
  variant: Variant;
  tier?: "starter" | "pro";
};

export function PropertyLimitBanner({ variant, tier = "starter" }: Props) {
  const t = useTranslations("hostApp.propertyLimit");

  const message =
    variant === "subscription_locked"
      ? t("subscriptionLocked")
      : tier === "pro"
        ? t("proMessage")
        : t("starterMessage");

  const cta =
    variant === "subscription_locked" ? t("activateCta") : t("upgradeCta");

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-[14px] border border-[var(--primary)]/25 bg-[var(--primary-soft)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
          strokeWidth={2}
          aria-hidden="true"
        />
        <div>
          <p className="text-[14px] font-semibold text-[var(--foreground)]">
            {t("title")}
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--muted)]">{message}</p>
        </div>
      </div>
      <Link
        href="/settings/billing"
        className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-[var(--primary)] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
      >
        {cta} →
      </Link>
    </div>
  );
}
