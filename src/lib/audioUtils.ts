// Web Audio & Speech synthesis utilities for Razorpay Voice Recovery Agent

class AudioEffectsManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play phone ring tone
  playRingtone(): () => void {
    if (typeof window === 'undefined') return () => {};
    try {
      const ctx = this.getContext();
      let isPlaying = true;
      let timeoutId: any = null;

      const ringBurst = () => {
        if (!isPlaying) return;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // Standard Indian / UK telecom ring tones (400Hz + 450Hz)
        osc1.frequency.value = 400;
        osc2.frequency.value = 450;
        osc1.type = 'sine';
        osc2.type = 'sine';

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.2);
        osc2.stop(ctx.currentTime + 1.2);

        timeoutId = setTimeout(() => {
          if (isPlaying) ringBurst();
        }, 2800);
      };

      ringBurst();

      return () => {
        isPlaying = false;
        if (timeoutId) clearTimeout(timeoutId);
      };
    } catch {
      return () => {};
    }
  }

  // Play call connected tone
  playConnectChime(): void {
    if (typeof window === 'undefined') return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }

  // Play hangup tone
  playHangupTone(): void {
    if (typeof window === 'undefined') return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }

  // Play signature Razorpay payment success chime
  playPaymentSuccess(): void {
    if (typeof window === 'undefined') return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // High-converting uplifting 3-note fintech success chime: E5 -> G#5 -> B5
      const notes = [659.25, 830.61, 987.77];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.1;

        osc.frequency.setValueAtTime(freq, startTime);
        osc.type = 'triangle';

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch {}
  }
}

export const audioEffects = new AudioEffectsManager();

// Speech Synthesis Helper
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return () => {};
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02;
  utterance.pitch = 1.05;

  // Prefer Indian English voice or natural female voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find(
      (v) =>
        (v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Indian')) &&
        (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google') || v.name.includes('Natural'))
    ) ||
    voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))) ||
    voices.find((v) => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
