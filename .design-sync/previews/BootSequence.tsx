import { BootSequence } from "davide-gozzi-portfolio";

// The site's layout stamps `js` on <html>; without it globals.css hides the
// boot entirely (html:not(.js) .boot { display: none }).
document.documentElement.classList.add("js");

// The typed POST lines are CSS width animations with delays up to 5.1s; the
// capture screenshots long before they finish (and the frozen page clock
// doesn't freeze CSS animations, so live timing is unpredictable). Force every
// line to its typed end state and hold the cursor solid — !important author
// rules outrank keyframed values, so this is the exact state the component
// reaches at ~5.8s.
const style = document.createElement("style");
style.textContent = [
  ".boot .boot-line { width: var(--tw) !important; }",
  ".boot .boot-cursor { animation: none !important; opacity: 1 !important; }",
].join("\n");
document.head.appendChild(style);

// Drop the 7.2s auto-dismiss so the card never fades to blank in live view
// (the frozen-clock capture never fires it anyway).
const origSetTimeout = window.setTimeout.bind(window);
(window as unknown as { setTimeout: unknown }).setTimeout = ((
  fn: TimerHandler,
  ms?: number,
  ...args: unknown[]
) => (typeof ms === "number" && ms >= 7000 ? 0 : origSetTimeout(fn, ms, ...args))) as typeof window.setTimeout;

// The overlay is `position: fixed; inset: 0`. The card harness fences fixed
// elements with a transform, so give it a sized, transformed frame to fill.
// stopPropagation keeps a stray click in the card from dismissing the boot.
const Frame = ({ phosphor }: { phosphor?: "green" | "amber" | "white" }) => (
  <div
    style={{ height: 480, position: "relative", transform: "translateZ(0)", border: "1px solid var(--rule)" }}
    onClickCapture={(e) => e.stopPropagation()}
  >
    <BootSequence onComplete={() => {}} phosphor={phosphor} />
  </div>
);

export const Green = () => <Frame />;
export const Amber = () => <Frame phosphor="amber" />;
export const White = () => <Frame phosphor="white" />;
