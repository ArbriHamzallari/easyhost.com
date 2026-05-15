"use client";

import { useEffect, useRef, useState } from "react";

interface PropertyTickerProps {
  /** Ordered list of words to cycle through. */
  words: string[];
}

/**
 * Slot-machine / departure-board ticker that cycles through property-type
 * words in the landing page hero headline.
 *
 * Spec:
 *  - 2 500 ms between each word
 *  - translateY upward, 450 ms cubic-bezier(0.23, 1, 0.32, 1)
 *  - On last word → instant reset to position 0 (no transition), then
 *    re-enable transition after one rAF so the loop is seamless
 *  - Fixed pixel width = widest word (measured off-screen at mount)
 *  - Animated word rendered in brand orange (#FF5A1F / --primary)
 */
export function PropertyTicker({ words }: PropertyTickerProps) {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(true);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Duplicate the first word at the end so the reset-to-zero trick is invisible.
  const items = [...words, words[0]];

  /* ---- measure widest word + line height ---- */
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let maxW = 0;
    let h = 0;
    for (const child of children) {
      maxW = Math.max(maxW, child.offsetWidth);
      if (!h) h = child.offsetHeight;
    }
    // Add 2 px horizontal buffer so italics / anti-aliasing don't clip
    setDims({ w: maxW + 2, h });
  }, [words]);

  /* ---- ticker interval ---- */
  useEffect(() => {
    if (!dims) return;

    const id = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;

        // If we just moved to the duplicate-first word (last item), schedule
        // an instant snap back to index 0 once the transition finishes.
        if (next === items.length - 1) {
          setTimeout(() => {
            setTransitioning(false);
            setIndex(0);
            // Re-enable transition after the browser has painted the reset.
            requestAnimationFrame(() => {
              requestAnimationFrame(() => setTransitioning(true));
            });
          }, 460); // slightly longer than the 450 ms transition
        }

        return next;
      });
    }, 2500);

    return () => clearInterval(id);
  }, [dims, items.length]);

  /* ---- pre-measurement fallback: show first word statically ---- */
  if (!dims) {
    return (
      <>
        {/* Hidden measurement span — inherits headline font metrics */}
        <span
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 flex flex-col whitespace-nowrap"
        >
          {words.map((w) => (
            <span key={w} className="block">
              {w}
            </span>
          ))}
        </span>
        <span className="text-[var(--primary)]">{words[0]}</span>
      </>
    );
  }

  const { w, h } = dims;

  return (
    <>
      {/* Keep measurement span alive so fonts don't unload */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 flex flex-col whitespace-nowrap"
      >
        {words.map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </span>

      {/* Visible ticker slot */}
      <span
        className="inline-block overflow-hidden align-bottom"
        style={{ width: w, height: h }}
      >
        <span
          className="flex flex-col"
          style={{
            transform: `translateY(-${index * h}px)`,
            transition: transitioning
              ? "transform 450ms cubic-bezier(0.23, 1, 0.32, 1)"
              : "none",
          }}
        >
          {items.map((word, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-[var(--primary)]"
              style={{ height: h, lineHeight: `${h}px` }}
            >
              {word}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
