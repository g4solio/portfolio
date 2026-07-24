"use client";

import { useEffect, useRef, useState } from "react";

const TINTS = {
  green: { text: "#c9dcc9", hi: "#7ee787" },
  amber: { text: "#e3d3ae", hi: "#e8b34b" },
  white: { text: "#d9d9d3", hi: "#f4f4ec" },
} as const;

// N in steps(N) = the line's character count; undercounting clips the line.
const LINES: { text: string; hi?: string; ch: number; dur: number; delay: number }[] = [
  { text: "DG-BIOS v9.6 — Davide Gozzi · est. 2016", ch: 41, dur: 620, delay: 200 },
  { text: "memory ................. 9 yrs — ", hi: "no leaks detected", ch: 52, dur: 760, delay: 950 },
  { text: "loading real-world experience ......... ", hi: "ok", ch: 44, dur: 660, delay: 1820 },
  { text: "spider-sense for edge cases ........... ", hi: "active", ch: 47, dur: 700, delay: 2600 },
  { text: "mounting /work ........................ ", hi: "6 chapters", ch: 50, dur: 720, delay: 3420 },
  { text: "side quests (osus) .................... ", hi: "4 found", ch: 48, dur: 700, delay: 4260 },
];

const LAST = { text: "boot: portfolio — press any key, or scroll", ch: 43, dur: 640, delay: 5100 };

export function BootSequence({
  onComplete,
  phosphor = "green",
  scanlines = true,
}: {
  onComplete: () => void;
  phosphor?: "green" | "amber" | "white";
  scanlines?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const dismissedRef = useRef(false);

  useEffect(() => {
    // sessionStorage access itself throws when site data is blocked; a throw
    // here would land before the auto-dismiss timer exists and strand the
    // visitor on the boot screen. Degrade to replaying the boot instead.
    let hasBooted = false;
    try {
      hasBooted = window.sessionStorage.getItem("dg-booted") === "true";
    } catch {
      /* storage unavailable — treat as first visit */
    }
    if (hasBooted) {
      // queueMicrotask (not rAF): must also run in hidden/background tabs
      queueMicrotask(() => {
        setVisible(false);
        onComplete();
      });
      return;
    }

    const dismiss = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      try {
        window.sessionStorage.setItem("dg-booted", "true");
      } catch {
        /* storage unavailable — the boot will simply replay next visit */
      }
      // Page fades in beneath while the boot fades out (450ms, see .boot--out).
      onComplete();
      rootRef.current?.classList.add("boot--out");
      window.setTimeout(() => setVisible(false), 450);
    };

    const autoTimer = window.setTimeout(dismiss, 7200);
    const onKey = () => dismiss();
    const onWheel = () => dismiss();
    // touchmove covers swipes on phones, where wheel never fires and the
    // promised "scroll" gesture would otherwise pan the invisible page behind
    const onTouchMove = () => dismiss();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    rootRef.current?.addEventListener("click", dismiss);

    return () => {
      window.clearTimeout(autoTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [onComplete]);

  if (!visible) return null;

  const tint = TINTS[phosphor] ?? TINTS.green;
  const type = (l: { ch: number; dur: number; delay: number }) =>
    ({
      "--tw": `${l.ch}ch`,
      animation: `boot-type ${l.dur}ms steps(${l.ch}) ${l.delay}ms both`,
    }) as React.CSSProperties;

  return (
    <div
      ref={rootRef}
      className="boot"
      role="status"
      aria-live="polite"
      style={{ "--phos": tint.text, "--phos-hi": tint.hi } as React.CSSProperties}
    >
      {scanlines && <div className="boot-scan" aria-hidden="true" />}
      <div className="boot-lines">
        {LINES.map((l) => (
          <p className="boot-line" style={type(l)} key={l.text}>
            {l.text}
            {l.hi && <span className="boot-hi">{l.hi}</span>}
          </p>
        ))}
        <p className="boot-last">
          <span className="boot-line" style={type(LAST)}>{LAST.text}</span>
          <span className="boot-cursor" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}
