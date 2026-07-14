"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { osusProjects } from "@/data/portfolio";

export function OsusOrbit() {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const project = osusProjects[active];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = root.querySelectorAll(".orbit-node");
    const rings = root.querySelectorAll(".orbit-ring");

    animate(nodes, {
      opacity: { from: 0 },
      scale: { from: 0.72 },
      delay: stagger(110),
      duration: 650,
      ease: "out(4)",
    });

    animate(rings, {
      rotate: [0, 360],
      duration: 52000,
      loop: true,
      ease: "linear",
    });
  }, []);

  useEffect(() => {
    const panel = rootRef.current?.querySelector(".osus-project-copy");
    if (!panel) return;
    animate(panel, {
      opacity: { from: 0 },
      translateY: { from: 14 },
      duration: 380,
      ease: "out(3)",
    });
  }, [active]);

  return (
    <div ref={rootRef} className={`osus-orbit accent-${project.accent}`}>
      <div className="orbit-map" aria-label="OSUS project ecosystem">
        <div className="orbit-ring orbit-ring-one" aria-hidden="true" />
        <div className="orbit-ring orbit-ring-two" aria-hidden="true" />
        <div className="orbit-core">
          <span>OSUS</span>
          <small>LAB / 01</small>
        </div>
        {osusProjects.map((item, index) => (
          <button
            type="button"
            key={item.name}
            className={`orbit-node orbit-${item.position} accent-${item.accent} ${active === index ? "is-active" : ""}`}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.name}</strong>
          </button>
        ))}
      </div>
      <article className="osus-project-copy" key={project.name}>
        <div className="project-status"><span />{project.status}</div>
        <p className="kicker">{project.category}</p>
        <h3>{project.name}</h3>
        <blockquote>{project.statement}</blockquote>
        <p>{project.description}</p>
        <a href="#contact">Discuss this project <span aria-hidden="true">↗</span></a>
      </article>
    </div>
  );
}
