import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  wordmark?: boolean;
  size?: number;
}

export function Logo({ className, wordmark = true, size = 22 }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="lg-eh" x1="0" y1="0" x2="28" y2="28">
            <stop offset="0%" stopColor="#E16A4A" />
            <stop offset="100%" stopColor="#B6452A" />
          </linearGradient>
        </defs>
        <path
          d="M14 1.5l11.5 7v11L14 26.5 2.5 19.5v-11L14 1.5z"
          fill="url(#lg-eh)"
        />
        <path
          d="M14 6.2l7.4 4.5v6.6L14 21.8l-7.4-4.5v-6.6L14 6.2z"
          fill="#FAF8F6"
          opacity="0.92"
        />
        <circle cx="14" cy="14" r="2.6" fill="url(#lg-eh)" />
      </svg>
      {wordmark && (
        <span className="font-display text-[19px] font-semibold tracking-tight text-[var(--ink)]">
          EasyHost
        </span>
      )}
    </span>
  );
}
