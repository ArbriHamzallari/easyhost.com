/**
 * Verifies Clerk DNS and required env vars are present (names only).
 * Run: npm run verify:clerk-infra
 */
import { execSync } from "node:child_process";

const REQUIRED_ENV = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL",
] as const;

const CLERK_CNAME_CHECKS = [
  { host: "accounts.easyhost.pro", expect: "accounts.clerk.services" },
  { host: "clerk.easyhost.pro", expect: "frontend-api.clerk.services" },
] as const;

function digCname(host: string): string {
  try {
    return execSync(`dig +short CNAME ${host}`, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

let failed = false;

console.log("── Clerk env vars ──");
for (const key of REQUIRED_ENV) {
  const ok = Boolean(process.env[key]?.trim());
  console.log(`${ok ? "✓" : "✗"} ${key}`);
  if (!ok) failed = true;
}

console.log("\n── Clerk DNS (production domain) ──");
for (const { host, expect } of CLERK_CNAME_CHECKS) {
  const cname = digCname(host).replace(/\.$/, "");
  const ok = cname === expect;
  console.log(`${ok ? "✓" : "✗"} ${host} → ${cname || "(missing)"} (expected ${expect})`);
  if (!ok) failed = true;
}

console.log("\n── Manual checklist (Vercel + Clerk Dashboard) ──");
console.log("• Remove Clerk subdomains from Vercel *project* domains (accounts, clkmail, clk._domainkey, clk2._domainkey)");
console.log("• Keep those as DNS CNAME records only under Domains → easyhost.pro → DNS");
console.log("• Clerk Dashboard → Allowed origins: https://easyhost.pro (and https://www.easyhost.pro during migration)");
console.log("• Clerk Dashboard → Domains → verify easyhost.pro");
console.log("• Vercel Production env: live pk_/sk_ keys from Clerk Dashboard");

if (failed) {
  console.error("\nClerk infra verification failed.");
  process.exit(1);
}

console.log("\nClerk infra verification passed.");
