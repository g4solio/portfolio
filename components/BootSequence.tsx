"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

const bootLines = [
  ["LOADING REAL-WORLD EXPERIENCE", "OK"],
  ["CONNECTING DISTRIBUTED SYSTEMS", "OK"],
  ["ENABLING INDUSTRIAL PROTOCOLS", "OK"],
  ["EXTENDING CAPABILITIES WITH AI", "OK"],
  ["SPIDER-SENSE FOR EDGE CASES", "ACTIVE"],
  ["STARTING OSUS", "READY"],
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasBooted = window.sessionStorage.getItem("davide-portfolio-booted") === "true";

    if (reduceMotion || hasBooted) {
      setVisible(false);
      onComplete();
      return;
    }

    const lines = root.querySelectorAll(".boot-line");
    const mark = root.querySelector(".boot-mark");
    const beam = root.querySelector(".boot-beam");

    animate(lines, {
      opacity: { from: 0 },
      translateX: { from: -18 },
      delay: stagger(115),
      duration: 460,
      ease: "out(3)",
    });

    if (mark) {
      animate(mark, {
        opacity: { from: 0 },
        scale: { from: 0.75 },
        delay: 180,
        duration: 650,
        ease: "out(4)",
      });
    }

    const beamTimer = window.setTimeout(() => {
      if (beam) {
        animate(beam, {
          scaleX: [0, 1],
          opacity: [0, 1],
          duration: 520,
          ease: "inOut(3)",
        });
      }
    }, 1050);

    // Hand off into the hero: the console lifts away while the page fades in
    // underneath, so the boot reads as the first frame of the site, not a splash.
    const exitTimer = window.setTimeout(() => {
      window.sessionStorage.setItem("davide-portfolio-booted", "true");
      onComplete();
      const consoleEl = root.querySelector(".boot-console");
      if (consoleEl) {
        animate(consoleEl, {
          opacity: [1, 0],
          translateY: [0, -52],
          duration: 460,
          ease: "in(2)",
        });
      }
      animate(root, {
        opacity: [1, 0],
        duration: 560,
        delay: 140,
        ease: "linear",
        onComplete: () => setVisible(false),
      });
    }, 2250);

    return () => {
      window.clearTimeout(beamTimer);
      window.clearTimeout(exitTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div ref={rootRef} className="boot-screen" role="status" aria-live="polite">
      <button className="boot-skip" type="button" onClick={() => {
        window.sessionStorage.setItem("davide-portfolio-booted", "true");
        setVisible(false);
        onComplete();
      }}>
        Skip intro
      </button>
      <div className="boot-console">
        <div className="boot-heading">
          <span className="boot-mark" aria-hidden="true">DG</span>
          <div>
            <p>DAVIDE.GOZZI</p>
            <span>{"// SYSTEM BOOT"}</span>
          </div>
        </div>
        <div className="boot-lines">
          {bootLines.map(([label, status]) => (
            <div className="boot-line" key={label}>
              <span>{label}</span>
              <i aria-hidden="true" />
              <strong>{status}</strong>
            </div>
          ))}
        </div>
        <div className="boot-beam" aria-hidden="true" />
      </div>
    </div>
  );
}
