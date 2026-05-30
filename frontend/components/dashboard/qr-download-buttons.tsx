"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";

type Props = {
  propertyId: string;
  guestUrl: string;
};

export function QrDownloadButtons({ propertyId, guestUrl }: Props) {
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(guestUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`/api/properties/${propertyId}/qr?format=png`}
        download
        className="inline-flex items-center gap-1.5 rounded-[10px] bg-[var(--primary)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
      >
        <Download className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
        Download PNG
      </a>
      <a
        href={`/api/properties/${propertyId}/qr?format=svg`}
        download
        className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
      >
        <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        Download SVG
      </a>
      <button
        type="button"
        onClick={copyUrl}
        className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[var(--success)]" strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        )}
        {copied ? "Copied!" : "Copy URL"}
      </button>
    </div>
  );
}
