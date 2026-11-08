// The cabinet's blips, opt-in: a square wave through one gain node, and no AudioContext at all
// until the player turns sound on.
export type Cue = "move" | "select" | "coin" | "jump" | "hit" | "clear" | "over";

// Each cue is a short run of notes: [frequency in Hz, length in seconds].
const NOTES: Record<Cue, [number, number][]> = {
  move: [[880, 0.03]],
  select: [[1320, 0.06]],
  coin: [[988, 0.07], [1319, 0.14]],
  jump: [[660, 0.05], [990, 0.07]],
  hit: [[110, 0.12]],
  clear: [[784, 0.08], [988, 0.08], [1319, 0.16]],
  over: [[523, 0.1], [392, 0.1], [262, 0.24]],
};

export function createSound() {
  let ctx: AudioContext | null = null;
  return {
    play(cue: Cue) {
      ctx ??= new AudioContext();
      if (ctx.state === "suspended") void ctx.resume();
      let t = ctx.currentTime;
      for (const [frequency, length] of NOTES[cue]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + length);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + length);
        t += length;
      }
    },
  };
}
