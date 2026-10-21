import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";

const DELHI_PICKUP_POINTS = [
  { id: "rajiv", label: "Rajiv Chowk Metro", icon: "🚇", zone: "Yellow + Blue Line", vehicles: 5, distance: "Gate 5 exit" },
  { id: "kashmere", label: "Kashmere Gate ISBT", icon: "🚌", zone: "North Delhi", vehicles: 8, distance: "Main gate" },
  { id: "aiims", label: "AIIMS Metro Station", icon: "🚇", zone: "Yellow Line", vehicles: 4, distance: "Exit A" },
  { id: "dwarka21", label: "Dwarka Sec 21 Metro", icon: "🚇", zone: "Blue Line", vehicles: 6, distance: "Exit 2" },
  { id: "nehruplace", label: "Nehru Place Metro", icon: "🚇", zone: "Violet Line", vehicles: 3, distance: "Exit 1" },
  { id: "anandvihar", label: "Anand Vihar ISBT", icon: "🚌", zone: "East Delhi", vehicles: 7, distance: "Bus bay 3" },
  { id: "saket", label: "Saket Metro", icon: "🚇", zone: "Yellow Line", vehicles: 4, distance: "Exit B" },
  { id: "lajpat", label: "Lajpat Nagar Metro", icon: "🚇", zone: "Pink Line", vehicles: 3, distance: "Gate 2" },
  { id: "newdelhi", label: "New Delhi Railway Stn", icon: "🚉", zone: "Central Delhi", vehicles: 10, distance: "Paharganj exit" },
  { id: "hazrat", label: "Hazrat Nizamuddin Stn", icon: "🚉", zone: "South Delhi", vehicles: 5, distance: "Main gate" },
];

const DELHI_DESTINATIONS = [
  { id: "cp", label: "Connaught Place", hi: "कनॉट प्लेस", icon: "🏛️", zone: "Central", fare: 15, km: "1.2 km" },
  { id: "civillines", label: "Civil Lines", hi: "सिविल लाइंस", icon: "🏘️", zone: "North Delhi", fare: 18, km: "2.1 km" },
  { id: "gk1", label: "GK-1 Market", hi: "ग्रेटर कैलाश-1", icon: "🛒", zone: "South Delhi", fare: 20, km: "2.4 km" },
  { id: "dwarka", label: "Dwarka Mor", hi: "द्वारका मोर", icon: "🏘️", zone: "West Delhi", fare: 15, km: "1.5 km" },
  { id: "crpark", label: "CR Park", hi: "सीआर पार्क", icon: "🌳", zone: "South Delhi", fare: 18, km: "2.2 km" },
  { id: "shahdara", label: "Shahdara", hi: "शाहदरा", icon: "🏙️", zone: "East Delhi", fare: 20, km: "2.8 km" },
  { id: "malviya", label: "Malviya Nagar", hi: "मालवीय नगर", icon: "🏡", zone: "South Delhi", fare: 15, km: "1.8 km" },
  { id: "janpath", label: "Janpath Market", hi: "जनपथ", icon: "🛍️", zone: "Central", fare: 15, km: "1.1 km" },
  { id: "hauzkhaz", label: "Hauz Khas Village", hi: "हौज खास", icon: "☕", zone: "South Delhi", fare: 22, km: "2.6 km" },
  { id: "andrewsganj", label: "Andrews Ganj", hi: "एंड्रयूज गंज", icon: "🏢", zone: "South Delhi", fare: 18, km: "2.3 km" },
];

const VEHICLE_TYPES = [
  { id: "shared_auto", label: "Shared Auto", icon: "🛺", fare: "₹15–25", fareNum: 20, eta: "2–4 min", capacity: 6, img: "https://images.unsplash.com/photo-1564291886459-a39ad7415125?w=400&h=200&fit=crop&auto=format", badge: "Cheapest", badgeColor: "#38c172", features: ["6 passengers shared", "Dynamic route matching", "Cash & UPI"] },
  { id: "priority_auto", label: "Priority Auto", icon: "⭐", fare: "₹25–35", fareNum: 30, eta: "3–5 min", capacity: 6, img: "https://images.unsplash.com/photo-1624858020896-4a558c5d7042?w=400&h=200&fit=crop&auto=format", badge: "Accessible", badgeColor: "#f5a623", features: ["Priority seat guaranteed", "Elderly/disabled first", "Assisted boarding"] },
  { id: "women_only", label: "Women-Only Auto", icon: "🔐", fare: "₹25–30", fareNum: 28, eta: "4–6 min", capacity: 6, img: "https://images.unsplash.com/photo-1760791963527-d170b4cf26ea?w=400&h=200&fit=crop&auto=format", badge: "Safe Night", badgeColor: "#8aa4c8", features: ["Female driver", "Live tracking shared", "Safe Night Return"] },
  { id: "cab", label: "SETU Cab", icon: "🚕", fare: "₹40–70", fareNum: 55, eta: "5–8 min", capacity: 3, img: "https://images.unsplash.com/photo-1570168305673-42708ac64073?w=400&h=200&fit=crop&auto=format", badge: "AC · Private", badgeColor: "#f5a623", features: ["Private, no sharing", "Air conditioned", "1–3 passengers"] },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: "💵", sub: "Pay driver directly" },
  { id: "upi", label: "UPI / QR", icon: "📱", sub: "GPay · PhonePe · Paytm" },
  { id: "pass", label: "SETU Pass", icon: "🪙", sub: "Daily / Weekly pass" },
  { id: "bpl", label: "BPL Free", icon: "🆓", sub: "₹5–10 with ration card" },
  { id: "ncmc", label: "NCMC Card", icon: "💳", sub: "Tap & ride" },
  { id: "institutional", label: "College / Company ID", icon: "🏫", sub: "Billed to institution" },
];

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_LABELS = ["Pickup", "Destination", "Vehicle", "Passenger", "Payment", "Confirmed"];

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [pickup, setPickup] = useState("");
  const [dest, setDest] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [passengerType, setPassengerType] = useState("general");
  const [needPriority, setNeedPriority] = useState(false);
  const [payment, setPayment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [token] = useState(`SU-${Math.floor(10 + Math.random() * 89)}`);
  const [bookingMode, setBookingMode] = useState<"normal" | "qr" | "voice">("normal");
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [qrStep, setQrStep] = useState<"scan" | "confirm" | "done">("scan");
  const [voiceStage, setVoiceStage] = useState<"pickup" | "dest" | "vehicle" | "payment" | "confirm" | "done">("pickup");
  const [voiceLog, setVoiceLog] = useState<string[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoTyping, setDemoTyping] = useState("");
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const demoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedPickup = DELHI_PICKUP_POINTS.find(p => p.id === pickup);
  const selectedDest = DELHI_DESTINATIONS.find(d => d.id === dest);
  const selectedVehicle = VEHICLE_TYPES.find(v => v.id === vehicleType);

  function speak(text: string) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "hi-IN";
      utt.rate = 0.9;
      speechRef.current = utt;
      window.speechSynthesis.speak(utt);
    }
  }

  function startVoiceListening() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setVoiceText("Voice recognition not supported in this browser. Please use Chrome.");
      return;
    }
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SR();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    setIsListening(true);
    setVoiceText("सुन रहा हूँ... बोलिए / Listening...");
    speak("Aap kahan jaana chahte hain? Apna destination boliye.");
    recognition.onresult = (e: any) => {
      const said = e.results[0][0].transcript;
      setVoiceText(`Suna: "${said}" — Matching destination...`);
      setIsListening(false);
      setTimeout(() => {
        const match = DELHI_DESTINATIONS.find(d =>
          d.label.toLowerCase().includes(said.toLowerCase()) ||
          d.hi.includes(said) ||
          said.toLowerCase().includes(d.label.toLowerCase().split(" ")[0].toLowerCase())
        ) ?? DELHI_DESTINATIONS[0];
        setDest(match.id);
        setVoiceText(`✓ मिला: ${match.label} (${match.hi})`);
        speak(`Theek hai. ${match.label} chunga gaya. Kya confirm karein?`);
        setTimeout(() => setStep(3), 1500);
      }, 1000);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setVoiceText("Could not hear clearly. Please try again or select manually.");
    };
    recognition.start();
  }

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (demoRef.current) clearTimeout(demoRef.current);
    };
  }, []);

  function runDemo() {
    setIsDemoMode(true);
    setVoiceStage("pickup");
    setVoiceLog([]);
    setVoiceText("");
    setPickup(""); setDest(""); setVehicleType(""); setPayment("");

    const steps: Array<{ delay: number; phrase: string; action: () => void; log: string }> = [
      { delay: 800,  phrase: "Rajiv Chowk Metro",   action: () => { setPickup("rajiv");   setVoiceStage("dest"); },    log: "✓ Pickup: Rajiv Chowk Metro" },
      { delay: 3200, phrase: "Connaught Place",       action: () => { setDest("cp");        setVoiceStage("vehicle"); }, log: "✓ Destination: Connaught Place — ₹15" },
      { delay: 5600, phrase: "Shared Auto",           action: () => { setVehicleType("shared_auto"); setVoiceStage("payment"); }, log: "✓ Vehicle: Shared Auto · ₹15–25" },
      { delay: 8000, phrase: "UPI",                   action: () => { setPayment("upi");    setVoiceStage("confirm"); }, log: "✓ Payment: UPI" },
      { delay: 10400,phrase: "Haan, confirm karo",   action: () => { setVoiceStage("done"); },                         log: "✓ Booking Confirmed!" },
    ];

    function typePhrase(phrase: string, cb: () => void) {
      setIsListening(true);
      setDemoTyping("");
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDemoTyping(phrase.slice(0, i));
        if (i >= phrase.length) {
          clearInterval(interval);
          setIsListening(false);
          cb();
        }
      }, 60);
    }

    steps.forEach(({ delay, phrase, action, log }) => {
      demoRef.current = setTimeout(() => {
        speak(phrase);
        typePhrase(phrase, () => {
          setVoiceText(log);
          setVoiceLog(prev => [...prev, log]);
          action();
        });
      }, delay);
    });
  }

  const tagColors: Record<string, string> = {
    "#38c172": "bg-[rgba(56,193,114,0.12)] text-[#38c172] border-[rgba(56,193,114,0.3)]",
    "#f5a623": "bg-[rgba(245,166,35,0.12)] text-[#f5a623] border-[rgba(245,166,35,0.3)]",
    "#8aa4c8": "bg-[rgba(138,164,200,0.12)] text-[#8aa4c8] border-[rgba(138,164,200,0.3)]",
  };

  const bookingQrValue = `SETU:BOOKING:${pickup || "RAJIV"}:${dest || "CP"}:${vehicleType || "shared_auto"}:${phone || "guest"}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#f5a623]">BOOKING</span>
          <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
        </div>
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "Rajdhani, sans-serif" }}>Book Your SETU Ride</h1>

        {/* Booking mode switcher */}
        <div className="flex gap-2 mb-6">
          {([["normal", "📋 Standard"], ["qr", "📷 QR Code"], ["voice", "🎙️ Voice"]] as [typeof bookingMode, string][]).map(([mode, label]) => (
            <button key={mode} onClick={() => setBookingMode(mode)}
              className={`px-4 py-2 text-sm font-semibold rounded-sm border transition-all ${bookingMode === mode ? "bg-[#f5a623] text-[#050e1f] border-[#f5a623]" : "border-[rgba(245,166,35,0.2)] text-[#8aa4c8] hover:border-[rgba(245,166,35,0.4)]"}`}
              style={{ fontFamily: "Rajdhani, sans-serif" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* QR MODE */}
      {bookingMode === "qr" && (
        <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.2)] rounded-sm p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>Scan to Book via WhatsApp</h2>
            <p className="text-[#8aa4c8] text-sm mb-8">No app needed. Scan this QR code with any phone camera to open a WhatsApp booking chat instantly.</p>

            {qrStep === "scan" && (
              <div>
                <div className="inline-block p-4 bg-white rounded-sm mb-4">
                  <QRCodeSVG
                    value="https://wa.me/918001234567?text=SETU+book+ride"
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#050e1f"
                    level="H"
                  />
                </div>
                <div className="text-xs font-mono text-[#8aa4c8] mb-6">WhatsApp: wa.me/918001234567 · Send "SETU"</div>
                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  {[
                    { step: "1", text: "Scan QR with phone camera" },
                    { step: "2", text: "WhatsApp opens automatically" },
                    { step: "3", text: "Reply with your destination" },
                  ].map(s => (
                    <div key={s.step} className="bg-[#050e1f] border border-[rgba(245,166,35,0.1)] rounded-sm p-3">
                      <div className="w-6 h-6 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm flex items-center justify-center text-sm mx-auto mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>{s.step}</div>
                      <p className="text-[10px] text-[#8aa4c8]">{s.text}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setQrStep("confirm")}
                  className="w-full py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm hover:bg-[#fbb740] transition-colors"
                  style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>
                  I'VE SCANNED — CONTINUE BOOKING →
                </button>
              </div>
            )}

            {qrStep === "confirm" && (
              <div>
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-[#38c172] mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>WhatsApp Connected!</h3>
                <p className="text-[#8aa4c8] text-sm mb-6">Your booking QR code is below. Show this to the vehicle driver at boarding or at the kiosk scanner.</p>
                <div className="inline-block p-4 bg-white rounded-sm mb-4 relative">
                  <QRCodeSVG value={bookingQrValue} size={180} bgColor="#ffffff" fgColor="#050e1f" level="M" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-[#f5a623] rounded-sm flex items-center justify-center text-[#050e1f] font-bold text-lg" style={{ fontFamily: "Rajdhani, sans-serif" }}>S</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#8aa4c8] mb-6">{bookingQrValue}</div>
                <button onClick={() => setQrStep("done")}
                  className="w-full py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm hover:bg-[#fbb740] transition-colors"
                  style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>
                  CONFIRM RIDE →
                </button>
              </div>
            )}

            {qrStep === "done" && (
              <div>
                <div className="w-16 h-16 bg-[rgba(56,193,114,0.15)] border-2 border-[#38c172] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                <h3 className="text-2xl font-bold text-[#38c172] mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>Ride Booked via QR!</h3>
                <div className="bg-[#050e1f] border-2 border-dashed border-[rgba(245,166,35,0.3)] rounded-sm p-5 mb-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#f5a623] text-center mb-3">SETU BOOKING TOKEN</div>
                  <div className="text-3xl font-bold text-[#f5a623] text-center mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>{token}</div>
                  <div className="text-xs text-center text-[#8aa4c8]">Vehicle AP 07 SU-03 · ETA 4 min · ₹20</div>
                </div>
                <button onClick={() => navigate("/track")} className="w-full py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  TRACK MY RIDE →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VOICE MODE */}
      {bookingMode === "voice" && (() => {
        const VSTAGES = ["pickup", "dest", "vehicle", "payment", "confirm", "done"];
        const stageIdx = VSTAGES.indexOf(voiceStage);

        const prompts: Record<string, string> = {
          pickup: "Namaste! Aap kahan se sawaar hona chahte hain? Apna pickup point boliye — jaise Rajiv Chowk, AIIMS ya Kashmere Gate.",
          dest:   "Aap kahan jaana chahte hain? Destination boliye — jaise Connaught Place, Malviya Nagar ya Hauz Khas.",
          vehicle:"Kaun sa vehicle chahiye? Shared Auto, Priority Auto, Women Only Auto, ya SETU Cab?",
          payment:"Aap kaise payment karenge? Cash, UPI, ya SETU Pass?",
          confirm:"Kya aapki booking sahi hai? Haan ya Yes bolein confirm karne ke liye.",
          done:   "Bahut badhiya! Aapki booking ho gayi. Token neeche dikha raha hai. Dhanyawad!",
        };

        function voiceListen(stage: string, onMatch: (said: string) => void) {
          const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
          if (!SR) { setVoiceText("Voice recognition not supported. Please use Chrome."); return; }
          const r = new SR();
          r.lang = "hi-IN";
          r.continuous = false;
          setIsListening(true);
          setVoiceText("सुन रहा हूँ... / Listening...");
          r.onresult = (e: any) => {
            setIsListening(false);
            onMatch(e.results[0][0].transcript);
          };
          r.onerror = () => { setIsListening(false); setVoiceText("Could not hear. Tap mic to try again."); };
          r.start();
        }

        function handleMic() {
          speak(prompts[voiceStage]);
          setTimeout(() => {
            if (voiceStage === "pickup") {
              voiceListen("pickup", (said) => {
                const m = DELHI_PICKUP_POINTS.find(p =>
                  p.label.toLowerCase().includes(said.toLowerCase()) ||
                  said.toLowerCase().includes(p.label.toLowerCase().split(" ")[0].toLowerCase())
                ) ?? DELHI_PICKUP_POINTS[0];
                setPickup(m.id);
                const msg = `✓ Pickup: ${m.label}`;
                setVoiceText(msg);
                setVoiceLog(l => [...l, msg]);
                speak(`Theek hai. Pickup ${m.label} set ho gaya.`);
                setTimeout(() => { setVoiceStage("dest"); speak(prompts.dest); }, 1800);
              });
            } else if (voiceStage === "dest") {
              voiceListen("dest", (said) => {
                const m = DELHI_DESTINATIONS.find(d =>
                  d.label.toLowerCase().includes(said.toLowerCase()) ||
                  d.hi.includes(said) ||
                  said.toLowerCase().includes(d.label.toLowerCase().split(" ")[0].toLowerCase())
                ) ?? DELHI_DESTINATIONS[0];
                setDest(m.id);
                const msg = `✓ Destination: ${m.label} — ₹${m.fare}`;
                setVoiceText(msg);
                setVoiceLog(l => [...l, msg]);
                speak(`Destination ${m.label}, fare ${m.fare} rupay.`);
                setTimeout(() => { setVoiceStage("vehicle"); speak(prompts.vehicle); }, 1800);
              });
            } else if (voiceStage === "vehicle") {
              voiceListen("vehicle", (said) => {
                const s = said.toLowerCase();
                const m = s.includes("women") || s.includes("महिला") ? "women_only"
                  : s.includes("cab") || s.includes("taxi") ? "cab"
                  : s.includes("priority") || s.includes("priorit") ? "priority_auto"
                  : "shared_auto";
                setVehicleType(m);
                const v = VEHICLE_TYPES.find(x => x.id === m)!;
                const msg = `✓ Vehicle: ${v.label} · ${v.fare}`;
                setVoiceText(msg);
                setVoiceLog(l => [...l, msg]);
                speak(`${v.label} book kiya ja raha hai. Fare ${v.fare}.`);
                setTimeout(() => { setVoiceStage("payment"); speak(prompts.payment); }, 1800);
              });
            } else if (voiceStage === "payment") {
              voiceListen("payment", (said) => {
                const s = said.toLowerCase();
                const pm = s.includes("upi") || s.includes("paytm") || s.includes("phone") ? "upi"
                  : s.includes("pass") ? "pass"
                  : "cash";
                setPayment(pm);
                const msg = `✓ Payment: ${pm.toUpperCase()}`;
                setVoiceText(msg);
                setVoiceLog(l => [...l, msg]);
                speak(`Payment ${pm} set ho gaya.`);
                setTimeout(() => { setVoiceStage("confirm"); speak(prompts.confirm); }, 1800);
              });
            } else if (voiceStage === "confirm") {
              voiceListen("confirm", (said) => {
                const s = said.toLowerCase();
                if (s.includes("haan") || s.includes("yes") || s.includes("ha") || s.includes("theek")) {
                  setVoiceText("✓ Booking confirmed!");
                  setVoiceLog(l => [...l, "✓ Booking Confirmed"]);
                  speak(prompts.done);
                  setTimeout(() => setVoiceStage("done"), 1200);
                } else {
                  setVoiceText("Booking cancelled. Tap mic to start over.");
                  setVoiceLog(l => [...l, "✗ Cancelled"]);
                }
              });
            }
          }, 600);
        }

        const vPickup = DELHI_PICKUP_POINTS.find(p => p.id === pickup);
        const vDest = DELHI_DESTINATIONS.find(d => d.id === dest);
        const vVehicle = VEHICLE_TYPES.find(v => v.id === vehicleType);

        return (
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.2)] rounded-sm overflow-hidden">
            {/* Stage progress bar */}
            <div className="flex border-b border-[rgba(245,166,35,0.1)]">
              {["Pickup", "Destination", "Vehicle", "Payment", "Confirm", "Done"].map((s, i) => (
                <div key={s} className={`flex-1 py-2 text-center text-[9px] font-mono uppercase tracking-widest transition-all ${i < stageIdx ? "text-[#38c172] bg-[rgba(56,193,114,0.06)]" : i === stageIdx ? "text-[#f5a623] bg-[rgba(245,166,35,0.08)]" : "text-[#3a5270]"}`}>
                  {i < stageIdx ? "✓" : i + 1}
                  <div className="hidden sm:block mt-0.5">{s}</div>
                </div>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-1 text-center" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                {voiceStage === "done" ? "🎉 Booking Confirmed!" : "🎙️ Voice Booking"}
              </h2>
              <p className="text-[#8aa4c8] text-sm text-center mb-6">
                {voiceStage === "done" ? "Your token is ready below" : "Tap mic → speak → SETU listens"}
              </p>

              {/* Demo launcher — always visible when not done */}
              {voiceStage !== "done" && (
                <div className="mb-6 border-2 border-dashed border-[rgba(245,166,35,0.3)] rounded-sm p-4 bg-[rgba(245,166,35,0.04)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#f5a623]">▶ DEMO MODE</span>
                    <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
                    {isDemoMode && <span className="text-[9px] font-mono text-[#38c172] animate-pulse">RUNNING...</span>}
                  </div>
                  <p className="text-xs text-[#8aa4c8] mb-3">Mic not working? Run the demo — it simulates a complete voice booking automatically so you can see how it works.</p>
                  <button onClick={runDemo} disabled={isDemoMode && voiceStage !== "pickup"}
                    className="w-full py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm hover:bg-[#fbb740] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "0.95rem" }}>
                    <span>▶</span>
                    {isDemoMode && voiceStage !== "pickup" ? "Demo Running..." : "RUN VOICE DEMO — Watch Full Booking"}
                  </button>
                </div>
              )}

              {voiceStage !== "done" && (
                <>
                  {/* Current prompt card */}
                  <div className="bg-[#050e1f] border border-[rgba(245,166,35,0.12)] rounded-sm px-4 py-3 mb-5 text-sm text-[#edeae4] text-center">
                    {voiceStage === "pickup" && "📍 बोलिए: आप कहाँ से बैठेंगे? / Where are you boarding?"}
                    {voiceStage === "dest" && "🏁 बोलिए: आप कहाँ जाना चाहते हैं? / Where to go?"}
                    {voiceStage === "vehicle" && "🛺 बोलिए: कौन सा वाहन? Shared Auto / Cab / Women Only?"}
                    {voiceStage === "payment" && "💳 बोलिए: Cash / UPI / SETU Pass?"}
                    {voiceStage === "confirm" && "✅ बोलिए: हाँ / Yes — to confirm your booking"}
                  </div>

                  {/* Mic + Demo typing display */}
                  <div className="flex justify-center mb-5">
                    <button onClick={handleMic} disabled={isListening || isDemoMode}
                      className={`w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 border-4 transition-all ${isListening ? "border-[#e8433a] bg-[rgba(232,67,58,0.12)] animate-pulse" : "border-[rgba(245,166,35,0.4)] bg-[rgba(245,166,35,0.08)] hover:border-[#f5a623] hover:bg-[rgba(245,166,35,0.16)]"}`}>
                      <span className="text-4xl">{isListening ? "🔴" : "🎙️"}</span>
                      <span className="font-bold text-xs" style={{ fontFamily: "Rajdhani, sans-serif", color: isListening ? "#e8433a" : "#f5a623" }}>
                        {isListening ? "LISTENING..." : "TAP & SPEAK"}
                      </span>
                    </button>
                  </div>

                  {/* Demo typing bubble */}
                  {isDemoMode && demoTyping && (
                    <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-[rgba(245,166,35,0.06)] border border-[rgba(245,166,35,0.2)] rounded-sm">
                      <span className="text-lg">🎙️</span>
                      <div className="flex-1">
                        <div className="text-[9px] font-mono text-[#8aa4c8] mb-0.5 uppercase tracking-widest">User said:</div>
                        <div className="text-sm text-[#edeae4] font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                          "{demoTyping}<span className="animate-pulse text-[#f5a623]">|</span>"
                        </div>
                      </div>
                    </div>
                  )}

                  {voiceText && (
                    <div className={`mb-5 px-4 py-3 rounded-sm border text-sm text-center ${voiceText.startsWith("✓") ? "border-[rgba(56,193,114,0.3)] bg-[rgba(56,193,114,0.07)] text-[#38c172]" : voiceText.startsWith("Could") ? "border-[rgba(232,67,58,0.2)] bg-[rgba(232,67,58,0.05)] text-[#e8433a]" : "border-[rgba(245,166,35,0.15)] text-[#edeae4]"}`}>
                      {voiceText}
                    </div>
                  )}

                  {/* Hints */}
                  <div className="bg-[#050e1f] border border-[rgba(245,166,35,0.08)] rounded-sm px-4 py-3 mb-5">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[#3a5270] mb-2">Say any of these:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {voiceStage === "pickup" && ["Rajiv Chowk", "AIIMS", "Kashmere Gate", "Saket", "Dwarka"].map(s => <span key={s} className="px-2 py-1 text-[10px] font-mono bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] text-[#8aa4c8] rounded-sm">"{s}"</span>)}
                      {voiceStage === "dest" && ["Connaught Place", "Malviya Nagar", "Hauz Khas", "कनॉट प्लेस", "GK-1"].map(s => <span key={s} className="px-2 py-1 text-[10px] font-mono bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] text-[#8aa4c8] rounded-sm">"{s}"</span>)}
                      {voiceStage === "vehicle" && ["Shared Auto", "Cab", "Women Only", "Priority Auto"].map(s => <span key={s} className="px-2 py-1 text-[10px] font-mono bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] text-[#8aa4c8] rounded-sm">"{s}"</span>)}
                      {voiceStage === "payment" && ["Cash", "UPI", "SETU Pass"].map(s => <span key={s} className="px-2 py-1 text-[10px] font-mono bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] text-[#8aa4c8] rounded-sm">"{s}"</span>)}
                      {voiceStage === "confirm" && ["Haan", "Yes", "Theek hai", "Confirm"].map(s => <span key={s} className="px-2 py-1 text-[10px] font-mono bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] text-[#8aa4c8] rounded-sm">"{s}"</span>)}
                    </div>
                  </div>

                  {/* Conversation log */}
                  {voiceLog.length > 0 && (
                    <div className="border border-[rgba(245,166,35,0.08)] rounded-sm px-4 py-3 mb-5 space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-[#3a5270] mb-2">Booking progress</div>
                      {voiceLog.map((l, i) => <div key={i} className="text-xs text-[#38c172] font-mono">{l}</div>)}
                    </div>
                  )}
                </>
              )}

              {voiceStage === "done" && (
                <div className="text-center">
                  <div className="bg-[#050e1f] border-2 border-dashed border-[rgba(245,166,35,0.4)] rounded-sm p-5 mb-5 text-left">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#f5a623] text-center mb-4">SETU VOICE BOOKING TOKEN</div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div><div className="text-[9px] font-mono text-[#8aa4c8]">TOKEN</div><div className="text-2xl font-bold text-[#f5a623]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{token}</div></div>
                      <div><div className="text-[9px] font-mono text-[#8aa4c8]">ETA</div><div className="text-lg font-bold text-[#38c172]" style={{ fontFamily: "Rajdhani, sans-serif" }}>~4 min</div></div>
                      {vPickup && <div><div className="text-[9px] font-mono text-[#8aa4c8]">FROM</div><div className="text-xs text-[#edeae4]">{vPickup.label}</div></div>}
                      {vDest && <div><div className="text-[9px] font-mono text-[#8aa4c8]">TO</div><div className="text-xs text-[#edeae4]">{vDest.label}</div><div className="font-mono text-[#f5a623] text-xs">₹{vDest.fare}</div></div>}
                      {vVehicle && <div><div className="text-[9px] font-mono text-[#8aa4c8]">VEHICLE</div><div className="text-xs text-[#edeae4]">{vVehicle.icon} {vVehicle.label}</div></div>}
                      <div><div className="text-[9px] font-mono text-[#8aa4c8]">PAYMENT</div><div className="text-xs text-[#edeae4] uppercase">{payment || "cash"}</div></div>
                    </div>
                    <div className="flex justify-center pt-3 border-t border-[rgba(245,166,35,0.1)]">
                      <div className="p-2 bg-white rounded-sm">
                        <QRCodeSVG value={`SETU:VOICE:${token}:${pickup}:${dest}:${vehicleType}:${payment}`} size={100} bgColor="#ffffff" fgColor="#050e1f" level="M" />
                      </div>
                    </div>
                    <p className="text-[9px] font-mono text-[#8aa4c8] text-center mt-1">Show QR to driver at boarding</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigate("/track")} className="py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>📍 Track Ride</button>
                    <button onClick={() => { setVoiceStage("pickup"); setVoiceLog([]); setVoiceText(""); setDemoTyping(""); setIsDemoMode(false); setPickup(""); setDest(""); setVehicleType(""); setPayment(""); }} className="py-3 border border-[rgba(245,166,35,0.25)] text-[#8aa4c8] font-bold rounded-sm text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>🔄 New Booking</button>
                  </div>
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button onClick={() => speak(prompts[voiceStage])} className="flex-1 py-2.5 border border-[rgba(245,166,35,0.2)] text-[#f5a623] text-sm font-semibold rounded-sm hover:bg-[rgba(245,166,35,0.06)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  🔊 Repeat Prompt
                </button>
                <button onClick={() => setBookingMode("normal")} className="flex-1 py-2.5 border border-[rgba(138,164,200,0.15)] text-[#8aa4c8] text-sm font-semibold rounded-sm hover:bg-[rgba(138,164,200,0.04)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  📋 Manual Mode
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* NORMAL STEP-BY-STEP BOOKING */}
      {bookingMode === "normal" && (
        <>
          {/* Step indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const done = step > n;
                const active = step === n;
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold transition-all ${done ? "bg-[#38c172] text-white" : active ? "bg-[#f5a623] text-[#050e1f]" : "bg-[#1a3259] text-[#8aa4c8]"}`}
                        style={{ fontFamily: "Rajdhani, sans-serif" }}>
                        {done ? "✓" : n}
                      </div>
                      <span className={`text-[9px] font-mono mt-1 tracking-wide hidden sm:block ${active ? "text-[#f5a623]" : "text-[#8aa4c8]"}`}>{label.toUpperCase()}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-px mx-1 transition-all ${done ? "bg-[#38c172]" : "bg-[rgba(245,166,35,0.15)]"}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.15)] rounded-sm p-6 sm:p-8">

            {/* STEP 1: PICKUP */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Delhi Pickup Point</h2>
                <p className="text-xs text-[#8aa4c8] mb-5">Select your nearest SETU hub in Delhi</p>
                <div className="flex items-center gap-3 bg-[#050e1f] border border-[rgba(245,166,35,0.12)] rounded-sm px-3 py-2.5 mb-4">
                  <span className="text-[#f5a623]">🔍</span>
                  <input placeholder="Search metro station / bus stop..." className="flex-1 bg-transparent text-sm text-[#edeae4] placeholder-[#3a5270] outline-none" />
                </div>
                <div className="space-y-2 mb-6 max-h-[380px] overflow-y-auto pr-1">
                  {DELHI_PICKUP_POINTS.map(p => (
                    <button key={p.id} onClick={() => setPickup(p.id)}
                      className={`w-full flex items-center gap-4 p-3.5 rounded-sm border text-left transition-all ${pickup === p.id ? "border-[#f5a623] bg-[rgba(245,166,35,0.07)]" : "border-[rgba(245,166,35,0.08)] hover:border-[rgba(245,166,35,0.28)] bg-[#050e1f]"}`}>
                      <span className="text-xl">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#edeae4] text-sm truncate" style={{ fontFamily: "Rajdhani, sans-serif" }}>{p.label}</div>
                        <div className="text-xs text-[#8aa4c8]">{p.zone} · {p.distance}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-mono text-[#38c172]">{p.vehicles} vehicles</div>
                        <div className="text-[10px] text-[#8aa4c8]">available</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} disabled={!pickup}
                  className="w-full py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm disabled:opacity-40 hover:bg-[#fbb740] transition-colors"
                  style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>
                  CONTINUE →
                </button>
              </div>
            )}

            {/* STEP 2: DESTINATION with voice */}
            {step === 2 && (
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif" }}>Where to in Delhi?</h2>
                    <p className="text-xs text-[#8aa4c8]">Tap destination or use voice</p>
                  </div>
                  <button onClick={startVoiceListening}
                    className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-mono transition-all ${isListening ? "border-[#e8433a] text-[#e8433a] bg-[rgba(232,67,58,0.08)] animate-pulse" : "border-[rgba(245,166,35,0.3)] text-[#f5a623] hover:bg-[rgba(245,166,35,0.07)]"}`}>
                    🎙️ {isListening ? "Listening..." : "Voice / बोलें"}
                  </button>
                </div>
                {voiceText && (
                  <div className="mb-3 p-3 bg-[rgba(245,166,35,0.06)] border border-[rgba(245,166,35,0.15)] rounded-sm text-xs text-[#edeae4]">{voiceText}</div>
                )}
                <div className="grid grid-cols-2 gap-2 mb-5 max-h-[380px] overflow-y-auto pr-1">
                  {DELHI_DESTINATIONS.map(d => (
                    <button key={d.id} onClick={() => setDest(d.id)}
                      className={`flex flex-col p-3.5 rounded-sm border text-left transition-all ${dest === d.id ? "border-[#f5a623] bg-[rgba(245,166,35,0.07)]" : "border-[rgba(245,166,35,0.08)] hover:border-[rgba(245,166,35,0.28)] bg-[#050e1f]"}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xl">{d.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#edeae4] text-xs truncate" style={{ fontFamily: "Rajdhani, sans-serif" }}>{d.label}</div>
                          <div className="text-[10px] text-[#8aa4c8]">{d.hi}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-mono text-[#f5a623] text-xs font-bold">~{d.fare} ₹</span>
                        <span className="font-mono text-[#8aa4c8] text-[10px]">{d.km}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-3 border border-[rgba(245,166,35,0.2)] text-[#8aa4c8] font-bold rounded-sm text-sm hover:border-[rgba(245,166,35,0.4)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>← BACK</button>
                  <button onClick={() => setStep(3)} disabled={!dest} className="flex-1 py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm disabled:opacity-40 hover:bg-[#fbb740] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>CONTINUE →</button>
                </div>
              </div>
            )}

            {/* STEP 3: VEHICLE */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Choose Vehicle</h2>
                <p className="text-xs text-[#8aa4c8] mb-5">All electric, GPS-tracked, safety-certified</p>
                <div className="space-y-3 mb-6">
                  {VEHICLE_TYPES.map(v => (
                    <button key={v.id} onClick={() => setVehicleType(v.id)}
                      className={`w-full rounded-sm border text-left transition-all overflow-hidden ${vehicleType === v.id ? "border-[#f5a623]" : "border-[rgba(245,166,35,0.1)] hover:border-[rgba(245,166,35,0.28)]"}`}>
                      <div className="flex gap-0">
                        <div className="w-24 flex-shrink-0">
                          <img src={v.img} alt={v.label} className="w-full h-full object-cover" style={{ backgroundColor: "#0c1d38", minHeight: "90px" }} />
                        </div>
                        <div className="flex-1 p-3 bg-[#050e1f]">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{v.icon}</span>
                              <span className="font-bold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{v.label}</span>
                              <span className={`px-1.5 py-0.5 text-[9px] font-mono border rounded-sm ${tagColors[v.badgeColor]}`}>{v.badge}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-[#f5a623] font-bold text-sm">{v.fare}</div>
                              <div className="text-[10px] font-mono text-[#38c172]">ETA {v.eta}</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {v.features.map(f => <span key={f} className="text-[10px] font-mono px-1.5 py-0.5 bg-[rgba(138,164,200,0.07)] text-[#8aa4c8] rounded-sm border border-[rgba(138,164,200,0.12)]">{f}</span>)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-5 py-3 border border-[rgba(245,166,35,0.2)] text-[#8aa4c8] font-bold rounded-sm text-sm hover:border-[rgba(245,166,35,0.4)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>← BACK</button>
                  <button onClick={() => setStep(4)} disabled={!vehicleType} className="flex-1 py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm disabled:opacity-40 hover:bg-[#fbb740] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>CONTINUE →</button>
                </div>
              </div>
            )}

            {/* STEP 4: PASSENGER */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "Rajdhani, sans-serif" }}>Passenger Details</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-1.5 block">Name (optional)</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Raju / Priya / Kamlaben"
                      className="w-full bg-[#050e1f] border border-[rgba(245,166,35,0.15)] rounded-sm px-4 py-2.5 text-sm text-[#edeae4] placeholder-[#3a5270] outline-none focus:border-[#f5a623] transition-colors" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-1.5 block">Mobile (for SMS token)</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-[#050e1f] border border-[rgba(245,166,35,0.15)] rounded-sm px-4 py-2.5 text-sm text-[#edeae4] placeholder-[#3a5270] outline-none focus:border-[#f5a623] transition-colors" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-2 block">I am</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "general", icon: "👤", label: "General" },
                        { id: "elderly", icon: "👴", label: "Senior" },
                        { id: "student", icon: "🎓", label: "Student" },
                        { id: "disabled", icon: "♿", label: "Differently-abled" },
                        { id: "woman", icon: "👩", label: "Woman (solo)" },
                        { id: "bpl", icon: "💰", label: "BPL / Subsidised" },
                      ].map(p => (
                        <button key={p.id} onClick={() => setPassengerType(p.id)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-sm border text-center transition-all ${passengerType === p.id ? "border-[#f5a623] bg-[rgba(245,166,35,0.07)]" : "border-[rgba(245,166,35,0.08)] hover:border-[rgba(245,166,35,0.25)] bg-[#050e1f]"}`}>
                          <span className="text-xl">{p.icon}</span>
                          <span className="text-[11px] text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={needPriority} onChange={e => setNeedPriority(e.target.checked)} className="w-4 h-4 accent-[#f5a623]" />
                    <span className="text-sm text-[#edeae4]">⭐ I need priority boarding</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="px-5 py-3 border border-[rgba(245,166,35,0.2)] text-[#8aa4c8] font-bold rounded-sm text-sm hover:border-[rgba(245,166,35,0.4)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>← BACK</button>
                  <button onClick={() => setStep(5)} className="flex-1 py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm hover:bg-[#fbb740] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>CONTINUE →</button>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: "Rajdhani, sans-serif" }}>Payment</h2>
                <div className="bg-[#050e1f] border border-[rgba(245,166,35,0.12)] rounded-sm p-4 mb-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Fare Summary</div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-[#8aa4c8]">From</span><span className="text-[#edeae4]">{selectedPickup?.label}</span></div>
                    <div className="flex justify-between"><span className="text-[#8aa4c8]">To</span><span className="text-[#edeae4]">{selectedDest?.label}</span></div>
                    <div className="flex justify-between"><span className="text-[#8aa4c8]">Vehicle</span><span className="text-[#edeae4]">{selectedVehicle?.label}</span></div>
                    <div className="flex justify-between border-t border-[rgba(245,166,35,0.1)] pt-2 mt-1">
                      <span className="font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>Estimated Fare</span>
                      <span className="font-bold text-[#f5a623] font-mono text-xl">₹{selectedVehicle?.fareNum}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setPayment(m.id)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-sm border text-center transition-all ${payment === m.id ? "border-[#f5a623] bg-[rgba(245,166,35,0.07)]" : "border-[rgba(245,166,35,0.08)] hover:border-[rgba(245,166,35,0.25)] bg-[#050e1f]"}`}>
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-xs font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{m.label}</span>
                      <span className="text-[10px] font-mono text-[#8aa4c8]">{m.sub}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(4)} className="px-5 py-3 border border-[rgba(245,166,35,0.2)] text-[#8aa4c8] font-bold rounded-sm text-sm hover:border-[rgba(245,166,35,0.4)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>← BACK</button>
                  <button onClick={() => setStep(6)} disabled={!payment} className="flex-1 py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm disabled:opacity-40 hover:bg-[#fbb740] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>CONFIRM BOOKING →</button>
                </div>
              </div>
            )}

            {/* STEP 6: CONFIRMED */}
            {step === 6 && (
              <div className="text-center">
                <div className="w-20 h-20 bg-[rgba(56,193,114,0.15)] border-2 border-[#38c172] rounded-full flex items-center justify-center text-4xl mx-auto mb-5">✓</div>
                <h2 className="text-3xl font-bold text-[#38c172] mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>Ride Confirmed!</h2>
                <p className="text-[#8aa4c8] text-sm mb-6">Your SETU vehicle is on the way. Show this token at boarding.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#050e1f] border-2 border-dashed border-[rgba(245,166,35,0.3)] rounded-sm p-5 text-left">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#f5a623] text-center mb-4">BOARDING TOKEN</div>
                    <div className="text-4xl font-bold text-[#f5a623] text-center mb-3" style={{ fontFamily: "Rajdhani, sans-serif" }}>{token}</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-[#8aa4c8]">From</span><span className="text-[#edeae4] text-right truncate ml-2">{selectedPickup?.label}</span></div>
                      <div className="flex justify-between"><span className="text-[#8aa4c8]">To</span><span className="text-[#edeae4] text-right truncate ml-2">{selectedDest?.label}</span></div>
                      <div className="flex justify-between"><span className="text-[#8aa4c8]">Vehicle</span><span className="text-[#edeae4]">{selectedVehicle?.icon} {selectedVehicle?.label}</span></div>
                      <div className="flex justify-between"><span className="text-[#8aa4c8]">ETA</span><span className="font-mono text-[#38c172]">{selectedVehicle?.eta}</span></div>
                      <div className="flex justify-between"><span className="text-[#8aa4c8]">Fare</span><span className="font-mono text-[#f5a623] font-bold">₹{selectedVehicle?.fareNum}</span></div>
                      {needPriority && <div className="pt-1 text-center text-[#f5a623] font-mono text-[10px]">⭐ PRIORITY BOARDING</div>}
                    </div>
                  </div>

                  {/* QR Token */}
                  <div className="bg-[#050e1f] border border-[rgba(245,166,35,0.15)] rounded-sm p-5 flex flex-col items-center justify-center">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Scan at Boarding</div>
                    <div className="p-3 bg-white rounded-sm">
                      <QRCodeSVG value={`SETU:TOKEN:${token}:${selectedPickup?.id}:${selectedDest?.id}`} size={120} bgColor="#ffffff" fgColor="#050e1f" level="M" />
                    </div>
                    <p className="text-[10px] font-mono text-[#8aa4c8] mt-2 text-center">Show to driver or kiosk scanner</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => navigate("/track")} className="flex-1 py-3 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm hover:bg-[#fbb740] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>TRACK MY RIDE →</button>
                  <button onClick={() => navigate("/safety")} className="flex-1 py-3 border border-[rgba(232,67,58,0.35)] text-[#e8433a] font-bold rounded-sm hover:bg-[rgba(232,67,58,0.06)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>🛡️ SAFETY OPTIONS</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
