import type { ReactNode } from "react";
import type { SchematicId } from "@/data/portfolio";

/**
 * Ink-on-paper technical diagrams. Strokes use pathLength=1 so CSS can run a
 * draw-in when a case study opens; without animation they render fully drawn.
 */
export function Schematic({ id }: { id: SchematicId }) {
  return (
    <svg
      className="schematic"
      viewBox="0 0 320 200"
      role="img"
      aria-label={labels[id]}
      xmlns="http://www.w3.org/2000/svg"
    >
      {diagrams[id]}
    </svg>
  );
}

const labels: Record<SchematicId, string> = {
  collision: "Diagram: rays projected from a ship predict a collision with an asteroid",
  schema: "Diagram: an external configuration defines a nested document tree consumed by services",
  agents: "Diagram: a central manager distributes capabilities to agents of different versions worldwide",
  tiles: "Diagram: defects on a tile and the largest usable area that avoids them",
};

const P = { pathLength: 1 } as const;

const diagrams: Record<SchematicId, ReactNode> = {
  collision: (
    <g fill="none" strokeWidth="1.5">
      <path {...P} className="s-draw s-accent" d="M28 100 L58 88 L58 112 Z" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M58 94 L260 40" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M58 106 L260 160" />
      <path {...P} className="s-draw s-accent" d="M58 100 L212 100" />
      <circle {...P} className="s-draw s-line" cx="238" cy="100" r="22" />
      <path {...P} className="s-draw s-line" d="M228 92 L240 90 L248 98 L244 110 L232 112 Z" />
      <path {...P} className="s-draw s-accent" d="M206 84 L212 100 L206 116" />
      <text className="s-label" x="28" y="132">ship</text>
      <text className="s-label" x="222" y="140">asteroid</text>
      <text className="s-label s-label-accent" x="112" y="90">predicted impact</text>
      <text className="s-label" x="86" y="34">ray checks — no future-state simulation</text>
    </g>
  ),
  schema: (
    <g fill="none" strokeWidth="1.5">
      <rect {...P} className="s-draw s-accent" x="16" y="20" width="84" height="30" />
      <text className="s-label" x="26" y="39">config</text>
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M58 50 L58 84" />
      <rect {...P} className="s-draw s-line" x="16" y="84" width="180" height="96" />
      <rect {...P} className="s-draw s-line" x="30" y="100" width="152" height="30" />
      <rect {...P} className="s-draw s-line" x="30" y="138" width="70" height="28" />
      <rect {...P} className="s-draw s-line" x="112" y="138" width="70" height="28" />
      <rect {...P} className="s-draw s-faint" x="122" y="146" width="50" height="12" />
      <text className="s-label" x="26" y="76">document — arbitrary nesting</text>
      <path {...P} className="s-draw s-faint" d="M196 112 L232 112" />
      <path {...P} className="s-draw s-faint" d="M196 152 L232 152" />
      <rect {...P} className="s-draw s-accent" x="232" y="98" width="74" height="28" />
      <rect {...P} className="s-draw s-accent" x="232" y="138" width="74" height="28" />
      <text className="s-label" x="240" y="116">rest api</text>
      <text className="s-label" x="240" y="156">services</text>
    </g>
  ),
  agents: (
    <g fill="none" strokeWidth="1.5">
      <rect {...P} className="s-draw s-accent" x="128" y="82" width="64" height="36" />
      <text className="s-label" x="138" y="103">manager</text>
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M128 92 L52 40" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M192 92 L270 36" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M128 112 L46 158" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M192 112 L274 156" />
      <rect {...P} className="s-draw s-line" x="28" y="24" width="46" height="24" />
      <rect {...P} className="s-draw s-line" x="252" y="20" width="46" height="24" />
      <rect {...P} className="s-draw s-line" x="22" y="150" width="46" height="24" />
      <rect {...P} className="s-draw s-line" x="256" y="148" width="46" height="24" />
      <text className="s-label" x="36" y="40">v1</text>
      <text className="s-label" x="260" y="36">v7</text>
      <text className="s-label" x="30" y="166">v3</text>
      <text className="s-label" x="264" y="164">v1</text>
      <text className="s-label" x="102" y="140">dll capabilities · quartz</text>
      <text className="s-label" x="92" y="192">every version stays supported</text>
    </g>
  ),
  tiles: (
    <g fill="none" strokeWidth="1.5">
      <rect {...P} className="s-draw s-line" x="30" y="30" width="200" height="140" />
      <circle {...P} className="s-draw s-line" cx="70" cy="60" r="7" />
      <circle {...P} className="s-draw s-line" cx="196" cy="150" r="6" />
      <circle {...P} className="s-draw s-line" cx="176" cy="52" r="5" />
      <rect {...P} className="s-draw s-faint" strokeDasharray="4 5" x="42" y="42" width="176" height="116" />
      <rect {...P} className="s-draw s-accent" x="52" y="76" width="130" height="86" />
      <text className="s-label s-label-accent" x="62" y="124">largest usable area</text>
      <text className="s-label" x="240" y="60">defects</text>
      <path {...P} className="s-draw s-faint" d="M236 56 L204 52" />
      <text className="s-label" x="30" y="192">import · reprocess · trace over time</text>
    </g>
  ),
};
