"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasBooted = window.sessionStorage.getItem("dg-booted") === "true";

    if (reduceMotion || hasBooted) {
      // queueMicrotask (not rAF): must also run in hidden/background tabs
      queueMicrotask(() => {
        setVisible(false);
        onComplete();
      });
      return;
    }

    animate(root.querySelectorAll(".boot-row"), {
      opacity: { from: 0 },
      translateY: { from: 6 },
      delay: stagger(110),
      duration: 240,
      ease: "out(2)",
    });

    // ~1.3s total: the name line travels into the header wordmark while the
    // page fades in underneath, so the boot ends as part of the page.
    const exitTimer = window.setTimeout(() => {
      window.sessionStorage.setItem("dg-booted", "true");
      onComplete();

      const name = root.querySelector<HTMLElement>(".boot-name");
      const target = document.querySelector<HTMLElement>(".wordmark");
      if (name && target) {
        const from = name.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        name.style.transformOrigin = "top left";
        animate(name, {
          translateX: to.left - from.left,
          translateY: to.top - from.top,
          scale: to.height / from.height,
          duration: 360,
          ease: "inOut(3)",
        });
      }
      animate(root.querySelectorAll(".boot-row:not(.boot-name)"), {
        opacity: [1, 0],
        duration: 200,
        ease: "linear",
      });
      animate(root, {
        opacity: [1, 0],
        duration: 260,
        delay: 220,
        ease: "linear",
        onComplete: () => setVisible(false),
      });
    }, 900);

    return () => window.clearTimeout(exitTimer);
  }, [onComplete]);

  if (!visible) return null;

  const skip = () => {
    window.sessionStorage.setItem("dg-booted", "true");
    setVisible(false);
    onComplete();
  };

  return (
    <div ref={rootRef} className="boot" role="status" aria-live="polite">
      <button className="boot-skip" type="button" onClick={skip}>skip</button>
      <div className="boot-stack">
        <p className="boot-row boot-name">davide gozzi</p>
        <p className="boot-row">loading real-world experience … ok</p>
        <p className="boot-row">spider-sense for edge cases … active</p>
      </div>
    </div>
  );
}
