import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface TrialBannerProps {
  daysLeft: number;
  subscriptionStatus: string;
}

export function TrialBanner({ daysLeft, subscriptionStatus }: TrialBannerProps) {
  if (subscriptionStatus === "active") return null;

  const isExpired = daysLeft === 0;

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-[14px] px-5 py-3.5 text-[13.5px] ${
        isExpired
          ? "bg-[var(--error)] text-white"
          : daysLeft <= 2
            ? "bg-[var(--warning)] text-white"
            : "bg-[var(--primary-soft)] text-[var(--primary-deep)]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
        <span className="font-medium">
          {isExpired
            ? "Your free trial has ended — activate a plan to keep access."
            : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in your free trial.`}
        </span>
      </div>
      <Link
        href="/settings/billing"
        className="shrink-0 rounded-[8px] bg-white/20 px-3 py-1.5 text-[12px] font-semibold hover:bg-white/30"
      >
        Activate plan →
      </Link>
    </div>
  );
}
