import Image from "next/image";
import { cn } from "@/frontend/lib/utils";

interface LogoProps {
  className?: string;
  /** Kept for API compatibility; the asset includes the wordmark. */
  wordmark?: boolean;
  /** Logo height in CSS pixels; width follows the image aspect ratio. */
  size?: number;
}

/** Full wordmark asset is wider than tall (~3.6:1). */
const LOGO_ASPECT = 3.6;

export function Logo({ className, size = 22 }: LogoProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/images/easyhost-logo.png"
        alt="EasyHost"
        width={720}
        height={200}
        className="w-auto object-contain object-left"
        style={{ height: size, width: "auto" }}
        sizes={`${Math.round(size * LOGO_ASPECT)}px`}
        priority
      />
    </span>
  );
}
