// High-tech sound effects synthesized on the fly using Web Audio API

let audioCtx = null;
let isMuted = true; // Default to muted for user-friendly auto-play policies

function getAudioContext() {
  if (!audioCtx && typeof window !== "undefined") {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const toggleMute = (force) => {
  if (force !== undefined) {
    isMuted = force;
  } else {
    isMuted = !isMuted;
  }
  // Initialize context on first interaction
  getAudioContext();
  return isMuted;
};

export const getMutedState = () => {
  return isMuted;
};

export const playClick = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // High-pitch precise tick
  osc.type = "sine";
  osc.frequency.setValueAtTime(1500, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);

  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
};

export const playHover = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Soft low hum
  osc.type = "triangle";
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
};

export const playSuccess = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Create a futuristic tech sweep/arpeggio
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + index * 0.08);
    
    gain.gain.setValueAtTime(0, now + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.05, now + index * 0.08 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);
    
    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.3);
  });
};
