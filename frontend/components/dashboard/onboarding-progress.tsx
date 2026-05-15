"use client";

const STEPS = [
  "You",
  "Property",
  "Location",
  "Branding",
  "Payments",
  "Done",
];

export function OnboardingProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, idx) => {
        const step = idx + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${
                  done
                    ? "bg-[var(--primary)] text-white"
                    : active
                      ? "border-2 border-[var(--primary)] text-[var(--primary)]"
                      : "border-2 border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7.2l2.8 2.8 6.2-6.4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`hidden text-[11px] font-medium sm:block ${
                  active ? "text-[var(--primary)]" : "text-[var(--muted)]"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`mx-1.5 h-px w-8 sm:mx-2 sm:w-12 ${
                  done ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
