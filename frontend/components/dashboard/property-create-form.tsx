"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PropertyTypeGrid } from "@/frontend/components/dashboard/property-type-grid";
import { PropertyLimitBanner } from "@/frontend/components/dashboard/property-limit-banner";
import { Button } from "@/frontend/components/ui/button";

type CreatePropertyResult =
  | { ok: true; propertyId: string }
  | { ok: false; error: string };

type Props = {
  subscriptionTier: "starter" | "pro";
  createProperty: (input: {
    name: string;
    type: string;
  }) => Promise<CreatePropertyResult>;
};

export function PropertyCreateForm({ subscriptionTier, createProperty }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    const name = (formData.get("name") as string)?.trim();
    const type = formData.get("type") as string;
    if (!name || !type) return;

    startTransition(async () => {
      const result = await createProperty({ name, type });
      if (result.ok) {
        router.push("/onboarding/address");
        return;
      }
      setError(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {error === "property_limit_exceeded" && (
        <PropertyLimitBanner variant="property_limit" tier={subscriptionTier} />
      )}
      {error === "subscription_locked" && (
        <PropertyLimitBanner variant="subscription_locked" tier={subscriptionTier} />
      )}

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-[13px] font-medium text-[var(--foreground)]"
          >
            Property name <span className="text-[var(--primary)]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Sunset Villa, Studio 4B, The Blue Door…"
            className="mt-1.5 w-full rounded-[10px] border border-[var(--border)] bg-white px-4 py-3 text-[14px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <div>
          <div className="mb-2 text-[13px] font-medium text-[var(--foreground)]">
            Property type <span className="text-[var(--primary)]">*</span>
          </div>
          <PropertyTypeGrid name="type" />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Saving…" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
