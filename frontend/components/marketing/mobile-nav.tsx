"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";

interface MobileNavProps {
  links: { label: string; href: string }[];
  signIn: string;
  signUp: string;
  currentLocale: string;
}

export function MobileNav({ links, signIn, signUp, currentLocale }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on resize past md
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Hamburger button — visible below md */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--ink)] md:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="absolute inset-x-0 top-0 overflow-hidden rounded-b-2xl border-b border-[var(--border)] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mirror the nav height */}
            <div className="h-16" />

            <nav className="flex flex-col px-6 pb-8 pt-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[var(--border)] py-4 text-[16px] font-medium text-[var(--ink)] last:border-0 hover:text-[var(--primary)]"
                >
                  {l.label}
                </Link>
              ))}

              <div className="mt-6 flex flex-col gap-3">
                {/* Language switcher — full width in drawer */}
                <LanguageSwitcher currentLocale={currentLocale} variant="full" />

                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] text-[15px] font-medium text-[var(--ink)] hover:border-[var(--ink)]/40"
                >
                  {signIn}
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--primary)] text-[15px] font-semibold text-white hover:bg-[var(--primary-hover)]"
                >
                  {signUp}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
