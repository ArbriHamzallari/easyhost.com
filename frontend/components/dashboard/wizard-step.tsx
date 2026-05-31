import { OnboardingProgress } from "./onboarding-progress";

interface WizardStepProps {
  step: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function WizardStep({ step, eyebrow, title, subtitle, children }: WizardStepProps) {
  return (
    <div>
      {/* Progress */}
      <div className="flex justify-center">
        <OnboardingProgress currentStep={step} />
      </div>

      {/* Heading */}
      <div className="mt-10 text-center">
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-2 font-display text-[28px] font-semibold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-[36px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="mt-10">{children}</div>
    </div>
  );
}
