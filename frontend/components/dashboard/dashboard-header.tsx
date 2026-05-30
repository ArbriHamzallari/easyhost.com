/** @description EasyHost dashboard sticky top header — page title, property pill, notifications, dark mode, user avatar */
"use client";

import { useState, useEffect } from "react";
import { Bell, Moon, Sun, Building2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { applyDarkMode } from "@/frontend/lib/theme";

interface DashboardHeaderProps {
  title: string;
  greeting?: string;
  propertyName?: string;
}

export function DashboardHeader({
  title,
  greeting,
  propertyName,
}: DashboardHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  // Sync React state with whatever the blocking <script> in layout.tsx already applied
  useEffect(() => {
    const active = document.documentElement.classList.contains("dark");
    setIsDark(active);
  }, []);

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    applyDarkMode(next);
    localStorage.setItem("easyhost-theme", next ? "dark" : "light");
  }

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3.5"
      style={{ background: "var(--background)", borderColor: "var(--border)" }}
    >
      {/* Left: page title + greeting */}
      <div>
        <h1
          className="font-display text-[20px] font-semibold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </h1>

        {(greeting || propertyName) && (
          <div className="mt-0.5 flex items-center gap-2">
            {greeting && (
              <p className="text-[13px]" style={{ color: "var(--muted)" }}>
                {greeting}
              </p>
            )}
            {propertyName && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{
                  background: "var(--primary-soft)",
                  color: "var(--primary)",
                }}
              >
                <Building2 className="h-2.5 w-2.5" strokeWidth={2} />
                {propertyName}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Notification bell */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
          style={{
            color: "var(--muted)",
            borderColor: "var(--border)",
            background: "var(--card)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
            (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--card)";
            (e.currentTarget as HTMLElement).style.color = "var(--muted)";
          }}
          aria-label="Notifications"
        >
          <Bell className="h-[17px] w-[17px]" strokeWidth={1.75} />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2"
            style={{
              background: "var(--error)",
              borderColor: "var(--card)",
            }}
            aria-hidden="true"
          />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
          style={{
            color: "var(--muted)",
            borderColor: "var(--border)",
            background: "var(--card)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
            (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--card)";
            (e.currentTarget as HTMLElement).style.color = "var(--muted)";
          }}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="h-[17px] w-[17px]" strokeWidth={1.75} />
          ) : (
            <Moon className="h-[17px] w-[17px]" strokeWidth={1.75} />
          )}
        </button>

        {/* Clerk user avatar */}
        <div className="ml-1">
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
