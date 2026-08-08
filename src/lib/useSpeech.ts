import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Live dictation via the browser's Web Speech API, with a graceful
 * "simulated" mode when the browser (or permissions) won't cooperate —
 * the concierge should never feel broken, just quieter.
 */
export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [level, setLevel] = useState(0);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");
  const audioRef = useRef<{ ctx: AudioContext; stream: MediaStream; raf: number } | null>(null);
  const fakeRef = useRef<number | null>(null);

  useEffect(() => { setSupported(!!getRecognitionCtor()); }, []);

  const startMeter = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        setLevel(Math.min(1, Math.sqrt(sum / data.length) * 4));
        const raf = requestAnimationFrame(tick);
        if (audioRef.current) audioRef.current.raf = raf;
      };
      audioRef.current = { ctx, stream, raf: requestAnimationFrame(tick) };
    } catch {
      // no mic — fall back to a gentle synthetic pulse
      const t0 = Date.now();
      fakeRef.current = window.setInterval(() => {
        setLevel(0.35 + 0.35 * Math.abs(Math.sin((Date.now() - t0) / 260)));
      }, 60);
    }
  }, []);

  const stopMeter = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      cancelAnimationFrame(a.raf);
      a.stream.getTracks().forEach((t) => t.stop());
      a.ctx.close().catch(() => {});
      audioRef.current = null;
    }
    if (fakeRef.current) { clearInterval(fakeRef.current); fakeRef.current = null; }
    setLevel(0);
  }, []);

  const start = useCallback(() => {
    finalRef.current = "";
    setTranscript("");
    void startMeter();
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript;
        else interim += r[0].transcript;
      }
      setTranscript((finalRef.current + interim).trim());
    };
    rec.onerror = () => {};
    rec.onend = () => {};
    try { rec.start(); recRef.current = rec; } catch { /* already running */ }
  }, [startMeter]);

  const stop = useCallback(() => {
    stopMeter();
    const rec = recRef.current;
    if (rec) { try { rec.stop(); } catch { /* noop */ } recRef.current = null; }
    return (finalRef.current || transcript).trim();
  }, [stopMeter, transcript]);

  const cancel = useCallback(() => {
    stopMeter();
    const rec = recRef.current;
    if (rec) { try { rec.abort(); } catch { /* noop */ } recRef.current = null; }
    finalRef.current = "";
    setTranscript("");
  }, [stopMeter]);

  useEffect(() => () => { cancel(); }, [cancel]);

  return { supported, transcript, level, start, stop, cancel };
}

/** Speaks Aria's replies aloud when the device allows it. */
export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) { onEnd?.(); return; }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 1.05;
    u.onend = () => onEnd?.();
    u.onerror = () => onEnd?.();
    window.speechSynthesis.speak(u);
  } catch { onEnd?.(); }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch { /* noop */ }
  }
}
