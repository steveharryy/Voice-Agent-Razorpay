// Web Audio & Speech synthesis utilities for Razorpay Voice Recovery Agent

class AudioEffectsManager {
  private ctx: AudioContext | null = null;

  public getContext(): AudioContext {
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

        osc1.frequency.value = 400;
        osc2.frequency.value = 450;
        osc1.type = 'sine';
        osc2.type = 'sine';

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.0);
        osc2.stop(ctx.currentTime + 1.0);

        timeoutId = setTimeout(() => {
          if (isPlaying) ringBurst();
        }, 2200);
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

// ============================================================================
// Robust English-Only Voice Manager (Eliminates non-English/Bengali fallbacks)
// ============================================================================

let cachedEnglishVoice: SpeechSynthesisVoice | null = null;
let selectedVoiceURI: string | null = null;

// Blacklist non-English terms to prevent regional locale mis-detection
const EXCLUDED_TERMS = ['bangla', 'bengali', 'hindi', 'marathi', 'tamil', 'telugu', 'gujarati', 'kannada', 'malayalam', 'punjabi', 'urdu'];

export function getAvailableEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const allVoices = window.speechSynthesis.getVoices();

  return allVoices.filter((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();

    // Must strictly start with 'en' (e.g. en-US, en-GB, en-IN)
    if (!lang.startsWith('en')) return false;

    // Must NOT contain any non-English terms
    if (EXCLUDED_TERMS.some((term) => name.includes(term) || lang.includes(term))) {
      return false;
    }

    return true;
  });
}

export function setSelectedVoiceURI(uri: string): void {
  selectedVoiceURI = uri;
  if (typeof window !== 'undefined') {
    localStorage.setItem('rzp_selected_voice', uri);
  }
}

export function getSelectedVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const englishVoices = getAvailableEnglishVoices();
  if (englishVoices.length === 0) return null;

  // 1. Check user preference from localStorage or state
  const savedUri = selectedVoiceURI || (typeof window !== 'undefined' ? localStorage.getItem('rzp_selected_voice') : null);
  if (savedUri) {
    const matched = englishVoices.find((v) => v.voiceURI === savedUri);
    if (matched) return matched;
  }

  // 2. High-priority standard clear English voices (Female/Natural prioritized)
  const prioritizedNames = [
    'google us english',
    'microsoft zira',
    'microsoft jenny',
    'microsoft aria',
    'samantha',
    'karen',
    'victoria',
    'serena',
    'fiona',
    'english united states',
    'en-us',
    'en-gb',
  ];

  for (const priority of prioritizedNames) {
    const found = englishVoices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      return name.includes(priority) || lang === priority;
    });
    if (found) {
      cachedEnglishVoice = found;
      return found;
    }
  }

  // 3. Fallback: First valid English voice
  cachedEnglishVoice = englishVoices[0];
  return cachedEnglishVoice;
}

// Pre-warm voices on startup
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getSelectedVoice();
  };
  // Trigger initial getVoices call to warm up the browser engine
  window.speechSynthesis.getVoices();
}

// Speak function strictly locking to English with zero drop
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return () => {};
  }

  let isCancelled = false;
  let keepAliveInterval: any = null;

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();
  } catch {}

  const triggerUtterance = () => {
    if (isCancelled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Always lock to en-US
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const chosenVoice = getSelectedVoice();
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    }

    utterance.onstart = () => {
      if (isCancelled) return;
      onStart?.();

      // Chrome keep-alive hack for longer sentences
      keepAliveInterval = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }
      }, 8000);
    };

    utterance.onend = () => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      onEnd?.();
    };

    utterance.onerror = (e) => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      console.warn('[SpeechSynthesis] Utterance finished or error:', e);
      onEnd?.();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  };

  // 40ms safe delay to avoid Chrome synchronous cancel race condition
  const timeoutId = setTimeout(triggerUtterance, 40);

  return () => {
    isCancelled = true;
    clearTimeout(timeoutId);
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    try {
      window.speechSynthesis.cancel();
    } catch {}
  };
}
