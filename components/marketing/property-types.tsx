import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";

export async function PropertyTypes() {
  const t = await getTranslations();

  const types = [
    {
      key: "apartment" as const,
      label: t("landing.propertyTypes.items.apartment"),
      tone: "from-[#C99548] via-[#9D6F2C] to-[#6E4C1A]",
    },
    {
      key: "villa" as const,
      label: t("landing.propertyTypes.items.villa"),
      tone: "from-[#E16A4A] via-[#B8472A] to-[#7C2A1A]",
    },
    {
      key: "boutique" as const,
      label: t("landing.propertyTypes.items.boutique"),
      tone: "from-[#3F4A3B] via-[#28332C] to-[#1B231F]",
    },
    {
      key: "beach" as const,
      label: t("landing.propertyTypes.items.beach"),
      tone: "from-[#A8B7AE] via-[#6E8278] to-[#3D4D47]",
    },
    {
      key: "hostel" as const,
      label: t("landing.propertyTypes.items.hostel"),
      tone: "from-[#A2745A] via-[#7A5037] to-[#4A2F21]",
    },
    {
      key: "eco" as const,
      label: t("landing.propertyTypes.items.eco"),
      tone: "from-[#6E8067] via-[#445540] to-[#28342A]",
    },
    {
      key: "cottage" as const,
      label: t("landing.propertyTypes.items.cottage"),
      tone: "from-[#8C8175] via-[#5C5247] to-[#33291F]",
    },
    {
      key: "suite" as const,
      label: t("landing.propertyTypes.items.suite"),
      tone: "from-[#D4AB7C] via-[#9F7740] to-[#664724]",
    },
  ];

  return (
    <section className="bg-[var(--canvas)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
        <Reveal>
          <div className="max-w-3xl">
            <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
              {t("landing.propertyTypes.eyebrow")}
            </div>
            <h2 className="mt-3 font-display text-[30px] font-medium leading-[1.05] text-[var(--ink)] sm:text-[40px] lg:text-[48px]">
              {t("landing.propertyTypes.title")}{" "}
              <span className="serif-emph text-[var(--primary)]">
                {t("landing.propertyTypes.titleEmph")}
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-[1.55] text-[var(--muted)] sm:text-[17px]">
              {t("landing.propertyTypes.subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {types.map((it, i) => (
            <Reveal key={it.key} delay={i * 50}>
              <PropertyCard kind={it.key} label={it.label} tone={it.tone} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyCard({
  kind,
  label,
  tone,
}: {
  kind:
    | "apartment"
    | "villa"
    | "boutique"
    | "beach"
    | "hostel"
    | "eco"
    | "cottage"
    | "suite";
  label: string;
  tone: string;
}) {
  return (
    <article
      className={`group relative aspect-[4/5] overflow-hidden rounded-[18px] bg-gradient-to-br ${tone} shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[var(--shadow-elevated)]`}
    >
      {/* grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      {/* ambient light */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(255,255,255,0.18), transparent 70%)",
        }}
      />

      {/* illustration */}
      <div className="absolute inset-x-0 top-[18%] flex justify-center">
        <PropertyIllustration kind={kind} />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="font-display text-[18px] font-semibold tracking-tight text-white drop-shadow-sm">
          {label}
        </div>
      </div>
    </article>
  );
}

function PropertyIllustration({
  kind,
}: {
  kind:
    | "apartment"
    | "villa"
    | "boutique"
    | "beach"
    | "hostel"
    | "eco"
    | "cottage"
    | "suite";
}) {
  const s = {
    width: 110,
    height: 110,
  } as const;
  const stroke = "rgba(255,255,255,0.95)";
  const fill = "rgba(255,255,255,0.06)";

  switch (kind) {
    case "apartment":
      return (
        <svg {...s} viewBox="0 0 110 110" fill="none" aria-hidden>
          <rect
            x="22"
            y="22"
            width="66"
            height="76"
            rx="4"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
          />
          {[28, 44, 60, 76].map((y) =>
            [32, 48, 64, 80].map((x) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="6"
                height="8"
                stroke={stroke}
                strokeWidth="1"
              />
            )),
          )}
        </svg>
      );
    case "villa":
      return (
        <svg {...s} viewBox="0 0 110 110" fill="none" aria-hidden>
          <path
            d="M14 56l41-32 41 32v40H14V56z"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
            strokeLinejoin="round"
          />
          <rect
            x="46"
            y="68"
            width="18"
            height="28"
            stroke={stroke}
            strokeWidth="1.4"
          />
          <rect x="28" y="64" width="10" height="10" stroke={stroke} />
          <rect x="72" y="64" width="10" height="10" stroke={stroke} />
        </svg>
      );
    case "boutique":
      return (
        <svg {...s} viewBox="0 0 110 110" fill="none" aria-hidden>
          <rect
            x="22"
            y="20"
            width="66"
            height="80"
            rx="3"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
          />
          <rect x="30" y="32" width="50" height="6" stroke={stroke} />
          <rect x="30" y="46" width="50" height="6" stroke={stroke} />
          <rect x="30" y="60" width="50" height="6" stroke={stroke} />
          <rect x="30" y="74" width="50" height="6" stroke={stroke} />
          <circle cx="55" cy="14" r="6" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case "beach":
      return (
        <svg {...s} viewBox="0 0 110 110" fill="none" aria-hidden>
          <circle cx="86" cy="22" r="9" fill={stroke} opacity="0.92" />
          <path
            d="M14 80c10-3 16 3 26 0s14-3 24 0 14 3 22 0v18H14V80z"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
          />
          <path
            d="M30 70c14-6 16-22 26-22s16 14 30 22"
            stroke={stroke}
            strokeWidth="1.4"
          />
          <path d="M48 56l-4-12M44 44l8-2M44 44l8 2" stroke={stroke} />
        </svg>
      );
    case "hostel":
      return (
        <svg {...s} viewBox="0 0 110 110" fill="none" aria-hidden>
          <rect
            x="18"
            y="34"
            width="74"
            height="56"
            rx="4"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
          />
          <rect x="26" y="46" width="16" height="16" stroke={stroke} />
          <rect x="48" y="46" width="16" height="16" stroke={stroke} />
          <rect x="70" y="46" width="14" height="16" stroke={stroke} />
          <rect x="26" y="68" width="16" height="16" stroke={stroke} />
          <rect x="48" y="68" width="16" height="16" stroke={stroke} />
          <rect x="70" y="68" width="14" height="16" stroke={stroke} />
        </svg>
      );
    case "eco":
      return (
        <svg {...s} viewBox="0 0 110 110" fill="none" aria-hidden>
          <path
            d="M55 16c-22 14-30 30-30 44 0 16 12 28 30 28s30-12 30-28c0-14-8-30-30-44z"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
          />
          <path d="M55 32v50M55 50l-12-8M55 60l12-8M55 70l-12-8" stroke={stroke} />
        </svg>
      );
    case "cottage":
      return (
        <svg {...s} viewBox="0 0 110 110" fill="none" aria-hidden>
          <path
            d="M14 60l41-30 41 30v34H14V60z"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
            strokeLinejoin="round"
          />
          <rect x="46" y="70" width="18" height="24" stroke={stroke} />
          <path d="M14 60h82" stroke={stroke} />
          <rect x="80" y="14" width="8" height="20" stroke={stroke} />
          <path d="M76 14h16" stroke={stroke} />
        </svg>
      );
    case "suite":
      return (
        <svg {...s} viewBox="0 0 110 110" fill="none" aria-hidden>
          <rect
            x="14"
            y="46"
            width="82"
            height="48"
            rx="6"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
          />
          <path
            d="M14 64h28v-14c0-3 3-6 6-6h14c3 0 6 3 6 6v14h28"
            stroke={stroke}
            strokeWidth="1.4"
          />
          <rect x="22" y="76" width="68" height="12" stroke={stroke} />
        </svg>
      );
  }
}
