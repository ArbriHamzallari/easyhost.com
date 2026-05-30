"use client";

import { useEffect } from "react";
import { applyDarkMode } from "@/frontend/lib/theme";

/** Restores saved theme when entering dashboard routes via client navigation. */
export function DashboardThemeInit() {
  useEffect(() => {
    const stored = localStorage.getItem("easyhost-theme");
    const prefersDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    applyDarkMode(prefersDark);
  }, []);

  return null;
}
