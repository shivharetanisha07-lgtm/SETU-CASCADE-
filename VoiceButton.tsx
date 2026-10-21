import { useState, useEffect, useRef } from "react";

interface VoiceButtonProps {
  text: string;
  lang?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const LANG_CODES: Record<string, string> = {
  hi: "hi-IN", te: "te-IN", ta: "ta-IN", gu: "gu-IN",
  mr: "mr-IN", bn: "bn-IN", kn: "kn-IN", en: "en-IN",
};

export default function VoiceButton({ text, lang = "hi", size = "md", label }: VoiceButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  function speak() {
    if (!supported) { setSpeaking(true); setTimeout(() => setSpeaking(false), 2500); return; }
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG_CODES[lang] ?? "hi-IN";
    u.rate = 0.9;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }

  const bars = [3, 5, 7, 9, 6, 4, 8, 5, 3];
  const sizeMap = { sm: "px-2 py-1 text-xs", md: "px-3 py-2 text-sm", lg: "px-5 py-3 text-base" };
  const iconSize = { sm: 12, md: 16, lg: 20 }[size];

  return (
    <button onClick={speak}
      className={`inline-flex items-center gap-2 rounded-sm border font-semibold transition-all ${sizeMap[size]} ${speaking
        ? "border-[#f5a623] bg-[rgba(245,166,35,0.12)] text-[#f5a623]"
        : "border-[rgba(245,166,35,0.25)] text-[#8aa4c8] hover:border-[rgba(245,166,35,0.5)] hover:text-[#f5a623]"}`}
      style={{ fontFamily: "Rajdhani, sans-serif" }}
      title={speaking ? "Stop" : "Play voice"}>
      {speaking ? (
        <span className="flex items-end gap-px h-4">
          {bars.map((h, i) => (
            <span key={i} className="bg-[#f5a623] rounded-px w-0.5"
              style={{ height: `${h}px`, animationName: "barPulse", animationDuration: `${0.4 + i * 0.07}s`, animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDirection: "alternate" }} />
          ))}
        </span>
      ) : (
        <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" fill="none">
          <polygon points="4,3 16,10 4,17" fill="currentColor" />
          <path d="M14 6.5 Q17 10 14 13.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M16 4 Q21 10 16 16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      )}
      {label ?? (speaking ? "Playing..." : "Listen")}
    </button>
  );
}
