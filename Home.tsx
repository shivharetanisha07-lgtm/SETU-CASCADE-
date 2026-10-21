import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

const PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1592639296346-560c37a0f711?w=900&h=600&fit=crop&auto=format",
    caption: "Auto-rickshaws on Delhi's Rajpath",
    alt: "Auto rickshaws driving toward Rashtrapati Bhavan, New Delhi",
  },
  {
    url: "https://images.unsplash.com/photo-1745586325699-55c47396b308?w=900&h=600&fit=crop&auto=format",
    caption: "Inside the auto — the city through every ride",
    alt: "View from inside an auto rickshaw looking at the city",
  },
  {
    url: "https://images.unsplash.com/photo-1780324269955-65898a3ef498?w=900&h=600&fit=crop&auto=format",
    caption: "Delhi streets — where every commute begins",
    alt: "Busy Indian street with auto-rickshaws and motorcycles",
  },
  {
    url: "https://images.unsplash.com/photo-1760782064968-9357e20a4a71?w=900&h=600&fit=crop&auto=format",
    caption: "Dusk on the streets — SETU keeps you safe",
    alt: "Busy street scene with rickshaws and pedestrians at dusk",
  },
];

const DELHI_ROUTES = [
  { from: "Rajiv Chowk Metro", to: "Connaught Place", fare: "₹15", time: "4 min", stops: 2 },
  { from: "Kashmere Gate ISBT", to: "Civil Lines", fare: "₹18", time: "6 min", stops: 3 },
  { from: "AIIMS Metro", to: "GK-1 Market", fare: "₹20", time: "7 min", stops: 2 },
  { from: "Dwarka Sec 21 Metro", to: "Dwarka Mor", fare: "₹15", time: "5 min", stops: 2 },
  { from: "Nehru Place Metro", to: "CR Park", fare: "₹18", time: "6 min", stops: 3 },
  { from: "Saket Metro", to: "Malviya Nagar", fare: "₹15", time: "4 min", stops: 1 },
  { from: "Anand Vihar ISBT", to: "Shahdara", fare: "₹20", time: "8 min", stops: 3 },
  { from: "Lajpat Nagar Metro", to: "Andrews Ganj", fare: "₹15", time: "5 min", stops: 2 },
];

const INFOGRAPHIC_STATS = [
  { value: "4.2M", label: "Daily commuters stranded", sub: "after last transit stop in Delhi alone", color: "#e8433a" },
  { value: "₹80", label: "Avg solo auto fare", sub: "2–3 km last mile, often negotiated", color: "#e8433a" },
  { value: "38 min", label: "Avg wait for auto", sub: "peak hours, no booking system", color: "#f5a623" },
  { value: "62%", label: "Auto trips run empty", sub: "drivers return without passengers", color: "#f5a623" },
  { value: "₹20", label: "SETU shared fare", sub: "same distance, 6 passengers", color: "#38c172" },
  { value: "3 min", label: "SETU avg wait", sub: "pre-matched queue system", color: "#38c172" },
];

export default function Home() {
  const navigate = useNavigate();
  const [activePhoto, setActivePhoto] = useState(0);
  const [pickup, setPickup] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setActivePhoto(p => (p + 1) % PHOTOS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const filtered = DELHI_ROUTES;

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Blurred auto background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1592639296346-560c37a0f711?w=1400&h=900&fit=crop&auto=format"
            alt="Auto rickshaws on Delhi streets"
            className="w-full h-full object-cover"
            style={{ filter: "blur(8px) brightness(0.38) saturate(0.65)", transform: "scale(1.06)" }}
          />
        </div>

        {/* Animated ambient orbs */}
        <div className="orb w-[500px] h-[500px] bg-[rgba(245,166,35,0.07)] top-[-100px] left-[-120px]" style={{ animationDuration: "14s" }} />
        <div className="orb w-[350px] h-[350px] bg-[rgba(232,67,58,0.05)] bottom-[80px] right-[-60px]" style={{ animationDuration: "18s", animationDelay: "-6s" }} />
        <div className="orb w-[250px] h-[250px] bg-[rgba(56,193,114,0.04)] top-[40%] left-[40%]" style={{ animationDuration: "22s", animationDelay: "-10s" }} />

        {/* Rotating photo overlay */}
        <div className="absolute inset-0">
          <img
            src={PHOTOS[activePhoto].url}
            alt={PHOTOS[activePhoto].alt}
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: 0.18 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050e1f] via-[rgba(5,14,31,0.82)] to-[rgba(5,14,31,0.35)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050e1f] via-transparent to-transparent" />
        </div>

        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(245,166,35,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(245,166,35,1) 40px)" }} />

        {/* Animated bottom ticker */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-[rgba(245,166,35,0.12)] bg-[rgba(5,14,31,0.85)] backdrop-blur-sm py-2 ticker-wrap overflow-hidden">
          <div className="ticker-inner animate-marquee">
            {[...Array(2)].map((_, rep) => (
              <span key={rep} className="flex items-center">
                {["🛺 Rajiv Chowk → CP  ₹15", "⭐ AIIMS → GK-1  ₹20", "🔐 Women-Only Auto — Safe Night Return", "🚕 SETU Cab — AC Private  ₹40+", "📍 3 min avg wait · Delhi Pilot Active", "🎙️ Zero-app booking — Voice & Kiosk", "💵 Cash · UPI · NCMC · BPL Free"].map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-3 px-6 font-mono text-[11px] text-[#8aa4c8] whitespace-nowrap">
                    <span className="text-[#f5a623]">◆</span>{t}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Photo dots */}
        <div className="absolute bottom-16 left-6 flex gap-2 z-10">
          {PHOTOS.map((_, i) => (
            <button key={i} onClick={() => setActivePhoto(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === activePhoto ? "w-8 bg-[#f5a623]" : "w-2 bg-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.5)]"}`} />
          ))}
        </div>
        <div className="absolute bottom-10 left-6 z-10 animate-fadeIn">
          <span className="text-[10px] font-mono text-[rgba(255,255,255,0.35)] italic">{PHOTOS[activePhoto].caption}</span>
        </div>

        <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center w-full">
          {/* Left — Hero text */}
          <div>
            {/* Live pill */}
            <div className="animate-fadeUp inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[rgba(56,193,114,0.1)] border border-[rgba(56,193,114,0.35)] rounded-sm mb-7">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#38c172] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38c172]" />
              </span>
              <span className="font-mono text-[11px] tracking-widest text-[#38c172] uppercase">Live — Delhi Pilot Active</span>
            </div>

            {/* Eyebrow */}
            <p className="animate-fadeUp delay-100 font-mono text-[11px] tracking-[0.35em] text-[#f5a623] mb-3 uppercase opacity-80">सेतु — The Bridge</p>

            {/* Headline */}
            <h1 className="animate-fadeUp delay-200 leading-none mb-4" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(3.2rem,8.5vw,6.5rem)", fontWeight: 700 }}>
              <span className="hero-gradient-text">Your Last Mile,</span>
              <br />
              <span className="text-shimmer">Bridged.</span>
            </h1>

            {/* Tagline */}
            <div className="animate-fadeUp delay-300 flex items-center gap-3 mb-1">
              <div className="w-10 h-[3px] rounded-full" style={{ background: "linear-gradient(90deg,#f5a623,#ffd580)" }} />
              <p className="text-white text-xl font-semibold tracking-wide" style={{ fontFamily: "Rajdhani, sans-serif", textShadow: "0 0 30px rgba(245,166,35,0.4)" }}>
                "Bridging the Gap, One Ride at a Time."
              </p>
            </div>
            <p className="animate-fadeUp delay-400 font-mono text-[10px] tracking-[0.2em] uppercase mb-7" style={{ color: "rgba(245,166,35,0.55)" }}>
              जो दूरी बाकी है, वो सेतु करेगा
            </p>

            {/* Description */}
            <p className="animate-fadeUp delay-500 text-[#b8cfe8] text-base leading-relaxed mb-8 max-w-lg">
              Smart shared auto-rickshaws, voice kiosks, and zero-app booking — connecting Delhi commuters from every metro exit, bus stop, and railway station to their final destination.
            </p>

            {/* Quick book widget */}
            <div className="animate-fadeUp delay-600 glass-card animate-borderPulse rounded-sm p-5 max-w-md">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#f5a623] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse" />
                Book a Ride Now
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 bg-[rgba(5,14,31,0.8)] border border-[rgba(56,193,114,0.2)] rounded-sm px-3 py-2.5 focus-within:border-[rgba(56,193,114,0.5)] transition-colors">
                  <span className="text-[#38c172] text-base">●</span>
                  <input value={pickup} onChange={e => setPickup(e.target.value)}
                    placeholder="Pickup: metro / bus stop / ISBT"
                    className="flex-1 bg-transparent text-sm text-[#edeae4] placeholder-[#3a5270] outline-none" />
                </div>
                <div className="flex items-center gap-3 bg-[rgba(5,14,31,0.8)] border border-[rgba(245,166,35,0.15)] rounded-sm px-3 py-2.5 focus-within:border-[rgba(245,166,35,0.4)] transition-colors">
                  <span className="text-[#f5a623] text-base">▲</span>
                  <input placeholder="Destination: colony / market / campus"
                    className="flex-1 bg-transparent text-sm text-[#edeae4] placeholder-[#3a5270] outline-none" />
                </div>
              </div>
              <button onClick={() => navigate("/book")}
                className="btn-ripple w-full py-3.5 font-bold rounded-sm hover:brightness-110 active:scale-[0.98] transition-all animate-glow"
                style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", letterSpacing: "0.08em", background: "linear-gradient(135deg, #f5a623 0%, #fbb740 50%, #e8900a 100%)", color: "#050e1f" }}>
                FIND MY SETU RIDE →
              </button>
              <div className="flex items-center justify-between mt-3 text-[10px] text-[#3a5270]">
                <span>No app · Cash OK · Hindi supported</span>
                <Link to="/kiosk" className="text-[#f5a623] hover:text-[#fbb740] transition-colors">🎙️ Voice →</Link>
              </div>
            </div>

            {/* Stats row */}
            <div className="animate-fadeUp delay-700 flex gap-6 mt-7">
              {[
                { val: "₹20", label: "Min fare" },
                { val: "3 min", label: "Avg wait" },
                { val: "8 routes", label: "Delhi" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-bold text-2xl text-[#f5a623]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{s.val}</div>
                  <div className="text-[10px] font-mono text-[#8aa4c8] uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Delhi routes panel */}
          <div className="hidden lg:block animate-slideLeft delay-300">
            <div className="glass-card rounded-sm overflow-hidden" style={{ boxShadow: "0 0 40px rgba(245,166,35,0.06), 0 20px 60px rgba(0,0,0,0.5)" }}>
              <div className="px-5 py-3 border-b border-[rgba(245,166,35,0.12)] flex items-center justify-between bg-[rgba(245,166,35,0.04)]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#f5a623]">Delhi Routes — Live</span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#38c172]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#38c172] opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#38c172]" />
                  </span>
                  ACTIVE
                </span>
              </div>
              {DELHI_ROUTES.slice(0, 6).map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-[rgba(245,166,35,0.06)] hover:bg-[rgba(245,166,35,0.05)] transition-all group"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#38c172] group-hover:scale-125 transition-transform" />
                    <div className="w-px h-5 bg-gradient-to-b from-[rgba(56,193,114,0.4)] to-[rgba(245,166,35,0.4)]" />
                    <div className="w-2 h-2 rounded-full bg-[#f5a623] group-hover:scale-125 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate group-hover:text-[#f5a623] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>{r.from}</div>
                    <div className="text-xs text-[#6b8ab0] truncate">→ {r.to}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-sm font-bold text-[#f5a623]">{r.fare}</div>
                    <div className="text-[10px] font-mono text-[#6b8ab0]">{r.time}</div>
                  </div>
                  <Link to="/book"
                    className="px-3 py-1 border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-[10px] font-mono rounded-sm hover:bg-[#f5a623] hover:text-[#050e1f] transition-all flex-shrink-0">
                    BOOK
                  </Link>
                </div>
              ))}
              <div className="px-5 py-3 text-center bg-[rgba(245,166,35,0.02)]">
                <Link to="/book" className="text-[11px] font-mono text-[#f5a623] hover:text-[#fbb740] transition-colors">View all 8 routes →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHOTO GALLERY ────────────────────────────────────── */}
      <section className="py-0 border-t border-[rgba(245,166,35,0.1)]">
        <div className="grid grid-cols-2 md:grid-cols-4 h-64">
          {[
            { url: "https://images.unsplash.com/photo-1519687335474-c85fb3a50ca3?w=400&h=320&fit=crop&auto=format", caption: "Every ride, a story" },
            { url: "https://images.unsplash.com/photo-1767184113099-788861878a1c?w=400&h=320&fit=crop&auto=format", caption: "Auto on Delhi streets" },
            { url: "https://images.unsplash.com/photo-1743501940963-fc2ccb7455b6?w=400&h=320&fit=crop&auto=format", caption: "The morning commute" },
            { url: "https://images.unsplash.com/photo-1760791963527-d170b4cf26ea?w=400&h=320&fit=crop&auto=format", caption: "Night routes — safe with SETU" },
          ].map((p, i) => (
            <div key={i} className="relative overflow-hidden group">
              <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: "#0c1d38" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,14,31,0.8)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs text-[#edeae4] font-mono">{p.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── INFOGRAPHIC STRIP ─────────────────────────────────── */}
      <section className="py-16 border-t border-b border-[rgba(245,166,35,0.1)] bg-[#030b17]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#f5a623]">THE PROBLEM</span>
            <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#38c172]">THE SETU SOLUTION</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[rgba(245,166,35,0.08)]">
            {INFOGRAPHIC_STATS.map((s, i) => (
              <div key={i} className="bg-[#030b17] px-5 py-6 text-center relative">
                {i === 3 && <div className="absolute right-0 top-4 bottom-4 w-px bg-[rgba(245,166,35,0.2)]" />}
                <div className="text-[2.2rem] font-bold mb-1 leading-none" style={{ fontFamily: "Rajdhani, sans-serif", color: s.color }}>{s.value}</div>
                <div className="text-xs font-semibold text-[#edeae4] mb-1">{s.label}</div>
                <div className="text-[10px] text-[#8aa4c8] leading-snug">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-xs text-[#8aa4c8]"><span className="w-3 h-3 rounded-sm bg-[rgba(232,67,58,0.5)]" /> Problem (Delhi NCR, 2024 estimates)</div>
            <div className="flex items-center gap-2 text-xs text-[#8aa4c8]"><span className="w-3 h-3 rounded-sm bg-[rgba(56,193,114,0.5)]" /> SETU pilot projection</div>
          </div>
        </div>
      </section>

      {/* ─── DELHI ROUTES FULL ──────────────────────────────── */}
      <section className="py-20 border-b border-[rgba(245,166,35,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#f5a623]">DELHI PILOT</span>
            <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-4" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                Delhi Last-Mile Routes
              </h2>
              <p className="text-[#8aa4c8] text-sm leading-relaxed mb-6">
                SETU connects every major metro station, ISBT, and railway terminus to the surrounding residential colonies, markets, and campuses — at flat, shared fares. No negotiation. No waiting.
              </p>
              <div className="relative pl-4 border-l-2 border-[rgba(245,166,35,0.2)] space-y-0">
                {/* Delhi Metro map infographic */}
                <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-4">Delhi SETU Coverage Map</div>
                  <svg viewBox="0 0 400 280" className="w-full">
                    {/* Background */}
                    <rect width="400" height="280" fill="#050e1f" rx="4" />
                    {/* Grid */}
                    {[0,1,2,3,4,5,6].map(i => <line key={`hg${i}`} x1="0" y1={i*40} x2="400" y2={i*40} stroke="rgba(245,166,35,0.04)" strokeWidth="1"/>)}
                    {[0,1,2,3,4,5,6,7,8,9,10].map(i => <line key={`vg${i}`} x1={i*40} y1="0" x2={i*40} y2="280" stroke="rgba(245,166,35,0.04)" strokeWidth="1"/>)}
                    {/* Yellow Line */}
                    <line x1="40" y1="40" x2="360" y2="40" stroke="rgba(245,166,35,0.6)" strokeWidth="3"/>
                    {/* Blue Line */}
                    <line x1="40" y1="140" x2="360" y2="140" stroke="rgba(138,164,200,0.6)" strokeWidth="3"/>
                    {/* Pink Line */}
                    <line x1="200" y1="20" x2="200" y2="260" stroke="rgba(232,67,58,0.5)" strokeWidth="3"/>
                    {/* Green Line */}
                    <line x1="40" y1="200" x2="200" y2="200" stroke="rgba(56,193,114,0.5)" strokeWidth="2.5"/>
                    {/* Route coverage circles */}
                    {[
                      {x:80, y:140, label:"Rajiv Chowk", route:"→ CP · Janpath"},
                      {x:200, y:140, label:"Kashmere Gate", route:"→ Civil Lines"},
                      {x:320, y:140, label:"Anand Vihar", route:"→ Shahdara"},
                      {x:80, y:200, label:"Dwarka Sec 21", route:"→ Dwarka Mor"},
                      {x:200, y:200, label:"AIIMS Metro", route:"→ GK-1"},
                      {x:320, y:40, label:"Nehru Place", route:"→ CR Park"},
                    ].map((n, i) => (
                      <g key={i}>
                        <circle cx={n.x} cy={n.y} r="18" fill="rgba(245,166,35,0.08)" stroke="rgba(245,166,35,0.35)" strokeWidth="1.5"/>
                        <circle cx={n.x} cy={n.y} r="5" fill="#f5a623"/>
                        <text x={n.x} y={n.y - 24} textAnchor="middle" fontSize="7.5" fill="#edeae4" fontFamily="Rajdhani">{n.label}</text>
                        <text x={n.x} y={n.y - 14} textAnchor="middle" fontSize="6.5" fill="rgba(138,164,200,0.8)" fontFamily="JetBrains Mono">{n.route}</text>
                      </g>
                    ))}
                    {/* Legend */}
                    <rect x="10" y="250" width="8" height="4" fill="rgba(245,166,35,0.6)" rx="1"/>
                    <text x="22" y="256" fontSize="7" fill="rgba(138,164,200,0.7)" fontFamily="JetBrains Mono">Yellow Line</text>
                    <rect x="90" y="250" width="8" height="4" fill="rgba(138,164,200,0.6)" rx="1"/>
                    <text x="102" y="256" fontSize="7" fill="rgba(138,164,200,0.7)" fontFamily="JetBrains Mono">Blue Line</text>
                    <rect x="165" y="250" width="8" height="4" fill="rgba(232,67,58,0.5)" rx="1"/>
                    <text x="177" y="256" fontSize="7" fill="rgba(138,164,200,0.7)" fontFamily="JetBrains Mono">Pink Line</text>
                    <circle cx="249" cy="253" r="4" fill="rgba(245,166,35,0.1)" stroke="rgba(245,166,35,0.4)" strokeWidth="1"/>
                    <text x="257" y="256" fontSize="7" fill="rgba(138,164,200,0.7)" fontFamily="JetBrains Mono">SETU Hub</text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {DELHI_ROUTES.map((r, i) => (
                <div key={i} className="flex items-center gap-4 bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] rounded-sm px-4 py-3.5 hover:border-[rgba(245,166,35,0.28)] group transition-colors">
                  <div className="flex-shrink-0 w-6 h-6 bg-[rgba(245,166,35,0.1)] rounded-sm flex items-center justify-center font-mono text-[10px] text-[#f5a623]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#edeae4] truncate" style={{ fontFamily: "Rajdhani, sans-serif" }}>{r.from}</span>
                      <span className="text-[#8aa4c8] text-xs flex-shrink-0">→</span>
                      <span className="text-sm text-[#8aa4c8] truncate">{r.to}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-mono text-[#38c172]">{r.time}</span>
                      <span className="text-[10px] font-mono text-[#8aa4c8]">{r.stops} stops</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-mono font-bold text-[#f5a623]">{r.fare}</span>
                    <Link to="/book"
                      className="px-3 py-1 bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] text-[#f5a623] text-[11px] font-bold rounded-sm hover:bg-[rgba(245,166,35,0.18)] transition-colors group-hover:border-[rgba(245,166,35,0.5)]"
                      style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      BOOK
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS INFOGRAPHIC ──────────────────────── */}
      <section className="py-20 border-b border-[rgba(245,166,35,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#f5a623]">DELHI NCR ROUTES</span>
            <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-12 text-center" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            From Metro Exit to Your Door — in 4 Steps
          </h2>

          {/* Infographic flow */}
          <div className="relative">
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[rgba(245,166,35,0.3)] to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { num: "01", icon: "🚇", step: "Alight at Transit Stop", desc: "Bus / Metro / Railway · Walk 30–50m to the nearest SETU kiosk point", color: "#38c172", img: "https://images.unsplash.com/photo-1558280225-f6d577215119?w=300&h=180&fit=crop&auto=format" },
                { num: "02", icon: "⬡", step: "Book at Smart Kiosk", desc: "Voice / QR / Cash · Select destination in Hindi. Token printed in 15 seconds.", color: "#f5a623", img: "https://images.unsplash.com/photo-1534406516536-c34a9683e490?w=300&h=180&fit=crop&auto=format" },
                { num: "03", icon: "🔗", step: "Get Matched & Board", desc: "3–5 min wait · Shared with passengers heading same way. Priority boarding for elderly.", color: "#f5a623", img: "https://images.unsplash.com/photo-1519687335474-c85fb3a50ca3?w=300&h=180&fit=crop&auto=format" },
                { num: "04", icon: "📍", step: "Reach Your Destination", desc: "₹15–25 flat fare · GPS-tracked, safe drop. Live tracking shared to family.", color: "#38c172", img: "https://images.unsplash.com/photo-1571893652827-a3e071ab463b?w=300&h=180&fit=crop&auto=format" },
              ].map((s, i) => (
                <div key={i} className="relative">
                  <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.1)] rounded-sm overflow-hidden hover:border-[rgba(245,166,35,0.3)] transition-colors">
                    <div className="relative h-36 overflow-hidden">
                      <img src={s.img} alt={s.step} className="w-full h-full object-cover" style={{ backgroundColor: "#0c1d38" }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1d38] via-[rgba(12,29,56,0.3)] to-transparent" />
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-sm flex items-center justify-center font-bold text-sm"
                        style={{ background: s.color, color: "#050e1f", fontFamily: "Rajdhani, sans-serif" }}>{s.num}</div>
                      <div className="absolute bottom-2 right-3 text-2xl">{s.icon}</div>
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-[#edeae4] mb-1.5" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>{s.step}</div>
                      <p className="text-xs text-[#8aa4c8] leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── VEHICLE TYPES PREVIEW ─────────────────────────── */}
      <section className="py-20 border-b border-[rgba(245,166,35,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#f5a623]">FLEET</span>
            <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
            <Link to="/vehicles" className="font-mono text-[11px] text-[#f5a623] hover:underline">View all →</Link>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-8" style={{ fontFamily: "Rajdhani, sans-serif" }}>Choose Your Ride</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🛺", name: "Shared Auto", fare: "₹15–25", badge: "Most Popular", desc: "6-seater e-rickshaw. Shared, affordable, daily commute.", img: "https://images.unsplash.com/photo-1564291886459-a39ad7415125?w=400&h=220&fit=crop&auto=format", badgeColor: "#38c172" },
              { icon: "⭐", name: "Priority Auto", fare: "₹25–35", badge: "Accessible", desc: "Priority boarding. Reserved padded seat. Elderly-first.", img: "https://images.unsplash.com/photo-1624858020896-4a558c5d7042?w=400&h=220&fit=crop&auto=format", badgeColor: "#f5a623" },
              { icon: "🔐", name: "Women-Only", fare: "₹25–30", badge: "Safe Choice", desc: "Female driver. All-women cabin. Safe Night Return.", img: "https://images.unsplash.com/photo-1760791963527-d170b4cf26ea?w=400&h=220&fit=crop&auto=format", badgeColor: "#8aa4c8" },
              { icon: "🚕", name: "SETU Cab", fare: "₹40–70", badge: "AC · Private", desc: "Private CNG cab. Solo or 3 passengers. AC. No sharing.", img: "https://images.unsplash.com/photo-1570168305673-42708ac64073?w=400&h=220&fit=crop&auto=format", badgeColor: "#f5a623" },
            ].map(v => (
              <div key={v.name} className="bg-[#0c1d38] border border-[rgba(245,166,35,0.1)] rounded-sm overflow-hidden hover:border-[rgba(245,166,35,0.3)] transition-all group">
                <div className="relative h-36 overflow-hidden">
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: "#0c1d38" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1d38] via-transparent to-transparent" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-mono border rounded-sm" style={{ color: v.badgeColor, borderColor: `${v.badgeColor}50`, backgroundColor: `${v.badgeColor}15` }}>{v.badge}</span>
                  <span className="absolute bottom-2 left-3 text-xl">{v.icon}</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.05rem" }}>{v.name}</span>
                    <span className="font-mono text-[#f5a623] font-bold text-sm">{v.fare}</span>
                  </div>
                  <p className="text-xs text-[#8aa4c8] mb-3">{v.desc}</p>
                  <Link to="/book" className="block w-full py-2 text-center text-xs font-bold border border-[rgba(245,166,35,0.2)] text-[#f5a623] rounded-sm hover:bg-[rgba(245,166,35,0.08)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    BOOK NOW →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Delhi Metro schematic */}
          <div className="mt-10 bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-5">Delhi Metro Network — SETU Pickup Points</div>
            <div className="overflow-x-auto">
              <svg viewBox="0 0 700 320" className="w-full" style={{ minWidth: "500px", maxHeight: "320px" }}>
                {/* Background */}
                <rect width="700" height="320" fill="#050e1f" rx="4" />
                {/* Grid */}
                {[80, 160, 240].map(y => <line key={y} x1="20" y1={y} x2="680" y2={y} stroke="rgba(245,166,35,0.04)" strokeWidth="1" />)}
                {[100, 200, 300, 400, 500, 600].map(x => <line key={x} x1={x} y1="20" x2={x} y2="300" stroke="rgba(245,166,35,0.04)" strokeWidth="1" />)}

                {/* Yellow Line */}
                <polyline points="100,60 200,60 300,100 400,130 500,130 600,130" fill="none" stroke="#f5c842" strokeWidth="5" strokeLinecap="round" />
                {/* Blue Line */}
                <polyline points="60,160 150,160 250,160 350,160 450,160 600,160" fill="none" stroke="#4a90d9" strokeWidth="5" strokeLinecap="round" />
                {/* Red Line */}
                <polyline points="100,200 200,180 350,160 450,140 550,110" fill="none" stroke="#e8433a" strokeWidth="5" strokeLinecap="round" />
                {/* Pink Line */}
                <polyline points="80,80 150,120 250,200 350,240 450,260 550,250" fill="none" stroke="#e87ab2" strokeWidth="4" strokeLinecap="round" />
                {/* Green Line */}
                <polyline points="150,100 200,140 250,160" fill="none" stroke="#38c172" strokeWidth="4" strokeLinecap="round" />
                {/* Violet Line */}
                <polyline points="350,160 400,200 450,240 520,270" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />

                {/* Key stations with SETU kiosk icons */}
                {[
                  { x: 350, y: 160, name: "Rajiv Chowk", key: true },
                  { x: 100, y: 60, name: "Samaypur Badli", key: false },
                  { x: 600, y: 130, name: "HUDA City Centre", key: false },
                  { x: 600, y: 160, name: "Noida Elec. City", key: false },
                  { x: 60, y: 160, name: "Dwarka Sec 21", key: false },
                  { x: 550, y: 110, name: "Dilshad Garden", key: false },
                  { x: 550, y: 250, name: "Airport T3", key: false },
                  { x: 520, y: 270, name: "Badarpur", key: false },
                  { x: 250, y: 160, name: "Karol Bagh", key: true },
                  { x: 450, y: 160, name: "Yamuna Bank", key: false },
                ].map(s => (
                  <g key={s.name}>
                    <circle cx={s.x} cy={s.y} r={s.key ? 8 : 5} fill={s.key ? "#f5a623" : "#1a3259"} stroke={s.key ? "#f5a623" : "rgba(245,166,35,0.3)"} strokeWidth="2" />
                    {s.key && <circle cx={s.x} cy={s.y} r="13" fill="none" stroke="rgba(245,166,35,0.25)" strokeWidth="1" />}
                    <text x={s.x} y={s.y - 11} textAnchor="middle" fontSize="8" fill={s.key ? "#f5a623" : "rgba(238,234,228,0.5)"} fontFamily="JetBrains Mono">
                      {s.name.length > 14 ? s.name.slice(0, 13) + "…" : s.name}
                    </text>
                  </g>
                ))}

                {/* Legend */}
                {[
                  { color: "#f5c842", label: "Yellow Line" },
                  { color: "#4a90d9", label: "Blue Line" },
                  { color: "#e8433a", label: "Red Line" },
                  { color: "#e87ab2", label: "Pink Line" },
                  { color: "#38c172", label: "Green Line" },
                  { color: "#8b5cf6", label: "Violet Line" },
                ].map((l, i) => (
                  <g key={l.label} transform={`translate(20, ${i * 18 + 185})`}>
                    <rect width="20" height="4" fill={l.color} rx="2" y="2" />
                    <text x="26" y="8" fontSize="9" fill="rgba(238,234,228,0.7)" fontFamily="JetBrains Mono">{l.label}</text>
                  </g>
                ))}
                <text x="20" y="175" fontSize="9" fill="rgba(245,166,35,0.5)" fontFamily="JetBrains Mono">● = SETU Kiosk</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COST INFOGRAPHIC ──────────────────────────────── */}
      <section className="py-20 border-b border-[rgba(245,166,35,0.1)] bg-[#030b17]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#f5a623]">WHY SETU</span>
            <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-5" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                Save ₹60 Every Day.<br /><span className="text-[#f5a623]">₹1,500 Every Month.</span>
              </h2>
              <p className="text-[#8aa4c8] text-sm leading-relaxed mb-6">
                The average Delhi commuter spends ₹80–120 on last-mile auto-rickshaws daily. SETU's shared model brings that down to ₹20–30 — without compromising on safety or convenience.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Solo auto (2–3 km)", amount: 80, max: 100, color: "#e8433a" },
                  { label: "Ola/Uber (same distance)", amount: 120, max: 100, color: "#e8433a" },
                  { label: "SETU Shared Auto", amount: 20, max: 100, color: "#38c172" },
                  { label: "SETU Daily Pass", amount: 30, max: 100, color: "#38c172" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#8aa4c8]">{item.label}</span>
                      <span className="font-mono font-bold" style={{ color: item.color }}>₹{item.amount}</span>
                    </div>
                    <div className="h-2 bg-[#0c1d38] rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm transition-all" style={{ width: `${Math.min((item.amount / 120) * 100, 100)}%`, backgroundColor: item.color, opacity: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart infographic */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-6">Fare Comparison — 3 km trip in Delhi</div>
            <div className="space-y-4">
              {[
                { label: "Solo Auto (negotiated)", fare: 100, pct: 100, color: "#e8433a" },
                { label: "Ola/Uber (surge off)", fare: 120, pct: 120, color: "#8aa4c8" },
                { label: "Bike Taxi", fare: 60, pct: 60, color: "#8aa4c8" },
                { label: "SETU Shared Ride", fare: 20, pct: 20, color: "#f5a623" },
                { label: "SETU Daily Pass (per trip)", fare: 12, pct: 12, color: "#38c172" },
              ].map(bar => (
                <div key={bar.label} className="flex items-center gap-4">
                  <div className="w-44 text-xs text-[#8aa4c8] text-right flex-shrink-0">{bar.label}</div>
                  <div className="flex-1 h-8 bg-[#050e1f] rounded-sm overflow-hidden">
                    <div className="h-full rounded-sm flex items-center pl-3 transition-all"
                      style={{ width: `${bar.pct}%`, backgroundColor: bar.color, minWidth: "40px" }}>
                      <span className="font-mono font-bold text-sm" style={{ color: bar.color === "#f5a623" || bar.color === "#38c172" ? "#050e1f" : "#fff" }}>
                        ₹{bar.fare}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "💰", title: "60–75% cheaper", desc: "vs solo auto or app cab for same last-mile distance" },
                { icon: "⚡", title: "100% electric", desc: "Zero tailpipe emissions. Solar-charged at hubs." },
                { icon: "📵", title: "No app needed", desc: "Cash, voice, WhatsApp, IVRS — all work" },
                { icon: "🛡️", title: "Safety built-in", desc: "CCTV, SOS, GPS, verified drivers, beacon corridors" },
              ].map(item => (
                <div key={item.title} className="bg-[#0c1d38] border border-[rgba(245,166,35,0.1)] rounded-sm p-5 hover:border-[rgba(245,166,35,0.28)] transition-colors">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-bold text-[#edeae4] mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>{item.title}</div>
                  <p className="text-xs text-[#8aa4c8] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-sm overflow-hidden border border-[rgba(245,166,35,0.2)]">
            <img src="https://images.unsplash.com/photo-1592639296346-560c37a0f711?w=1400&h=400&fit=crop&auto=format"
              alt="Delhi auto rickshaws" className="absolute inset-0 w-full h-full object-cover opacity-20" style={{ backgroundColor: "#0c1d38" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c1d38] to-[rgba(12,29,56,0.7)]" />
            <div className="relative px-8 sm:px-16 py-16 text-center">
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                Bridge Your Last Mile with <span className="text-[#f5a623]">SETU</span>
              </h2>
              <p className="text-[#8aa4c8] mb-8 max-w-md mx-auto text-sm">"Jo doori baaki hai, woh SETU karega"</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/book" className="px-8 py-3.5 bg-[#f5a623] text-[#050e1f] font-bold rounded-sm hover:bg-[#fbb740] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>
                  BOOK A RIDE
                </Link>
                <Link to="/kiosk" className="px-8 py-3.5 border border-[rgba(245,166,35,0.4)] text-[#f5a623] font-bold rounded-sm hover:bg-[rgba(245,166,35,0.08)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>
                  TRY KIOSK
                </Link>
                <Link to="/track" className="px-8 py-3.5 border border-[rgba(138,164,200,0.3)] text-[#8aa4c8] font-bold rounded-sm hover:bg-[rgba(138,164,200,0.05)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>
                  TRACK RIDE
                </Link>
                <Link to="/kiosk" className="px-8 py-3 border border-[rgba(138,164,200,0.3)] text-[#8aa4c8] font-bold rounded-sm hover:bg-[rgba(138,164,200,0.06)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem" }}>
                  TRY KIOSK
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
