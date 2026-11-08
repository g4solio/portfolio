"use client";

import { useSyncExternalStore } from "react";
import { MeetCabinet } from "./MeetCabinet";
import { MeetTranscript } from "./MeetTranscript";

const subscribe = (notify: () => void) => {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
};

/**
 * /meet/ with JavaScript: the cabinet, or text mode (#text), which is the transcript game. The transcript
 * also carries the document a page without JavaScript shows, so it is always in the markup.
 */
export function MeetArcade() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  const mode = hash === "#text" ? "text" : "cabinet";
  const go = (next: "text" | "cabinet") => {
    history.pushState(null, "", next === "text" ? "#text" : window.location.pathname);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  return (
    <div className="meet-arcade" data-mode={mode}>
      <MeetCabinet active={mode === "cabinet"} onTextMode={() => go("text")} />
      {mode === "text" && (
        <p className="meet-modebar">
          <button type="button" onClick={() => go("cabinet")}>
            ◀ back to the cabinet
          </button>
        </p>
      )}
      <MeetTranscript />
    </div>
  );
}
