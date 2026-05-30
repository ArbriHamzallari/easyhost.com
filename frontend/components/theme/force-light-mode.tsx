"use client";

import { useEffect } from "react";
import { applyLightMode } from "@/frontend/lib/theme";

/** Ensures marketing/auth pages stay light when navigating from the dashboard. */
export function ForceLightMode() {
  useEffect(() => {
    applyLightMode();
  }, []);

  return null;
}
