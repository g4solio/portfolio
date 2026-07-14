import type { ReactNode } from "react";
import type { SchematicId } from "@/data/portfolio";

/**
 * Inline technical schematics. Strokes use pathLength=1 so CSS can run a
 * uniform draw-in when a case study opens; without animation they render
 * fully drawn.
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
  docflow: "Diagram: documents flow between a third-party service, the core system and SAP through shared folders",
  tiles: "Diagram: defects on a tile and the largest usable area that avoids them",
  bytes: "Diagram: raw bytes decoded by a connector into named fields",
};

const P = { pathLength: 1 } as const;

const diagrams: Record<SchematicId, ReactNode> = {
  collision: (
    <g fill="none" strokeWidth="1.5">
      {/* ship */}
      <path {...P} className="s-draw s-accent" d="M28 100 L58 88 L58 112 Z" />
      {/* projected rays */}
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M58 94 L260 40" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M58 106 L260 160" />
      <path {...P} className="s-draw s-warn" d="M58 100 L212 100" />
      {/* asteroid on the collision ray */}
      <circle {...P} className="s-draw s-line" cx="238" cy="100" r="22" />
      <path {...P} className="s-draw s-line" d="M228 92 L240 90 L248 98 L244 110 L232 112 Z" />
      {/* warning marker */}
      <path {...P} className="s-draw s-warn" d="M206 84 L212 100 L206 116" />
      <text className="s-label" x="28" y="132">SHIP</text>
      <text className="s-label" x="222" y="140">ASTEROID</text>
      <text className="s-label s-label-warn" x="118" y="90">PREDICTED IMPACT</text>
      <text className="s-label" x="118" y="34">RAY CHECKS · NO FUTURE-STATE SIMULATION</text>
    </g>
  ),
  schema: (
    <g fill="none" strokeWidth="1.5">
      {/* external config */}
      <rect {...P} className="s-draw s-accent" x="16" y="20" width="84" height="30" />
      <text className="s-label" x="26" y="39">CONFIG</text>
      {/* dashed contract line */}
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M58 50 L58 84" />
      {/* nested document tree */}
      <rect {...P} className="s-draw s-line" x="16" y="84" width="180" height="96" />
      <rect {...P} className="s-draw s-line" x="30" y="100" width="152" height="30" />
      <rect {...P} className="s-draw s-line" x="30" y="138" width="70" height="28" />
      <rect {...P} className="s-draw s-line" x="112" y="138" width="70" height="28" />
      <rect {...P} className="s-draw s-faint" x="122" y="146" width="50" height="12" />
      <text className="s-label" x="26" y="76">DOCUMENT · ARBITRARY NESTING</text>
      {/* consumers */}
      <path {...P} className="s-draw s-faint" d="M196 112 L232 112" />
      <path {...P} className="s-draw s-faint" d="M196 152 L232 152" />
      <rect {...P} className="s-draw s-accent" x="232" y="98" width="74" height="28" />
      <rect {...P} className="s-draw s-accent" x="232" y="138" width="74" height="28" />
      <text className="s-label" x="240" y="116">REST API</text>
      <text className="s-label" x="240" y="156">SERVICES</text>
    </g>
  ),
  agents: (
    <g fill="none" strokeWidth="1.5">
      {/* manager */}
      <rect {...P} className="s-draw s-accent" x="128" y="82" width="64" height="36" />
      <text className="s-label" x="138" y="103">MANAGER</text>
      {/* links */}
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M128 92 L52 40" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M192 92 L270 36" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M128 112 L46 158" />
      <path {...P} className="s-draw s-faint" strokeDasharray="4 5" d="M192 112 L274 156" />
      {/* agents with version tags */}
      <rect {...P} className="s-draw s-line" x="28" y="24" width="46" height="24" />
      <rect {...P} className="s-draw s-line" x="252" y="20" width="46" height="24" />
      <rect {...P} className="s-draw s-line" x="22" y="150" width="46" height="24" />
      <rect {...P} className="s-draw s-line" x="256" y="148" width="46" height="24" />
      <text className="s-label" x="36" y="40">v1</text>
      <text className="s-label" x="260" y="36">v7</text>
      <text className="s-label" x="30" y="166">v3</text>
      <text className="s-label" x="264" y="164">v1</text>
      <text className="s-label" x="106" y="140">DLL CAPABILITIES · QUARTZ</text>
      <text className="s-label" x="96" y="192">EVERY VERSION STAYS SUPPORTED</text>
    </g>
  ),
  docflow: (
    <g fill="none" strokeWidth="1.5">
      <rect {...P} className="s-draw s-line" x="12" y="70" width="76" height="34" />
      <rect {...P} className="s-draw s-line" x="124" y="70" width="72" height="34" />
      <rect {...P} className="s-draw s-line" x="232" y="70" width="72" height="34" />
      <text className="s-label" x="20" y="90">3RD PARTY</text>
      <text className="s-label" x="140" y="90">CORE</text>
      <text className="s-label" x="252" y="90">SAP</text>
      {/* shared folders between systems */}
      <path {...P} className="s-draw s-accent" d="M94 80 h8 l3 -4 h10 v18 h-21 Z" />
      <path {...P} className="s-draw s-accent" d="M202 80 h8 l3 -4 h10 v18 h-21 Z" />
      <path {...P} className="s-draw s-faint" d="M88 87 L94 87" />
      <path {...P} className="s-draw s-faint" d="M115 87 L124 87" />
      <path {...P} className="s-draw s-faint" d="M196 87 L202 87" />
      <path {...P} className="s-draw s-faint" d="M223 87 L232 87" />
      <text className="s-label" x="70" y="120">SHARED WINDOWS FOLDERS</text>
      {/* observability scan */}
      <path {...P} className="s-draw s-warn" d="M12 150 L304 150" strokeDasharray="2 6" />
      <circle {...P} className="s-draw s-warn" cx="158" cy="150" r="10" />
      <path {...P} className="s-draw s-warn" d="M165 157 L174 166" />
      <text className="s-label s-label-warn" x="96" y="184">WHERE DID IT GET STUCK?</text>
    </g>
  ),
  tiles: (
    <g fill="none" strokeWidth="1.5">
      {/* tile */}
      <rect {...P} className="s-draw s-line" x="30" y="30" width="200" height="140" />
      {/* defects */}
      <circle {...P} className="s-draw s-warn" cx="70" cy="60" r="7" />
      <circle {...P} className="s-draw s-warn" cx="196" cy="150" r="6" />
      <circle {...P} className="s-draw s-warn" cx="176" cy="52" r="5" />
      {/* rejected candidate */}
      <rect {...P} className="s-draw s-faint" strokeDasharray="4 5" x="42" y="42" width="176" height="116" />
      {/* largest usable area */}
      <rect {...P} className="s-draw s-accent" x="52" y="76" width="130" height="86" />
      <text className="s-label" x="62" y="124">LARGEST USABLE AREA</text>
      <text className="s-label" x="240" y="60">DEFECTS</text>
      <path {...P} className="s-draw s-faint" d="M236 56 L204 52" />
      <text className="s-label" x="30" y="192">IMPORT · REPROCESS · TRACE OVER TIME</text>
    </g>
  ),
  bytes: (
    <g fill="none" strokeWidth="1.5">
      {/* raw byte cells */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect
          key={i}
          {...P}
          className="s-draw s-line"
          x={24 + i * 34}
          y={150}
          width="30"
          height="26"
        />
      ))}
      <text className="s-label" x="32" y="167">0A</text>
      <text className="s-label" x="66" y="167">3F</text>
      <text className="s-label" x="100" y="167">C8</text>
      <text className="s-label" x="134" y="167">00</text>
      <text className="s-label" x="168" y="167">11</text>
      <text className="s-label" x="202" y="167">B2</text>
      <text className="s-label" x="236" y="167">7E</text>
      <text className="s-label" x="270" y="167">FF</text>
      {/* connector layer */}
      <path {...P} className="s-draw s-faint" d="M160 150 L160 122" />
      <rect {...P} className="s-draw s-accent" x="96" y="88" width="128" height="34" />
      <text className="s-label" x="118" y="108">CONNECTOR</text>
      <path {...P} className="s-draw s-faint" d="M124 88 L70 62" />
      <path {...P} className="s-draw s-faint" d="M160 88 L160 62" />
      <path {...P} className="s-draw s-faint" d="M196 88 L250 62" />
      {/* clean fields */}
      <rect {...P} className="s-draw s-line" x="30" y="36" width="80" height="26" />
      <rect {...P} className="s-draw s-line" x="120" y="36" width="80" height="26" />
      <rect {...P} className="s-draw s-line" x="210" y="36" width="80" height="26" />
      <text className="s-label" x="42" y="53">TEMP °C</text>
      <text className="s-label" x="132" y="53">SPEED</text>
      <text className="s-label" x="222" y="53">STATUS</text>
    </g>
  ),
};
