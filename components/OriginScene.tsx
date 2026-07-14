"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function OriginScene() {
  const sceneRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = sceneRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rays = root.querySelectorAll(".origin-ray");
    const particles = root.querySelectorAll(".origin-particle");
    const ship = root.querySelector(".origin-ship");

    animate(rays, {
      opacity: [0.12, 0.72, 0.12],
      strokeDashoffset: [80, 0],
      delay: stagger(160),
      duration: 2200,
      loop: true,
      ease: "inOut(2)",
    });

    animate(particles, {
      translateX: [0, -28],
      opacity: [0.1, 0.8, 0.1],
      delay: stagger(190),
      duration: 2000,
      loop: true,
      ease: "linear",
    });

    if (ship) {
      animate(ship, {
        translateY: [-4, 4],
        rotate: [-1.5, 1.5],
        alternate: true,
        loop: true,
        duration: 1400,
        ease: "inOut(2)",
      });
    }
  }, []);

  return (
    <div className="origin-visual" aria-label="Abstract real-time collision prediction visualisation">
      <svg ref={sceneRef} viewBox="0 0 760 430" role="img">
        <defs>
          <linearGradient id="originGlow" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.95" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g className="origin-stars">
          {Array.from({ length: 14 }).map((_, index) => (
            <circle
              className="origin-particle"
              key={index}
              cx={90 + ((index * 47) % 590)}
              cy={45 + ((index * 83) % 330)}
              r={index % 3 === 0 ? 2.4 : 1.2}
            />
          ))}
        </g>
        <g className="origin-obstacles">
          <path d="M580 82l34 19 8 39-25 29-42-4-21-31 11-38z" />
          <path d="M625 269l29 6 18 26-8 31-29 15-33-12-10-31 15-26z" />
          <path d="M470 208l18 9 6 22-14 18-24-2-13-19 7-21z" />
        </g>
        <g className="origin-rays" filter="url(#softGlow)">
          <line className="origin-ray" x1="210" y1="210" x2="566" y2="124" />
          <line className="origin-ray" x1="210" y1="210" x2="624" y2="306" />
          <line className="origin-ray" x1="210" y1="210" x2="468" y2="230" />
        </g>
        <g className="origin-ship" transform="translate(155 177)">
          <path d="M0 33L86 0 67 33 86 66 0 33z" />
          <path d="M18 33L-12 20-12 46z" className="origin-thrust" />
          <circle cx="51" cy="33" r="8" />
        </g>
        <g className="origin-readout">
          <text x="36" y="370">PREDICTION LOOP</text>
          <text x="36" y="392">RAY-BASED · REAL TIME · LOW OVERHEAD</text>
        </g>
      </svg>
    </div>
  );
}
