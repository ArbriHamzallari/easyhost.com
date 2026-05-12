import { getTranslations } from "next-intl/server";

interface GuestPhoneProps {
  scale?: number;
  showCheckout?: boolean;
}

export async function GuestPhone({
  scale = 1,
  showCheckout = true,
}: GuestPhoneProps) {
  const t = await getTranslations();

  const items: { name: string; size: string; price: string; tone: string }[] = [
    {
      name: t("landing.hero.scene.menu.i1"),
      size: t("landing.hero.scene.menu.i1size"),
      price: "€2.50",
      tone: "from-[#E16A4A] to-[#7C2A1A]",
    },
    {
      name: t("landing.hero.scene.menu.i2"),
      size: t("landing.hero.scene.menu.i2size"),
      price: "€4.00",
      tone: "from-[#C99548] to-[#7A5418]",
    },
    {
      name: t("landing.hero.scene.menu.i3"),
      size: t("landing.hero.scene.menu.i3size"),
      price: "€6.00",
      tone: "from-[#A5B58A] to-[#5C6E4A]",
    },
    {
      name: t("landing.hero.scene.menu.i4"),
      size: t("landing.hero.scene.menu.i4size"),
      price: "€20.00",
      tone: "from-[#8C8175] to-[#3D362F]",
    },
  ];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center top",
      }}
      className="relative"
    >
      {/* Bezel */}
      <div className="relative h-[600px] w-[300px] rounded-[44px] bg-[#0e0d0b] p-[7px] shadow-[var(--shadow-phone)] ring-1 ring-black/10">
        {/* Side buttons */}
        <span className="absolute left-[-2px] top-[110px] h-7 w-[3px] rounded-full bg-[#1a1714]" />
        <span className="absolute left-[-2px] top-[160px] h-14 w-[3px] rounded-full bg-[#1a1714]" />
        <span className="absolute left-[-2px] top-[225px] h-14 w-[3px] rounded-full bg-[#1a1714]" />
        <span className="absolute right-[-2px] top-[150px] h-20 w-[3px] rounded-full bg-[#1a1714]" />

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[37px] bg-[var(--canvas)]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-4 text-[10px] font-semibold text-[var(--ink)]">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-[8px] w-[14px] rounded-[2px] border border-[var(--ink)]/70 px-[1px]">
                <span className="block h-full w-2/3 rounded-[1px] bg-[var(--ink)]" />
              </span>
            </span>
          </div>

          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-[#0e0d0b]" />

          {/* Content */}
          <div className="mt-3 px-5 pb-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              {t("landing.hero.scene.property")}
            </div>
            <h3 className="mt-1 font-display text-[26px] font-semibold leading-[1.05] text-[var(--ink)]">
              {t("landing.hero.scene.welcome")}
              <br />
              <span className="serif-emph">
                {t("landing.hero.scene.subtitle")}
              </span>
            </h3>

            <div className="mt-4 space-y-2.5">
              {items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-[0_1px_3px_rgba(28,25,23,0.05),0_4px_12px_-6px_rgba(28,25,23,0.08)] ring-1 ring-black/[0.03]"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${it.tone}`}
                  >
                    <div className="h-7 w-3.5 rounded-[3px] bg-white/85 ring-1 ring-white/40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-semibold text-[var(--ink)]">
                      {it.name}
                    </div>
                    <div className="truncate text-[10.5px] text-[var(--muted)]">
                      {it.size}
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold tabular-nums text-[var(--ink)]">
                    {it.price}
                  </div>
                </div>
              ))}
            </div>

            {showCheckout && (
              <div className="mt-4 rounded-2xl bg-[#2f7d3b] py-3.5 text-center text-[13px] font-semibold tracking-tight text-white shadow-[0_8px_18px_-10px_rgba(47,125,59,0.6)]">
                {t("landing.hero.scene.checkout")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
