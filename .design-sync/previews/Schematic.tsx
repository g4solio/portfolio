import { Schematic } from "davide-gozzi-portfolio";

// The four ink-on-paper diagrams, composed as the site does: inside a
// bordered `.fig` figure with a mono figcaption (see components/Chapters.tsx).
const fig = (id: "collision" | "schema" | "agents" | "tiles", caption: string) => (
  <figure className="fig" style={{ maxWidth: 440, margin: 0 }}>
    <Schematic id={id} />
    <figcaption>{caption}</figcaption>
  </figure>
);

export const Collision = () => fig("collision", "fig. 01 — ray-based collision prediction, Unity");
export const Schema = () => fig("schema", "fig. 02 — configuration-driven document schemas");
export const Agents = () => fig("agents", "fig. 03 — manager and agents, Quartz scheduling");
export const Tiles = () => fig("tiles", "fig. 04 — defect map and largest usable area");
