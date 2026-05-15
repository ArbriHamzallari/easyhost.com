"use client";

import { useState } from "react";
import { CldImage, CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Upload, X } from "lucide-react";
import type { CloudinaryUploadProps } from "./cloudinary-upload-types";

export function CloudinaryWidgetUpload({
  name,
  label,
  hint,
  defaultUrl,
  aspectRatio = "square",
}: CloudinaryUploadProps) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--foreground)]">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-[11.5px] text-[var(--muted)]">{hint}</p>}

      <input type="hidden" name={name} value={url} />

      <div className="mt-2">
        {url ? (
          <div className="relative inline-block">
            <CldImage
              src={url}
              alt={label}
              width={aspectRatio === "wide" ? 192 : 80}
              height={aspectRatio === "wide" ? 96 : 80}
              crop="fill"
              className={`rounded-[12px] object-cover ${
                aspectRatio === "wide" ? "h-24 w-48" : "h-20 w-20"
              }`}
            />
            <button
              type="button"
              onClick={() => setUrl("")}
              aria-label={`Remove ${label.toLowerCase()}`}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-[var(--border)] hover:bg-[var(--surface)]"
            >
              <X className="h-3.5 w-3.5 text-[var(--muted)]" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset={uploadPreset}
            onSuccess={(result: CloudinaryUploadWidgetResults) => {
              const info = result?.info;
              if (info && typeof info === "object" && "secure_url" in info) {
                setUrl(info.secure_url as string);
              }
            }}
            options={{
              cropping: true,
              croppingAspectRatio: aspectRatio === "wide" ? 16 / 9 : 1,
              maxFileSize: 5000000,
              clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex h-20 w-full items-center justify-center gap-3 rounded-[12px] border-2 border-dashed border-[var(--border)] bg-[var(--surface)] text-[13px] text-[var(--muted)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
              >
                <Upload className="h-4 w-4" strokeWidth={1.75} />
                Upload {label.toLowerCase()}
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
    </div>
  );
}
