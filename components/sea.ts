/**
 * The optional sound of the sea during the crossing: soft filtered noise
 * that rises and falls like water against a hull. Made in the browser (no
 * audio files), off unless the player turns it on, and never autoplayed:
 * it starts only after the player has chosen something.
 */
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;

function build(): void {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  const seconds = 4;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    // Brown noise: a random walk, which sounds like distant surf.
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.2;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  const swell = ctx.createGain();
  swell.gain.value = 0.55;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12;
  const depth = ctx.createGain();
  depth.gain.value = 0.35;
  lfo.connect(depth).connect(swell.gain);
  gain = ctx.createGain();
  gain.gain.value = 0;
  source.connect(filter).connect(swell).connect(gain).connect(ctx.destination);
  source.start();
  lfo.start();
}

export function setSea(on: boolean): void {
  if (typeof window === "undefined") return;
  if (on && !ctx) build();
  if (!ctx || !gain) return;
  if (on && ctx.state === "suspended") void ctx.resume();
  const t = ctx.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.linearRampToValueAtTime(on ? 0.18 : 0, t + 1.5);
}
