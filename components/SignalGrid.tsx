"use client";

import { useEffect, useRef } from "react";

export function SignalGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onPointerMove = (event: PointerEvent) => {
      const x = `${(event.clientX / window.innerWidth) * 100}%`;
      const y = `${(event.clientY / window.innerHeight) * 100}%`;
      element.style.setProperty("--pointer-x", x);
      element.style.setProperty("--pointer-y", y);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return <div ref={ref} className="signal-grid" aria-hidden="true" />;
}
