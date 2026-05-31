"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { X } from "lucide-react";
import type { CloudinaryUploadProps } from "./cloudinary-upload-types";

export type { CloudinaryUploadProps } from "./cloudinary-upload-types";

function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()
  );
}

function UrlOnlyUpload({
  name,
  label,
  hint,
  defaultUrl,
  aspectRatio = "square",
}: CloudinaryUploadProps) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const previewClass =
    aspectRatio === "wide"
      ? "h-24 w-48 rounded-[12px] object-cover"
      : "h-20 w-20 rounded-[12px] object-cover";

  const devHint =
    "Cloudinary is not configured — paste an image URL or leave empty and skip.";

  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--foreground)]">
        {label}
      </label>
      <p className="mt-0.5 text-[11.5px] text-[var(--muted)]">
        {hint ? `${hint} ${devHint}` : devHint}
      </p>

      <input type="hidden" name={name} value={url} />

      <div className="mt-2 space-y-2">
        {url ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={label} className={previewClass} />
            <button
              type="button"
              onClick={() => setUrl("")}
              aria-label={`Remove ${label.toLowerCase()}`}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-[var(--border)] hover:bg-[var(--surface)]"
            >
              <X className="h-3.5 w-3.5 text-[var(--muted)]" aria-hidden="true" />
            </button>
          </div>
        ) : null}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-[12px] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
        />
      </div>
    </div>
  );
}

const CloudinaryWidgetUpload = dynamic(
  () => import("./cloudinary-widget-upload").then((m) => m.CloudinaryWidgetUpload),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-20 w-full items-center justify-center rounded-[12px] border-2 border-dashed border-[var(--border)] bg-[var(--surface)] text-[13px] text-[var(--muted)]">
        Loading uploader…
      </div>
    ),
  },
);

export function CloudinaryUpload(props: CloudinaryUploadProps) {
  if (!isCloudinaryConfigured()) {
    return <UrlOnlyUpload {...props} />;
  }
  return <CloudinaryWidgetUpload {...props} />;
}
