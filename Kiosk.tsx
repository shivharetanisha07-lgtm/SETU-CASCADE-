import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";

type KioskStep = "idle" | "language" | "destination" | "confirm" | "payment" | "token";

const LANGUAGES = [
  { code: "hi-IN", label: "हिन्दी", name: "Hindi" },
  { code: "te-IN", label: "తెలుగు", name: "Telugu" },
  { code: "ta-IN", label: "தமிழ்", name: "Tamil" },
  { code: "gu-IN", label: "ગુજરાતી", name: "Gujarati" },
  { code: "mr-IN", label: "मराठी", name: "Marathi" },
  { code: "bn-IN", label: "বাংলা", name: "Bengali" },
  { code: "kn-IN", label: "ಕನ್ನಡ", name: "Kannada" },
  { code: "en-US", label: "English", name: "English" },
];

const DESTINATIONS = [
  { id: "cp", label: "Connaught Place", hi: "कनॉट प्लेस", icon: "🏛️", fare: 15 },
  { id: "civillines", label: "Civil Lines", hi: "सिविल लाइंस", icon: "🏘️", fare: 18 },
  { id: "gk1", label: "GK-1 Market", hi: "ग्रेटर कैलाश-1", icon: "🛒", fare: 20 },
  { id: "dwarka", label: "Dwarka Mor", hi: "द्वारका मोर", icon: "🏘️", fare: 15 },
  { id: "crpark", label: "CR Park", hi: "सीआर पार्क", icon: "🌳", fare: 18 },
  { id: "janpath", label: "Janpath Market", hi: "जनपथ", icon: "🛍️", fare: 15 },
  { id: "hauzkhaz", label: "Hauz Khas", hi: "हौज खास", icon: "☕", fare: 22 },
  { id: "malviya", label: "Malviya Nagar", hi: "मालवीय नगर", icon: "🏡", fare: 15 },
];

const VOICE_SCRIPTS: Record<string, Record<string, string>> = {
  idle: {
    "hi-IN": "नमस्ते! SETU में आपका स्वागत है। शुरू करने के लिए बड़ा नारंगी बटन दबाएं।",
    "te-IN": "నమస్కారం! SETU కి స్వాగతం. ప్రారంభించడానికి పెద్ద నారింజ బటన్ నొక్కండి.",
    "ta-IN": "வணக்கம்! SETU-வில் உங்களை வரவேற்கிறோம். தொடங்க ஆரஞ்சு பொத்தானை அழுத்துங்கள்.",
    "en-US": "Welcome to SETU! Press the big orange button to start booking your ride.",
    "gu-IN": "નમસ્તે! SETU માં આપનું સ્વાગત છે. બુકિંગ શરૂ કરવા મોટું ઓરેન્જ બટન દબાવો.",
    "mr-IN": "नमस्कार! SETU मध्ये आपले स्वागत आहे. बुकिंग सुरू करण्यासाठी मोठे नारंगी बटण दाबा.",
    "bn-IN": "নমস্কার! SETU-তে আপনাকে স্বাগতম। বুকিং শুরু করতে বড় কমলা বোতামটি টিপুন।",
    "kn-IN": "ನಮಸ್ಕಾರ! SETU ಗೆ ಸ್ವಾಗತ. ಬುಕಿಂಗ್ ಪ್ರಾರಂಭಿಸಲು ದೊಡ್ಡ ಕಿತ್ತಳೆ ಬಟನ್ ಒತ್ತಿ.",
  },
  destination: {
    "hi-IN": "आप कहाँ जाना चाहते हैं? अपनी जगह की फोटो पर टैप करें, या बोलें।",
    "en-US": "Where would you like to go? Tap a destination photo or press the microphone to speak.",
    "te-IN": "మీరు ఎక్కడికి వెళ్ళాలనుకుంటున్నారు? గమ్యస్థాన ఫోటోపై టాప్ చేయండి లేదా మాట్లాడండి.",
    "ta-IN": "நீங்கள் எங்கு போக விரும்புகிறீர்கள்? இலக்கின் படத்தை தட்டவும் அல்லது பேசவும்.",
    "gu-IN": "તમે ક્યાં જવા માગો છો? ગંતવ્ય ફોટો પર ટેપ કરો અથવા બોલો.",
    "mr-IN": "तुम्हाला कुठे जायचे? ठिकाणाच्या फोटोवर टॅप करा किंवा बोला.",
    "bn-IN": "আপনি কোথায় যেতে চান? গন্তব্যের ছবিতে ট্যাপ করুন বা বলুন।",
    "kn-IN": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ? ಗಮ್ಯಸ್ಥಾನ ಫೋಟೋ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತಾಡಿ.",
  },
  confirm: {
    "hi-IN": "क्या यह सही जगह है? हाँ बोलें या हाँ बटन दबाएं।",
    "en-US": "Is this the correct destination? Say Yes or press the green button to confirm.",
    "te-IN": "ఇది సరైన గమ్యస్థానమా? అవును అని చెప్పండి లేదా ఆకుపచ్చ బటన్ నొక్కండి.",
    "ta-IN": "இது சரியான இலக்கா? ஆம் என்று சொல்லுங்கள் அல்லது பச்சை பொத்தானை அழுத்துங்கள்.",
    "gu-IN": "શું આ સાચું ગંતવ્ય છે? હા કહો અથવા લીલા બટન દબાવો.",
    "mr-IN": "हे बरोबर ठिकाण आहे का? हो म्हणा किंवा हिरवा बटण दाबा.",
    "bn-IN": "এটি কি সঠিক গন্তব্য? হ্যাঁ বলুন বা সবুজ বোতামটি টিপুন।",
    "kn-IN": "ಇದು ಸರಿಯಾದ ಗಮ್ಯಸ್ಥಾನವೇ? ಹೌದು ಎಂದು ಹೇಳಿ ಅಥವಾ ಹಸಿರು ಬಟನ್ ಒತ್ತಿ.",
  },
  payment: {
    "hi-IN": "भुगतान का तरीका चुनें। नकद, यूपीआई, या पास — सब चलता है।",
    "en-US": "Please choose your payment method. Cash, UPI, or SETU Pass are all accepted.",
    "te-IN": "చెల్లింపు పద్ధతిని ఎంచుకోండి. నగదు, UPI, లేదా SETU పాస్ అన్నీ అంగీకరించబడతాయి.",
    "ta-IN": "கட்டண முறையை தேர்வு செய்யுங்கள். பணம், UPI அல்லது SETU பாஸ் எல்லாம் ஏற்றுக்கொள்ளப்படும்.",
    "gu-IN": "ચુકવણીની પદ્ધતિ પસંદ કરો. રોકડ, UPI, અથવા SETU પાસ — બધું ચાલે છે.",
    "mr-IN": "पेमेंट पद्धत निवडा. रोख, UPI, किंवा SETU पास — सर्व चालते.",
    "bn-IN": "পেমেন্ট পদ্ধতি বেছে নিন। নগদ, UPI, বা SETU পাস — সব গ্রহণযোগ্য।",
    "kn-IN": "ಪಾವತಿ ವಿಧಾನ ಆಯ್ಕೆ ಮಾಡಿ. ನಗದು, UPI, ಅಥವಾ SETU ಪಾಸ್ — ಎಲ್ಲಾ ಸ್ವೀಕಾರಾರ್ಹ.",
  },
  token: {
    "hi-IN": "बहुत बढ़िया! आपकी बुकिंग हो गई। टोकन नीचे प्रिंट हो रहा है। अपना टोकन लेकर प्रतीक्षा क्षेत्र में जाएं।",
    "en-US": "Excellent! Your booking is confirmed. Please collect your token below and wait in the boarding area.",
    "te-IN": "అద్భుతం! మీ బుకింగ్ నిర్ధారించబడింది. టోకెన్ తీసుకుని బోర్డింగ్ ప్రాంతంలో వేచి ఉండండి.",
    "ta-IN": "அருமை! உங்கள் முன்பதிவு உறுதிப்படுத்தப்பட்டது. டோக்கனை எடுத்து பயணிக்கும் பகுதியில் காத்திருங்கள்.",
    "gu-IN": "ઉત્તમ! તમારી બુકિંગ થઈ ગઈ. ટોકન નીચે પ્રિંટ થઈ રહ્યું છે. ટોકન લઈ બોર્ડિંગ વિસ્તારમાં જાઓ.",
    "mr-IN": "उत्तम! तुमची बुकिंग झाली. टोकन खाली प्रिंट होत आहे. टोकन घेऊन बोर्डिंग क्षेत्रात जा.",
    "bn-IN": "চমৎকার! আপনার বুকিং নিশ্চিত হয়েছে। টোকেন নিচে প্রিন্ট হচ্ছে। টোকেন নিয়ে বোর্ডিং এলাকায় যান।",
    "kn-IN": "ಅದ್ಭುತ! ನಿಮ್ಮ ಬುಕಿಂಗ್ ದೃಢಪಟ್ಟಿದೆ. ಟೋಕನ್ ಕೆಳಗೆ ಮುದ್ರಣವಾಗುತ್ತಿದೆ. ಟೋಕನ್ ತೆಗೆದುಕೊಂಡು ಬೋರ್ಡಿಂಗ್ ಪ್ರದೇಶಕ್ಕೆ ಹೋಗಿ.",
  },
};

function getScript(step: KioskStep, lang: string): string {
  return (VOICE_SCRIPTS[step] ?? VOICE_SCRIPTS.idle)[lang] ?? VOICE_SCRIPTS[step]?.["en-US"] ?? "";
}

export default function Kiosk() {
  const navigate = useNavigate();
  const [step, setStep] = useState<KioskStep>("idle");
  const [lang, setLang] = useState("hi-IN");
  const [dest, setDest] = useState<typeof DESTINATIONS[0] | null>(null);
  const [isPriority, setIsPriority] = useState(false);
  const [payMethod, setPayMethod] = useState("");
  const [token] = useState(`SU-${Math.floor(10 + Math.random() * 89)}`);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [clock, setClock] = useState(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })), 10000);
    return () => clearInterval(t);
  }, []);

  function speak(text?: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const script = text ?? getScript(step, lang);
    if (!script) return;
    const utt = new SpeechSynthesisUtterance(script);
    utt.lang = lang;
    utt.rate = 0.88;
    utt.pitch = 1;
    setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }

  function goTo(nextStep: KioskStep) {
    setStep(nextStep);
    setTimeout(() => speak(getScript(nextStep, lang)), 200);
  }

  function startListening() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { setVoiceStatus("Voice recognition not available. Please select manually."); return; }
    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = false;
    setListening(true);
    setVoiceStatus(lang.startsWith("hi") ? "सुन रहा हूँ..." : "Listening...");
    recognition.onresult = (e: any) => {
      const said = e.results[0][0].transcript.toLowerCase();
      setListening(false);
      const match = DESTINATIONS.find(d =>
        d.label.toLowerCase().includes(said) ||
        d.hi.includes(said) ||
        said.includes(d.label.toLowerCase().split(" ")[0])
      );
      if (match) {
        setDest(match);
        setVoiceStatus(`✓ ${match.label} — ${match.hi}`);
        speak(`${match.label}. Kya yeh sahi hai?`);
        setTimeout(() => goTo("confirm"), 1500);
      } else {
        setVoiceStatus("Could not match destination. Please select from screen.");
      }
    };
    recognition.onerror = () => { setListening(false); setVoiceStatus("Could not hear. Try again or select manually."); };
    recognition.start();
  }

  function reset() {
    window.speechSynthesis?.cancel();
    setStep("idle"); setDest(null); setIsPriority(false); setPayMethod(""); setSpeaking(false); setListening(false); setVoiceStatus("");
  }

  const currentLang = LANGUAGES.find(l => l.code === lang);
  const qrValue = dest ? `SETU:KIOSK:${token}:${dest.id}:${payMethod || "cash"}` : "SETU:KIOSK:START";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#f5a623]">KIOSK SIMULATION</span>
          <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
          <span className="font-mono text-[11px] text-[#8aa4c8]">Interactive · Voice-enabled</span>
        </div>
        <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>SETU Smart Kiosk</h1>
        <p className="text-[#8aa4c8] text-sm">Physical kiosk UI simulation — voice, QR, multilingual, zero literacy required. Try it live.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="space-y-4">
          {/* Language selector */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.15)] rounded-sm p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">भाषा / Language</div>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  className={`py-2 px-2 text-sm rounded-sm border text-center transition-all ${lang === l.code ? "border-[#f5a623] bg-[rgba(245,166,35,0.1)] text-[#f5a623]" : "border-[rgba(245,166,35,0.1)] text-[#8aa4c8] hover:border-[rgba(245,166,35,0.3)]"}`}
                  style={{ fontFamily: "Noto Sans, sans-serif" }}>
                  <div className="font-bold text-sm">{l.label}</div>
                  <div className="text-[9px] font-mono">{l.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* QR code widget */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-4 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Scan to Book via WhatsApp</div>
            <div className="inline-block p-3 bg-white rounded-sm mb-2">
              <QRCodeSVG value="https://wa.me/918001234567?text=SETU+book+ride" size={120} bgColor="#ffffff" fgColor="#050e1f" level="H" />
            </div>
            <p className="text-[10px] font-mono text-[#8aa4c8]">wa.me/918001234567</p>
            <p className="text-[10px] text-[#3a5270] mt-1">Send "SETU" to start</p>
          </div>

          {/* Features */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Kiosk Features</div>
            {[
              { icon: "🎙️", t: "Voice in 8 languages" },
              { icon: "🖼️", t: "Photo destination select" },
              { icon: "📷", t: "QR → WhatsApp booking" },
              { icon: "💵", t: "Cash · UPI · NCMC card" },
              { icon: "🎫", t: "Printed + SMS token" },
              { icon: "♿", t: "Braille + low counter" },
              { icon: "🆘", t: "SOS red button always on" },
              { icon: "📺", t: "42\" outdoor LED queue" },
              { icon: "☀️", t: "Solar + 4hr battery" },
            ].map(f => (
              <div key={f.t} className="flex items-center gap-2 text-xs py-1 border-b border-[rgba(245,166,35,0.04)]">
                <span>{f.icon}</span><span className="text-[#8aa4c8]">{f.t}</span>
              </div>
            ))}
          </div>

          {/* SOS */}
          <button className="w-full py-5 bg-[#e8433a] text-white font-bold text-xl rounded-sm hover:bg-[#d63a32] active:scale-[0.97] transition-all"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
            onClick={() => speak("Emergency SOS activated. Police control room and SETU control centre have been notified. Help is on the way.")}>
            🆘 SOS EMERGENCY
          </button>

          {/* Live queue board */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-2">Live Queue — Rajiv Chowk</div>
            <div className="space-y-1.5">
              {[
                { id: "SU-01", dest: "Connaught Place", wait: "Arriving", fill: 4 },
                { id: "SU-04", dest: "Sarojini Nagar", wait: "3 min", fill: 2 },
                { id: "SU-07", dest: "AIIMS / INA", wait: "5 min", fill: 0 },
                { id: "SU-09", dest: "Chandni Chowk", wait: "7 min", fill: 1 },
              ].map(v => (
                <div key={v.id} className={`flex items-center justify-between px-2 py-1.5 rounded-sm border text-xs ${v.wait === "Arriving" ? "border-[rgba(56,193,114,0.3)] bg-[rgba(56,193,114,0.05)]" : "border-[rgba(245,166,35,0.08)]"}`}>
                  <div>
                    <span className="font-mono font-bold text-[#edeae4]">{v.id}</span>
                    <span className="text-[#8aa4c8] ml-1.5 text-[10px]">{v.dest}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-[10px] ${v.wait === "Arriving" ? "text-[#38c172]" : "text-[#f5a623]"}`}>{v.wait}</div>
                    <div className="text-[9px] text-[#8aa4c8]">{v.fill === 0 ? "Empty" : `${v.fill}/6`}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main kiosk screen */}
        <div className="lg:col-span-2">
          <div className="bg-[#0c1d38] border-2 border-[rgba(245,166,35,0.25)] rounded-sm overflow-hidden shadow-2xl" style={{ boxShadow: "0 0 40px rgba(245,166,35,0.06)" }}>
            {/* Screen header */}
            <div className="bg-[#f5a623] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#050e1f] rounded-sm flex items-center justify-center">
                  <span className="text-[#f5a623] font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>S</span>
                </div>
                <span className="font-bold text-[#050e1f] text-xl" style={{ fontFamily: "Rajdhani, sans-serif" }}>SETU सेतु</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#050e1f] text-xs font-semibold">{currentLang?.label}</span>
                <span className="text-[#050e1f] font-mono text-xs">{clock}</span>
                <div className="w-2 h-2 rounded-full bg-[#050e1f] opacity-70 animate-pulse" />
              </div>
            </div>

            {/* Voice bar — always visible */}
            <button onClick={() => speak()}
              className={`w-full px-5 py-3.5 border-b border-[rgba(245,166,35,0.12)] flex items-center gap-3 text-left transition-all ${speaking ? "bg-[rgba(245,166,35,0.1)]" : "hover:bg-[rgba(245,166,35,0.04)]"}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${speaking ? "bg-[#f5a623]" : "bg-[#1a3259]"}`}>
                <span className={speaking ? "text-[#050e1f] text-base" : "text-[#8aa4c8] text-sm"}>{speaking ? "🔊" : "🔇"}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#edeae4] leading-snug">{getScript(step, lang)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {speaking && [1,2,3,4,5].map(i => (
                  <div key={i} className="w-0.5 rounded-full bg-[#f5a623]" style={{ height: `${8 + (i % 3) * 8}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
                <span className="text-[10px] font-mono text-[#8aa4c8] ml-1">TAP</span>
              </div>
            </button>

            {voiceStatus && (
              <div className={`px-5 py-2.5 border-b border-[rgba(245,166,35,0.08)] text-xs font-mono ${voiceStatus.startsWith("✓") ? "text-[#38c172] bg-[rgba(56,193,114,0.06)]" : "text-[#f5a623] bg-[rgba(245,166,35,0.04)]"}`}>
                {voiceStatus}
              </div>
            )}

            {/* Screen body */}
            <div className="p-5 min-h-[360px]">

              {/* IDLE */}
              {step === "idle" && (
                <div className="text-center py-6">
                  <div className="text-6xl mb-5">🛺</div>
                  <h2 className="text-3xl font-bold text-[#f5a623] mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>SETU</h2>
                  <p className="text-sm italic text-[#8aa4c8] mb-8">"Jo doori baaki hai, woh SETU karega"</p>

                  <button onClick={() => goTo("destination")}
                    className="w-full py-7 bg-[#f5a623] text-[#050e1f] text-2xl font-bold rounded-sm hover:bg-[#fbb740] active:scale-[0.98] transition-all mb-3"
                    style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    🚀 शुरू करें / START
                  </button>

                  <button onClick={() => { setIsPriority(true); goTo("destination"); }}
                    className="w-full py-3.5 border-2 border-[#f5a623] text-[#f5a623] font-bold rounded-sm hover:bg-[rgba(245,166,35,0.08)] transition-colors"
                    style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    ⭐ प्राथमिकता बोर्डिंग / PRIORITY BOARDING
                  </button>

                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    {[["👴", "Senior"], ["♿", "Disabled"], ["🤰", "Pregnant"]].map(([icon, label]) => (
                      <div key={label} className="bg-[#050e1f] border border-[rgba(245,166,35,0.08)] rounded-sm py-3 text-xs text-[#8aa4c8]">
                        <div className="text-xl mb-1">{icon}</div>{label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DESTINATION */}
              {step === "destination" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>कहाँ जाना है? / Where to?</h2>
                      {isPriority && <span className="text-[10px] font-mono text-[#f5a623]">⭐ Priority mode active</span>}
                    </div>
                    <button onClick={startListening}
                      className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-mono transition-all ${listening ? "border-[#e8433a] text-[#e8433a] bg-[rgba(232,67,58,0.08)] animate-pulse" : "border-[rgba(245,166,35,0.3)] text-[#f5a623] hover:bg-[rgba(245,166,35,0.07)]"}`}>
                      🎙️ {listening ? "सुन रहा..." : "Voice"}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-0.5">
                    {DESTINATIONS.map(d => (
                      <button key={d.id} onClick={() => { setDest(d); setVoiceStatus(""); goTo("confirm"); }}
                        className="flex flex-col items-center gap-2 p-3.5 border border-[rgba(245,166,35,0.1)] rounded-sm hover:border-[#f5a623] hover:bg-[rgba(245,166,35,0.05)] active:scale-[0.97] transition-all text-center">
                        <span className="text-3xl">{d.icon}</span>
                        <div>
                          <div className="text-xs font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{d.label}</div>
                          <div className="text-[10px] text-[#8aa4c8]">{d.hi}</div>
                          <div className="font-mono text-[#f5a623] text-xs mt-0.5 font-bold">~₹{d.fare}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CONFIRM */}
              {step === "confirm" && dest && (
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">{dest.icon}</div>
                  <div className="text-2xl font-bold text-[#edeae4] mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>{dest.label}</div>
                  <div className="text-sm text-[#8aa4c8] mb-1">{dest.hi}</div>
                  <div className="font-mono text-3xl font-bold text-[#f5a623] mb-6">₹{dest.fare}</div>
                  {isPriority && (
                    <div className="mb-4 px-3 py-2 bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.3)] rounded-sm text-xs text-[#f5a623] font-mono">
                      ⭐ PRIORITY BOARDING — आपको पहले बोर्ड करने दिया जाएगा
                    </div>
                  )}
                  <p className="text-sm text-[#8aa4c8] mb-6">Sahi hai? / क्या यह सही है?</p>
                  <div className="flex gap-3">
                    <button onClick={() => goTo("destination")} className="flex-1 py-4 border-2 border-[rgba(245,166,35,0.2)] text-[#8aa4c8] font-bold rounded-sm hover:border-[rgba(245,166,35,0.4)] transition-colors text-lg" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      ✕ नहीं / No
                    </button>
                    <button onClick={() => goTo("payment")} className="flex-1 py-4 bg-[#38c172] text-white font-bold rounded-sm hover:bg-[#2fa860] transition-colors text-lg" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      ✓ हाँ / Yes
                    </button>
                  </div>
                </div>
              )}

              {/* PAYMENT */}
              {step === "payment" && dest && (
                <div>
                  <h2 className="text-xl font-bold text-[#edeae4] mb-1 text-center" style={{ fontFamily: "Rajdhani, sans-serif" }}>भुगतान / Payment</h2>
                  <div className="text-center font-mono text-[#f5a623] text-3xl font-bold mb-5">₹{dest.fare}</div>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {[
                      { icon: "💵", label: "Cash · नकद", id: "cash" },
                      { icon: "📱", label: "UPI · QR", id: "upi" },
                      { icon: "🪙", label: "SETU Pass", id: "pass" },
                      { icon: "🆓", label: "BPL Free", id: "bpl" },
                      { icon: "💳", label: "NCMC Card", id: "ncmc" },
                      { icon: "🏫", label: "College ID", id: "inst" },
                    ].map(m => (
                      <button key={m.id} onClick={() => { setPayMethod(m.id); goTo("token"); }}
                        className="flex flex-col items-center gap-2 py-5 border border-[rgba(245,166,35,0.12)] rounded-sm hover:border-[#f5a623] hover:bg-[rgba(245,166,35,0.06)] active:scale-[0.97] transition-all">
                        <span className="text-3xl">{m.icon}</span>
                        <span className="text-xs text-[#edeae4] text-center" style={{ fontFamily: "Rajdhani, sans-serif" }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                  {payMethod === "upi" && (
                    <div className="flex items-center gap-4 bg-white rounded-sm p-3">
                      <QRCodeSVG value={`upi://pay?pa=setu@upi&pn=SETU&am=${dest.fare}&cu=INR`} size={80} bgColor="#ffffff" fgColor="#050e1f" />
                      <div>
                        <div className="font-mono text-[10px] text-[#050e1f] mb-1">SCAN TO PAY</div>
                        <div className="font-bold text-[#050e1f]" style={{ fontFamily: "Rajdhani, sans-serif" }}>₹{dest.fare} · setu@upi</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TOKEN */}
              {step === "token" && dest && (
                <div className="text-center py-2">
                  <div className="w-14 h-14 bg-[rgba(56,193,114,0.15)] border-2 border-[#38c172] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">✓</div>
                  <h2 className="text-xl font-bold text-[#38c172] mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>बुकिंग हो गई! / Confirmed!</h2>
                  <p className="text-xs text-[#8aa4c8] mb-4">Token printing below · नीचे टोकन प्रिंट हो रहा है</p>

                  <div className="bg-[#050e1f] border-2 border-dashed border-[rgba(245,166,35,0.4)] rounded-sm p-4 mb-4 text-left">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#f5a623] text-center mb-3">
                      {isPriority ? "⭐ PRIORITY TOKEN" : "SETU BOARDING TOKEN"}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div><div className="text-[9px] font-mono text-[#8aa4c8]">TOKEN</div>
                        <div className="text-2xl font-bold text-[#f5a623]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{token}</div></div>
                      <div><div className="text-[9px] font-mono text-[#8aa4c8]">ETA</div>
                        <div className="text-lg font-bold text-[#38c172]" style={{ fontFamily: "Rajdhani, sans-serif" }}>3 min</div></div>
                      <div><div className="text-[9px] font-mono text-[#8aa4c8]">TO</div>
                        <div className="text-xs text-[#edeae4]">{dest.label}</div>
                        <div className="text-[9px] text-[#8aa4c8]">{dest.hi}</div></div>
                      <div><div className="text-[9px] font-mono text-[#8aa4c8]">FARE</div>
                        <div className="font-mono font-bold text-[#f5a623]">₹{dest.fare}</div>
                        <div className="text-[9px] text-[#8aa4c8]">{payMethod}</div></div>
                    </div>
                    <div className="flex justify-center pt-2 border-t border-[rgba(245,166,35,0.12)]">
                      <div className="p-2 bg-white rounded-sm">
                        <QRCodeSVG value={qrValue} size={80} bgColor="#ffffff" fgColor="#050e1f" level="M" />
                      </div>
                    </div>
                    <p className="text-[9px] font-mono text-[#8aa4c8] text-center mt-1">Show QR to driver at boarding</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => navigate("/track")} className="py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      📍 Track Ride
                    </button>
                    <button onClick={reset} className="py-3 border border-[rgba(245,166,35,0.25)] text-[#8aa4c8] font-bold rounded-sm text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      ← New Booking
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live queue strip */}
            <div className="border-t border-[rgba(245,166,35,0.1)] px-5 py-3 bg-[#050e1f]">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-2">LIVE QUEUE — DELHI CENTRAL HUB</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { v: "SU-01", status: "Arriving", seats: "2/6", ok: true },
                  { v: "SU-04", status: "3 min", seats: "4/6", ok: true },
                  { v: "SU-07", status: "6 min", seats: "1/6", ok: true },
                  { v: "SU-09", status: "9 min", seats: "0/6", ok: false },
                  { v: "SU-12", status: "12 min", seats: "5/6", ok: true },
                ].map((v) => (
                  <div key={v.v} className={`flex-shrink-0 px-3 py-2 rounded-sm border text-center min-w-[72px] ${v.ok ? "border-[rgba(245,166,35,0.12)]" : "border-[rgba(232,67,58,0.2)] bg-[rgba(232,67,58,0.04)]"}`}>
                    <div className="font-mono text-[10px] text-[#8aa4c8]">{v.v}</div>
                    <div className={`text-[11px] font-bold ${v.status === "Arriving" ? "text-[#38c172]" : "text-[#8aa4c8]"}`}>{v.status}</div>
                    <div className={`text-[9px] font-mono ${!v.ok ? "text-[#e8433a]" : "text-[#f5a623]"}`}>{v.seats}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
