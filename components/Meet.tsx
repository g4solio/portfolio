"use client";

import { useSyncExternalStore } from "react";
import { MeetDesk } from "./MeetDesk";
import { MeetTranscript } from "./MeetTranscript";

const subscribe = (notify: () => void) => {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
};

/**
 * /meet/ with JavaScript: the desk, or text mode (#text), which is the transcript game. The transcript
 * also carries the document a page without JavaScript shows, so it is always in the markup.
 */
export function Meet() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  const mode = hash === "#text" ? "text" : "desk";
  const go = (next: "text" | "desk") => {
    history.pushState(null, "", next === "text" ? "#text" : window.location.pathname);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  return (
    <div className="meet-wrap" data-mode={mode}>
      <MeetDesk active={mode === "desk"} onTextMode={() => go("text")} />
      {mode === "text" && (
        <p className="meet-modebar">
          <button type="button" onClick={() => go("desk")}>
            ← back to the desk
          </button>
        </p>
      )}
      <MeetTranscript />
    </div>
  );
}
