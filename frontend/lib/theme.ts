/**
 * Dark mode token overrides — single source of truth.
 *
 * Used by:
 *  - app/layout.tsx        → blocking <script> for instant dark mode (no FOUC)
 *  - dashboard-header.tsx  → toggle via document.documentElement.style
 *  - globals.css           → .dark {} block (production build fallback)
 *
 * The values here MUST stay in sync with the .dark {} block in globals.css.
 */
export const DARK_TOKENS: Record<string, string> = {
  "--background": "#19170f",
  "--foreground": "#f0ebe3",
  "--surface": "#221f17",
  "--linen": "#221f17",
  "--border": "#322e25",
  "--muted": "#978a7d",
  "--muted-light": "#5c5449",
  "--stone": "#3b3529",
  "--ink": "#f0ebe3",
  "--card": "#1e1b13",
  "--primary-soft": "rgba(225,106,74,0.16)",
  "--clay": "rgba(244,228,214,0.06)",
  "--champagne": "rgba(239,230,219,0.06)",
  "--success": "#4db362",
  "--warning": "#e0a83a",
  "--error": "#e05a40",
  "--stat-bg-revenue": "rgba(225,106,74,0.16)",
  "--stat-bg-orders": "rgba(47,125,59,0.18)",
  "--stat-bg-qr": "rgba(100,84,185,0.18)",
  "--stat-bg-stock": "rgba(201,139,42,0.18)",
};

export const DARK_TOKEN_KEYS = Object.keys(DARK_TOKENS);

/** Routes where dashboard dark mode is allowed (marketing stays light). */
export function isDashboardRoute(pathname: string): boolean {
  return /^\/(dashboard|properties|settings)(\/|$)/.test(pathname);
}

/** Remove dark mode — used on marketing/guest pages that are light-only. */
export function applyLightMode(): void {
  const el = document.documentElement;
  el.classList.remove("dark");
  for (const key of DARK_TOKEN_KEYS) {
    el.style.removeProperty(key);
  }
}

/** Apply dark mode: add .dark class + set every token as inline style on <html> */
export function applyDarkMode(dark: boolean): void {
  const el = document.documentElement;
  if (dark) {
    el.classList.add("dark");
    for (const [key, value] of Object.entries(DARK_TOKENS)) {
      el.style.setProperty(key, value);
    }
  } else {
    applyLightMode();
  }
}

/**
 * Blocking script for root layout — scopes dark mode to dashboard routes only
 * so the marketing site always renders with light tokens.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var p=location.pathname;var dash=/^\\/(dashboard|properties|settings)(\\/|$)/.test(p);var keys=${JSON.stringify(DARK_TOKEN_KEYS)};var tokens=${JSON.stringify(DARK_TOKENS)};if(!dash){document.documentElement.classList.remove("dark");keys.forEach(function(k){document.documentElement.style.removeProperty(k)});return}var s=localStorage.getItem("easyhost-theme");var d=s==="dark"||(!s&&matchMedia("(prefers-color-scheme:dark)").matches);if(d){document.documentElement.classList.add("dark");for(var k in tokens)document.documentElement.style.setProperty(k,tokens[k])}}catch(e){}})();`;
