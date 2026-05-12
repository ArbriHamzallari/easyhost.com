import { getTranslations } from "next-intl/server";
import {
  LayoutGrid,
  Receipt,
  Boxes,
  Building2,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Logo } from "./logo";

type Translator = Awaited<ReturnType<typeof getTranslations>>;

export async function Dashboard() {
  const t = await getTranslations();

  const points = [
    t("landing.dashboard.points.p1"),
    t("landing.dashboard.points.p2"),
    t("landing.dashboard.points.p3"),
    t("landing.dashboard.points.p4"),
    t("landing.dashboard.points.p5"),
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--canvas)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(800px 500px at 80% 100%, rgba(225,106,74,0.06), transparent 60%), radial-gradient(700px 500px at 5% 20%, rgba(244,228,214,0.55), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <div>
              <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--primary)]">
                {t("landing.dashboard.eyebrow")}
              </div>
              <h2 className="mt-3 font-display text-[40px] font-medium leading-[1.05] text-[var(--ink)] sm:text-[48px]">
                {t("landing.dashboard.title")}{" "}
                <span className="serif-emph text-[var(--primary)]">
                  {t("landing.dashboard.titleEmph")}
                </span>
              </h2>
              <p className="mt-5 max-w-md text-[17px] leading-[1.55] text-[var(--muted)]">
                {t("landing.dashboard.subtitle")}
              </p>

              <ul className="mt-8 space-y-3">
                {points.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[15px] text-[var(--ink)]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--clay)] text-[var(--primary-deep)]">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6.2l2.4 2.4 4.6-4.8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <DashboardMockup t={t} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function DashboardMockup({ t }: { t: Translator }) {
  return (
    <div className="relative">
      {/* Browser/window chrome wrapper */}
      <div className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-white shadow-[0_2px_4px_rgba(28,25,23,0.04),0_30px_80px_-30px_rgba(28,25,23,0.35)]">
        {/* Top window bar */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--linen)] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E16A4A]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#C99548]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#6E8067]/70" />
          <div className="ml-3 hidden h-6 max-w-[260px] flex-1 items-center gap-2 rounded-md bg-white px-3 text-[11px] text-[var(--muted)] ring-1 ring-[var(--border)] sm:flex">
            <span className="text-[10px]">app.easyhost.com/dashboard</span>
          </div>
        </div>

        <div className="grid grid-cols-12">
          {/* Sidebar */}
          <aside className="col-span-3 hidden border-r border-[var(--border)] bg-white p-4 md:block">
            <Logo size={18} />
            <nav className="mt-5 space-y-1 text-[12.5px]">
              <SideItem icon={LayoutGrid} label={t("landing.dashboard.ui.tab1")} active />
              <SideItem icon={Receipt} label={t("landing.dashboard.ui.tab2")} />
              <SideItem icon={Boxes} label={t("landing.dashboard.ui.tab3")} />
              <SideItem icon={Building2} label={t("landing.dashboard.ui.tab4")} />
              <SideItem icon={Wallet} label={t("landing.dashboard.ui.tab5")} />
            </nav>
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--linen)] p-3">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Property
              </div>
              <div className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-[var(--ink)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                Sunset Villa
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="col-span-12 md:col-span-9">
            <div className="border-b border-[var(--border)] px-6 py-4">
              <h3 className="font-display text-[20px] font-semibold tracking-tight text-[var(--ink)]">
                {t("landing.dashboard.ui.title")}
              </h3>
            </div>

            <div className="grid gap-3 px-6 pt-5 sm:grid-cols-4">
              <Kpi
                label={t("landing.dashboard.ui.kpi1")}
                value={t("landing.dashboard.ui.kpi1Value")}
                delta={t("landing.dashboard.ui.kpi1Delta")}
                positive
              />
              <Kpi
                label={t("landing.dashboard.ui.kpi2")}
                value={t("landing.dashboard.ui.kpi2Value")}
                delta={t("landing.dashboard.ui.kpi2Delta")}
                positive
              />
              <Kpi
                label={t("landing.dashboard.ui.kpi3")}
                value={t("landing.dashboard.ui.kpi3Value")}
                muted
              />
              <Kpi
                label={t("landing.dashboard.ui.kpi4")}
                value={t("landing.dashboard.ui.kpi4Value")}
                warning
              />
            </div>

            <div className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-5">
              <div className="sm:col-span-3 rounded-[14px] border border-[var(--border)] bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <div className="text-[12.5px] font-semibold text-[var(--ink)]">
                    {t("landing.dashboard.ui.chartLabel")}
                  </div>
                  <div className="text-[11px] text-[var(--muted)]">
                    {t("landing.dashboard.ui.chartRange")}
                  </div>
                </div>
                <BigChart />
              </div>
              <div className="sm:col-span-2 rounded-[14px] border border-[var(--border)] bg-white p-4">
                <div className="text-[12.5px] font-semibold text-[var(--ink)]">
                  {t("landing.dashboard.ui.topItems")}
                </div>
                <ul className="mt-3 space-y-2.5">
                  {[
                    { name: t("landing.dashboard.ui.item1"), n: 42, tone: "from-[#C99548] to-[#7A5418]" },
                    { name: t("landing.dashboard.ui.item2"), n: 38, tone: "from-[#E16A4A] to-[#7C2A1A]" },
                    { name: t("landing.dashboard.ui.item3"), n: 26, tone: "from-[#6E8067] to-[#3F4A3B]" },
                    { name: t("landing.dashboard.ui.item4"), n: 21, tone: "from-[#8C8175] to-[#3D362F]" },
                  ].map((it, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span
                        className={`h-7 w-7 rounded-md bg-gradient-to-br ${it.tone}`}
                      />
                      <span className="flex-1 truncate text-[12px] text-[var(--ink)]">
                        {it.name}
                      </span>
                      <span className="text-[12px] font-semibold tabular-nums text-[var(--ink)]">
                        {it.n}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating revenue receipt */}
      <div className="absolute -bottom-6 -left-6 hidden w-[230px] rotate-[-3deg] rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(28,25,23,0.35)] md:block">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--success)]">
          Payout received
        </div>
        <div className="mt-1 font-display text-[24px] font-semibold text-[var(--ink)]">
          +€128.50
        </div>
        <div className="mt-1 text-[11px] text-[var(--muted)]">
          Paysera · Sunset Villa
        </div>
      </div>
    </div>
  );
}

function SideItem({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
        active
          ? "bg-[var(--linen)] text-[var(--ink)]"
          : "text-[var(--muted)] hover:bg-[var(--linen)]/60"
      }`}
    >
      <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
      <span className="text-[12.5px] font-medium">{label}</span>
      {active && <ChevronRight className="ml-auto h-[14px] w-[14px]" strokeWidth={1.75} />}
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  positive,
  warning,
  muted,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  warning?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-white p-3.5">
      <div className="text-[11px] font-medium text-[var(--muted)]">{label}</div>
      <div
        className={`mt-1 font-display text-[20px] font-semibold tracking-tight ${
          warning ? "text-[var(--warning)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </div>
      {delta && (
        <div
          className={`mt-1 text-[10.5px] font-semibold ${
            positive
              ? "text-[var(--success)]"
              : muted
                ? "text-[var(--muted)]"
                : "text-[var(--muted)]"
          }`}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

function BigChart() {
  const data = [
    14, 18, 16, 22, 19, 26, 24, 28, 25, 31, 27, 34, 30, 36, 33, 41, 38, 46, 44,
    52, 49, 58, 55, 64, 60, 70, 66, 76, 72, 84,
  ];
  const w = 460;
  const h = 132;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / (max - min)) * (h - 14) - 6;
    return [x, y] as const;
  });
  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-3 h-[132px] w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="bigchart-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E16A4A" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#E16A4A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y) => (
        <line
          key={y}
          x1="0"
          x2={w}
          y1={h * y}
          y2={h * y}
          stroke="#ECE7E1"
          strokeDasharray="3 4"
        />
      ))}
      <path d={areaPath} fill="url(#bigchart-area)" />
      <path
        d={linePath}
        fill="none"
        stroke="#E16A4A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="3.5"
        fill="#E16A4A"
      />
    </svg>
  );
}
