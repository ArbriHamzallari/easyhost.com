"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { MenuResult } from "@/backend/lib/menu";

type Props = {
  menuId: string;
  disabled: boolean;
  publish: (menuId: string) => Promise<MenuResult>;
};

export function PublishButton({ menuId, disabled, publish }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handlePublish() {
    startTransition(async () => {
      const result = await publish(menuId);
      if (result.ok) router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={disabled || pending}
      className="rounded-[10px] bg-[var(--primary)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
    >
      {pending ? "Publishing…" : "Publish menu"}
    </button>
  );
}
