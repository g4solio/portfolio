"use client";

import { useEffect, useState } from "react";

const TYPE_CHARS_PER_SECOND = 45; // the hero statement's reading speed
const TYPE_MAX_CHARS = 300; // longer prints (score, inventory) appear at once

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const URL_RE = /https?:\/\/[^\s]+/g;

/** Plain text with any https URL turned into a link (the Spotify line, the brief's footer). */
export function linkify(text: string) {
  const parts = text.split(URL_RE);
  const urls = text.match(URL_RE) ?? [];
  return parts.flatMap((part, i) =>
    i < urls.length
      ? [
          part,
          <a key={i} href={urls[i]} target="_blank" rel="noreferrer">
            {urls[i]}
          </a>,
        ]
      : [part],
  );
}

/** Types the newest line at reading speed; any click or key completes it. The full text stays in the DOM for assistive tech. */
export function Typed({ text }: { text: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    // Reduced motion and long prints reveal everything on the first tick. A timer rather than
    // animation frames, so the reveal also completes in a background tab.
    const instant = prefersReducedMotion() || text.length > TYPE_MAX_CHARS;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const due = instant ? text.length : Math.min(text.length, Math.floor(elapsed * TYPE_CHARS_PER_SECOND));
      setShown((s) => Math.max(s, due));
      if (due >= text.length) window.clearInterval(timer);
    };
    const timer = window.setInterval(tick, 1000 / TYPE_CHARS_PER_SECOND);
    const finish = () => {
      window.clearInterval(timer);
      setShown(text.length);
    };
    window.addEventListener("pointerdown", finish);
    window.addEventListener("keydown", finish);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
    };
  }, [text]);
  if (shown >= text.length) return <>{linkify(text)}</>;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        <i className="meet-cur" />
      </span>
    </>
  );
}
