let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function beep(freq: number, duration: number, type: OscillatorType = "square", vol = 0.15) {
  try {
    const ac  = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type      = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gain.gain.setValueAtTime(vol, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch {}
}

export const SFX = {
  // UI interactions
  hexSelect: () => beep(440, 0.08, "square", 0.1),
  hover:     () => beep(220, 0.04, "square", 0.05),

  // Raid actions
  raidOpen: () => {
    beep(300, 0.1, "square");
    setTimeout(() => beep(500, 0.1, "square"), 100);
    setTimeout(() => beep(700, 0.15, "square"), 200);
  },
  aiAnalyzing: () => {
    [0,1,2,3,4].forEach(i =>
      setTimeout(() => beep(200 + i * 80, 0.08, "sawtooth", 0.08), i * 120)
    );
  },
  questLogged: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => beep(f, 0.12, "square", 0.12), i * 80)
    );
  },

  // XP gain
  xpGain: () => {
    beep(880, 0.06, "square", 0.1);
    setTimeout(() => beep(1100, 0.1, "square", 0.1), 80);
  },

  // Alerts
  alert: () => {
    beep(150, 0.2, "sawtooth", 0.15);
    setTimeout(() => beep(150, 0.2, "sawtooth", 0.15), 300);
  },

  // Validation
  verify: () => {
    beep(660, 0.08, "square");
    setTimeout(() => beep(880, 0.12, "square"), 100);
  },
};