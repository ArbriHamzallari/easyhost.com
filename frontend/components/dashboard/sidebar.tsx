/** @description EasyHost collapsible sidebar navigation for the host dashboard */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Building2,
  UtensilsCrossed,
  QrCode,
  BarChart3,
  Package,
  Settings,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/frontend/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  matchStrategy: "exact" | "startsWith";
  soon?: boolean;
}

interface SidebarProps {
  className?: string;
}

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    matchStrategy: "exact",
  },
  {
    label: "Properties",
    href: "/properties",
    icon: Building2,
    matchStrategy: "startsWith",
  },
  {
    label: "Menu Builder",
    href: "/properties",
    icon: UtensilsCrossed,
    matchStrategy: "startsWith",
  },
  {
    label: "QR Codes",
    href: "/properties",
    icon: QrCode,
    matchStrategy: "startsWith",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    matchStrategy: "startsWith",
    soon: true,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
    matchStrategy: "startsWith",
    soon: true,
  },
];

const ACCOUNT_ITEMS: NavItem[] = [
  {
    label: "Settings",
    href: "/settings/billing",
    icon: Settings,
    matchStrategy: "startsWith",
  },
  {
    label: "Help",
    href: "mailto:hello@easyhost.pro",
    icon: HelpCircle,
    matchStrategy: "exact",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Logo({ open }: { open: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-4">
      {/* Brand mark */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
        style={{ background: "var(--primary)" }}
      >
        <Home className="h-5 w-5 text-white" strokeWidth={2} />
      </div>

      {/* Wordmark — hidden when collapsed */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "w-auto opacity-100" : "w-0 opacity-0"
        )}
      >
        <p
          className="whitespace-nowrap text-[15px] leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          <span className="font-normal">Easy</span>
          <span className="font-display font-semibold">Host</span>
        </p>
        <p
          className="whitespace-nowrap text-[11px]"
          style={{ color: "var(--muted)" }}
        >
          Host Dashboard
        </p>
      </div>
    </div>
  );
}

function NavOption({
  item,
  open,
  active,
}: {
  item: NavItem;
  open: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  const inner = (
    <span
      className={cn(
        "group flex items-center gap-3 rounded-xl px-2 py-2.5 text-[13.5px] transition-all duration-150",
        active
          ? "border-l-2 font-medium"
          : "border-l-2 border-transparent hover:opacity-80",
        item.soon && "pointer-events-none opacity-40"
      )}
      style={
        active
          ? {
              borderLeftColor: "var(--primary)",
              background: "var(--primary-soft)",
              color: "var(--primary)",
            }
          : {
              borderLeftColor: "transparent",
              color: "var(--muted)",
            }
      }
      onMouseEnter={(e) => {
        if (!active && !item.soon) {
          (e.currentTarget as HTMLElement).style.background = "var(--surface)";
          (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "";
          (e.currentTarget as HTMLElement).style.color = "var(--muted)";
        }
      }}
    >
      <Icon
        className={cn("h-[18px] w-[18px] shrink-0", !open && "mx-auto")}
        strokeWidth={active ? 2 : 1.75}
      />

      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-200",
          open ? "w-auto opacity-100" : "w-0 opacity-0"
        )}
      >
        {item.label}
      </span>

      {/* "Soon" badge */}
      {item.soon && open && (
        <span
          className="ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] leading-tight"
          style={{
            background: "var(--stone)",
            color: "var(--muted)",
          }}
        >
          Soon
        </span>
      )}
    </span>
  );

  if (item.soon) {
    return <div>{inner}</div>;
  }

  return (
    <Link href={item.href} className="block">
      {inner}
    </Link>
  );
}

function ToggleButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-2 py-2.5 text-[13px] transition-all duration-150"
      )}
      style={{ color: "var(--muted)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--surface)";
        (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "";
        (e.currentTarget as HTMLElement).style.color = "var(--muted)";
      }}
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
    >
      {open ? (
        <>
          <ChevronsLeft className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          <span className="overflow-hidden whitespace-nowrap transition-all duration-200">
            Hide
          </span>
        </>
      ) : (
        <ChevronsRight className="mx-auto h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  // Start collapsed on mobile, open on desktop
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => setOpen(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function isActive(item: NavItem): boolean {
    if (item.matchStrategy === "exact") return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col overflow-hidden transition-all duration-200 ease-in-out",
        open ? "w-56" : "w-14",
        className
      )}
      style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <Logo open={open} />

      {/* Divider */}
      <div className="mx-3 mb-2" style={{ height: 1, background: "var(--border)" }} />

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2">
        {NAV_ITEMS.map((item, i) => (
          <React.Fragment key={item.label}>
            {/* Subtle spacer before the "soon" group */}
            {item.soon && NAV_ITEMS[i - 1] && !NAV_ITEMS[i - 1].soon && (
              <div className="my-1 mx-1" style={{ height: 1, background: "var(--border)" }} />
            )}
            <NavOption
              item={item}
              open={open}
              active={isActive(item)}
            />
          </React.Fragment>
        ))}
      </nav>

      {/* Account section */}
      <div className="px-2 pb-2">
        <div
          className="mb-2 mt-1"
          style={{ height: 1, background: "var(--border)" }}
        />
        {ACCOUNT_ITEMS.map((item) => (
          <NavOption
            key={item.label}
            item={item}
            open={open}
            active={isActive(item)}
          />
        ))}

        {/* Collapse toggle */}
        <div className="mt-1">
          <ToggleButton open={open} onClick={() => setOpen((o) => !o)} />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
