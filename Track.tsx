import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { QRCodeSVG } from "qrcode.react";

const ROUTE_STOPS = [
  { name: "Rajiv Chowk Metro Exit 5", type: "pickup", done: true, time: "6:42 PM", dist: "0 km" },
  { name: "Barakhamba Road", type: "waypoint", done: true, time: "6:45 PM", dist: "0.8 km" },
  { name: "Minto Road Junction", type: "waypoint", done: false, time: "6:48 PM est", dist: "1.4 km" },
  { name: "Janpath Market Drop", type: "drop_other", done: false, time: "6:51 PM est", dist: "1.9 km" },
  { name: "Connaught Place Inner Circle", type: "drop_you", done: false, time: "6:54 PM est", dist: "2.3 km" },
];

const TELEMETRY = [
  { label: "Speed", value: "22 km/h", icon: "⚡", unit: "" },
  { label: "Battery", value: "78%", icon: "🔋", unit: "" },
  { label: "Distance", value: "1.4 km", icon: "📏", unit: "covered" },
  { label: "Remaining", value: "0.9 km", icon: "🗺️", unit: "to your stop" },
];

export default function Track() {
  const [eta, setEta] = useState(12);
  const [vehiclePos, setVehiclePos] = useState(20);
  const [speed, setSpeed] = useState(22);
  const [battery, setBattery] = useState(78);
  const [sosActive, setSosActive] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"map" | "telemetry" | "driver" | "safety">("map");
  const [sosTimer, setSosTimer] = useState(0);
  const pulseRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      setEta(e => Math.max(0, e - 1));
      setVehiclePos(p => Math.min(92, p + 3.5));
      setSpeed(22 + Math.floor(Math.random() * 5 - 2));
      setBattery(b => Math.max(70, b - 0.1));
      pulseRef.current = (pulseRef.current + 1) % 10;
    }, 3000);
    return () => clearInterval(t);
  }, []);

  function handleSOS() {
    setSosActive(true);
    setSosTimer(5);
    const t = setInterval(() => setSosTimer(c => {
      if (c <= 1) { clearInterval(t); return 0; }
      return c - 1;
    }), 1000);
    setTimeout(() => setSosActive(false), 8000);
  }

  function shareLocation() {
    setLocationShared(true);
    setShareMsg("Live location sent to your emergency contact via WhatsApp");
    setTimeout(() => setShareMsg(""), 4000);
  }

  // SVG route coordinates (Delhi-themed)
  const stops = [
    { x: 50, y: 240, label: "Rajiv Chowk Metro", done: true },
    { x: 140, y: 195, label: "Barakhamba Rd", done: true },
    { x: 230, y: 155, label: "Minto Road", done: false },
    { x: 320, y: 115, label: "Janpath", done: false },
    { x: 420, y: 75, label: "CP Inner Circle", done: false },
  ];
  const vx = 50 + (vehiclePos / 100) * (420 - 50);
  const vy = 240 - (vehiclePos / 100) * (240 - 75);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#f5a623]">LIVE TRACKING</span>
          <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
          <div className="flex items-center gap-2 px-3 py-1 bg-[rgba(56,193,114,0.08)] border border-[rgba(56,193,114,0.25)] rounded-sm">
            <span className="w-2 h-2 rounded-full bg-[#38c172] animate-pulse" />
            <span className="font-mono text-[11px] text-[#38c172]">GPS ACTIVE</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif" }}>Track Your Ride</h1>
        <p className="text-xs text-[#8aa4c8] mt-1">Vehicle AP 07 SU-03 · Rajiv Chowk → Connaught Place</p>
      </div>

      {sosActive && (
        <div className="mb-6 p-5 bg-[rgba(232,67,58,0.12)] border-2 border-[#e8433a] rounded-sm text-center">
          <div className="text-[#e8433a] font-bold text-xl mb-1 animate-pulse" style={{ fontFamily: "Rajdhani, sans-serif" }}>🚨 SOS ALERT SENT — Help is coming</div>
          <p className="text-sm text-[#e8433a]">Delhi Police PCR + SETU Control Centre notified · Your live GPS location is shared</p>
          <p className="text-xs text-[#8aa4c8] mt-1">Response expected in under 90 seconds · PCR: 100 · Toll-free: 1800-SETU-00</p>
        </div>
      )}
      {shareMsg && (
        <div className="mb-4 p-3 bg-[rgba(56,193,114,0.08)] border border-[rgba(56,193,114,0.25)] rounded-sm text-center text-sm text-[#38c172]">✓ {shareMsg}</div>
      )}

      {/* ETA + telemetry top strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.1)] mb-6">
        <div className="bg-[#050e1f] px-5 py-4 text-center sm:col-span-1">
          <div className="text-[3rem] font-bold text-[#f5a623] leading-none" style={{ fontFamily: "Rajdhani, sans-serif" }}>{eta}</div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8aa4c8]">min ETA</div>
        </div>
        {[
          { label: "Speed", val: `${speed} km/h`, color: "#edeae4" },
          { label: "Battery", val: `${Math.floor(battery)}%`, color: battery > 50 ? "#38c172" : "#f5a623" },
          { label: "Fare", val: "₹20", color: "#f5a623" },
          { label: "Status", val: "On Time", color: "#38c172" },
        ].map(s => (
          <div key={s.label} className="bg-[#050e1f] px-4 py-4 text-center">
            <div className="text-xl font-bold leading-none mb-1" style={{ fontFamily: "Rajdhani, sans-serif", color: s.color }}>{s.val}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#8aa4c8]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#0c1d38] p-1 rounded-sm border border-[rgba(245,166,35,0.1)]">
        {(["map", "telemetry", "driver", "safety"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold rounded-sm transition-all capitalize ${activeTab === tab ? "bg-[#f5a623] text-[#050e1f]" : "text-[#8aa4c8] hover:text-[#edeae4]"}`}
            style={{ fontFamily: "Rajdhani, sans-serif" }}>
            {tab === "map" ? "🗺️ Map" : tab === "telemetry" ? "📡 Telemetry" : tab === "driver" ? "👨‍✈️ Driver" : "🛡️ Safety"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-5">

          {/* MAP TAB */}
          {activeTab === "map" && (
            <>
              <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.15)] rounded-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8]">Delhi Route Map</div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#38c172]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38c172] animate-pulse" /> LIVE
                  </div>
                </div>
                <div className="relative bg-[#050e1f] rounded-sm overflow-hidden" style={{ height: "320px" }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="xMidYMid meet">
                    {/* Grid */}
                    {Array.from({ length: 8 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="500" y2={i * 40} stroke="rgba(245,166,35,0.04)" strokeWidth="1" />)}
                    {Array.from({ length: 13 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="rgba(245,166,35,0.04)" strokeWidth="1" />)}

                    {/* Road background */}
                    <path d="M 50 240 L 140 195 L 230 155 L 320 115 L 420 75" fill="none" stroke="rgba(40,60,100,0.8)" strokeWidth="14" strokeLinecap="round" />
                    {/* Road center line */}
                    <path d="M 50 240 L 140 195 L 230 155 L 320 115 L 420 75" fill="none" stroke="rgba(60,80,120,0.6)" strokeWidth="10" strokeLinecap="round" strokeDasharray="12 8" />

                    {/* Completed route */}
                    <path d="M 50 240 L 140 195" fill="none" stroke="#38c172" strokeWidth="4" strokeLinecap="round" />
                    {/* Remaining route */}
                    <path d="M 140 195 L 230 155 L 320 115 L 420 75" fill="none" stroke="rgba(245,166,35,0.35)" strokeWidth="3" strokeDasharray="8 5" strokeLinecap="round" />

                    {/* Destination pulse rings */}
                    <circle cx="420" cy="75" r="20" fill="none" stroke="rgba(245,166,35,0.2)" strokeWidth="1.5">
                      <animate attributeName="r" from="12" to="28" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>

                    {/* Stop markers */}
                    {stops.map((s, i) => (
                      <g key={i}>
                        <circle cx={s.x} cy={s.y} r="8" fill={s.done ? "#38c172" : i === stops.length - 1 ? "#f5a623" : "#1a3259"} stroke={s.done ? "#38c172" : i === stops.length - 1 ? "#f5a623" : "rgba(245,166,35,0.35)"} strokeWidth="2" />
                        <text x={s.x + (i % 2 === 0 ? -4 : 4)} y={s.y - 14} textAnchor={i % 2 === 0 ? "end" : "start"} fontSize="8.5" fill="rgba(238,234,228,0.75)" fontFamily="Rajdhani">{s.label}</text>
                        {i === stops.length - 1 && <text x={s.x} y={s.y + 22} textAnchor="middle" fontSize="8" fill="#f5a623" fontFamily="JetBrains Mono">YOUR STOP ▼</text>}
                      </g>
                    ))}

                    {/* Vehicle dot */}
                    <circle cx={vx} cy={vy} r="11" fill="#f5a623" />
                    <circle cx={vx} cy={vy} r="18" fill="none" stroke="rgba(245,166,35,0.35)" strokeWidth="2">
                      <animate attributeName="r" from="11" to="24" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <text x={vx} y={vy + 4} textAnchor="middle" fontSize="9" fill="#050e1f" fontWeight="bold" fontFamily="Rajdhani">🛺</text>

                    {/* Speed readout */}
                    <rect x={vx - 20} y={vy - 34} width="40" height="14" rx="2" fill="rgba(5,14,31,0.85)" />
                    <text x={vx} y={vy - 24} textAnchor="middle" fontSize="8" fill="#f5a623" fontFamily="JetBrains Mono">{speed}km/h</text>

                    {/* District labels */}
                    <text x="60" y="275" fontSize="8" fill="rgba(138,164,200,0.4)" fontFamily="JetBrains Mono">CENTRAL DELHI</text>
                    <text x="300" y="55" fontSize="8" fill="rgba(138,164,200,0.4)" fontFamily="JetBrains Mono">CP ZONE</text>
                  </svg>
                </div>

                {/* Map legend */}
                <div className="flex flex-wrap gap-4 mt-3 text-[10px] font-mono text-[#8aa4c8]">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#38c172] rounded" /> Completed</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[rgba(245,166,35,0.4)] rounded border border-dashed border-[rgba(245,166,35,0.5)]" /> Remaining</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#f5a623]" /> Vehicle (live)</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border-2 border-[#f5a623] bg-transparent" /> Your stop</div>
                </div>
              </div>

              {/* Route stops timeline */}
              <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-4">Route Timeline</div>
                <div className="space-y-0">
                  {ROUTE_STOPS.map((stop, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${stop.done ? "bg-[#38c172] text-white" : stop.type === "drop_you" ? "bg-[rgba(245,166,35,0.2)] border-2 border-[#f5a623] text-[#f5a623]" : "bg-[#1a3259] text-[#8aa4c8]"}`}
                          style={{ fontFamily: "Rajdhani, sans-serif" }}>
                          {stop.done ? "✓" : stop.type === "drop_you" ? "★" : i + 1}
                        </div>
                        {i < ROUTE_STOPS.length - 1 && (
                          <div className={`w-px my-1 ${stop.done ? "bg-[#38c172]" : "bg-[rgba(245,166,35,0.12)]"}`} style={{ height: "28px" }} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <span className={`text-sm font-semibold ${stop.type === "drop_you" ? "text-[#f5a623]" : stop.done ? "text-[#38c172]" : "text-[#edeae4]"}`}
                            style={{ fontFamily: "Rajdhani, sans-serif" }}>
                            {stop.name} {stop.type === "drop_you" && "← Your Stop"}
                          </span>
                          <div className="text-right ml-2 flex-shrink-0">
                            <div className="font-mono text-[10px] text-[#8aa4c8]">{stop.time}</div>
                            <div className="font-mono text-[9px] text-[#3a5270]">{stop.dist}</div>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-[#8aa4c8] mt-0.5">
                          {stop.type === "pickup" ? "Boarding point" : stop.type === "drop_you" ? "Your destination" : stop.type === "drop_other" ? "Other passenger drop" : "En route checkpoint"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TELEMETRY TAB */}
          {activeTab === "telemetry" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Vehicle Speed", value: `${speed} km/h`, icon: "⚡", max: 25, current: speed, unit: "/ 25 max", color: "#f5a623" },
                  { label: "Battery Level", value: `${Math.floor(battery)}%`, icon: "🔋", max: 100, current: Math.floor(battery), unit: "remaining", color: battery > 50 ? "#38c172" : "#f5a623" },
                  { label: "GPS Accuracy", value: "±3 m", icon: "📡", max: 100, current: 97, unit: "97% accuracy", color: "#38c172" },
                  { label: "Seat Occupancy", value: "4 / 6", icon: "💺", max: 6, current: 4, unit: "seats filled", color: "#8aa4c8" },
                ].map(t => (
                  <div key={t.label} className="bg-[#0c1d38] border border-[rgba(245,166,35,0.1)] rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{t.icon}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8]">{t.label}</span>
                    </div>
                    <div className="text-2xl font-bold mb-2" style={{ fontFamily: "Rajdhani, sans-serif", color: t.color }}>{t.value}</div>
                    <div className="h-2 bg-[#050e1f] rounded-sm overflow-hidden mb-1">
                      <div className="h-full rounded-sm transition-all duration-1000" style={{ width: `${(t.current / t.max) * 100}%`, backgroundColor: t.color }} />
                    </div>
                    <div className="text-[10px] font-mono text-[#8aa4c8]">{t.unit}</div>
                  </div>
                ))}
              </div>

              {/* Live log */}
              <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Live Device Log</div>
                <div className="bg-[#050e1f] rounded-sm p-3 font-mono text-[10px] space-y-1 max-h-[200px] overflow-y-auto">
                  {[
                    { t: "18:48:02", msg: "GPS fix confirmed · Delhi, 28.6315°N 77.2167°E", c: "#38c172" },
                    { t: "18:48:05", msg: `Speed sensor: ${speed} km/h · within limit`, c: "#edeae4" },
                    { t: "18:48:08", msg: `Battery telemetry: ${Math.floor(battery)}% · Estimated 48km range`, c: "#edeae4" },
                    { t: "18:48:11", msg: "Passenger SOS button: INACTIVE", c: "#38c172" },
                    { t: "18:48:14", msg: "CCTV feed: ACTIVE · Encrypted upload OK", c: "#38c172" },
                    { t: "18:48:17", msg: "Beacon corridor: Janpath Rd illuminated", c: "#f5a623" },
                    { t: "18:48:20", msg: `ETA update: ${eta} min to Connaught Place`, c: "#f5a623" },
                    { t: "18:48:23", msg: "Driver heartbeat ping: OK · Ramesh Kumar", c: "#38c172" },
                    { t: "18:48:26", msg: "Control centre: all systems nominal", c: "#38c172" },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-[#3a5270] flex-shrink-0">[{log.t}]</span>
                      <span style={{ color: log.c }}>{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle identity */}
              <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Vehicle Identity</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  {[
                    ["Plate", "AP 07 SU-03"],
                    ["Type", "6-Seat Shared E-Rickshaw"],
                    ["Battery", "48V 100Ah Li-ion"],
                    ["Max Speed", "25 km/h (governed)"],
                    ["CCTV", "4 cameras · Active"],
                    ["Last service", "4 days ago"],
                    ["GPS unit", "u-blox M9N · ±2m"],
                    ["SIM", "4G Airtel IoT SIM"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-[rgba(245,166,35,0.05)] py-1">
                      <span className="text-[#8aa4c8]">{k}</span>
                      <span className="font-mono text-[#edeae4]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DRIVER TAB */}
          {activeTab === "driver" && (
            <div className="space-y-4">
              <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.15)] rounded-sm overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519687335474-c85fb3a50ca3?w=800&h=250&fit=crop&auto=format"
                  alt="Auto rickshaw driver" className="w-full h-40 object-cover opacity-60" style={{ backgroundColor: "#0c1d38" }} />
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-16 h-16 bg-[#1a3259] rounded-sm flex items-center justify-center text-3xl flex-shrink-0 border border-[rgba(245,166,35,0.2)]">👨‍✈️</div>
                    <div>
                      <div className="text-xl font-bold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>Ramesh Kumar</div>
                      <div className="text-xs text-[#8aa4c8] mb-1">Vehicle: AP 07 SU-03</div>
                      <div className="flex gap-0.5 mb-1">{[1,2,3,4].map(i => <span key={i} className="text-[#f5a623]">★</span>)}<span className="text-[#8aa4c8]">★</span>
                        <span className="text-[10px] font-mono text-[#8aa4c8] ml-1">4.8 · 2,100 trips</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-[rgba(56,193,114,0.1)] border border-[rgba(56,193,114,0.25)] text-[#38c172] rounded-sm">✓ Aadhaar Verified</span>
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] text-[#f5a623] rounded-sm">✓ Police Cleared</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-5">
                    {[
                      ["Experience", "4 years on SETU"],
                      ["Total trips", "2,104 completed"],
                      ["Languages", "Hindi, Urdu, English"],
                      ["Incident record", "0 complaints"],
                      ["Last training", "2 weeks ago"],
                      ["Route expertise", "Central Delhi"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-[rgba(245,166,35,0.05)] py-1">
                        <span className="text-[#8aa4c8]">{k}</span>
                        <span className="text-[#edeae4]">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <a href="tel:1800-SETU-00" className="py-2.5 text-center border border-[rgba(245,166,35,0.25)] text-[#f5a623] text-sm font-bold rounded-sm hover:bg-[rgba(245,166,35,0.07)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      📞 Call Support
                    </a>
                    <button className="py-2.5 border border-[rgba(138,164,200,0.2)] text-[#8aa4c8] text-sm font-bold rounded-sm hover:bg-[rgba(138,164,200,0.05)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      💬 Report Issue
                    </button>
                  </div>
                </div>
              </div>

              {/* Co-passengers */}
              <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Co-Passengers (4 / 6 seats)</div>
                {[
                  { seat: "Priority 1", name: "Kamlaben, 68", dest: "CP Inner Circle (your stop)", type: "Senior" },
                  { seat: "Seat 2", name: "Anita D.", dest: "Janpath Market", type: "General" },
                  { seat: "Seat 3", name: "Rahul M.", dest: "Janpath Market", type: "General" },
                  { seat: "Seat 4 (YOU)", name: "You", dest: "Connaught Place", type: "Your stop ★" },
                  { seat: "Seat 5", name: "Vacant", dest: "", type: "" },
                  { seat: "Seat 6", name: "Vacant", dest: "", type: "" },
                ].map((p, i) => (
                  <div key={i} className={`flex justify-between items-center py-2 border-b border-[rgba(245,166,35,0.05)] text-xs ${p.seat.includes("YOU") ? "text-[#f5a623]" : ""}`}>
                    <div>
                      <div className="font-mono text-[9px] text-[#3a5270]">{p.seat}</div>
                      <div className={`font-semibold ${p.name === "Vacant" ? "text-[#1a3259]" : p.seat.includes("YOU") ? "text-[#f5a623]" : "text-[#edeae4]"}`}
                        style={{ fontFamily: "Rajdhani, sans-serif" }}>{p.name}</div>
                    </div>
                    {p.dest && <div className="text-right"><div className="text-[#8aa4c8]">{p.dest}</div><div className="text-[10px] font-mono text-[#3a5270]">{p.type}</div></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAFETY TAB */}
          {activeTab === "safety" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleSOS}
                  className="col-span-2 py-8 rounded-sm font-bold text-xl transition-all active:scale-[0.97] border-2"
                  style={{ fontFamily: "Rajdhani, sans-serif", background: sosActive ? "rgba(232,67,58,0.2)" : "#e8433a", color: "#fff", borderColor: "#e8433a", boxShadow: sosActive ? "0 0 40px rgba(232,67,58,0.4)" : "none" }}>
                  {sosTimer > 0 ? `🚨 SOS SENT — Responding in ${sosTimer}s` : "🆘 EMERGENCY SOS\nPress for immediate help"}
                </button>
                <button onClick={shareLocation}
                  className={`py-4 border-2 font-bold rounded-sm text-sm transition-colors ${locationShared ? "border-[#38c172] text-[#38c172] bg-[rgba(56,193,114,0.07)]" : "border-[rgba(245,166,35,0.35)] text-[#f5a623] hover:bg-[rgba(245,166,35,0.06)]"}`}
                  style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  {locationShared ? "✓ Location Shared" : "📍 Share Location"}
                </button>
                <Link to="/safety"
                  className="py-4 border-2 border-[rgba(138,164,200,0.25)] text-[#8aa4c8] font-bold rounded-sm text-sm text-center hover:bg-[rgba(138,164,200,0.05)] transition-colors"
                  style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  🛡️ Safety Center
                </Link>
              </div>

              {/* Safety status */}
              <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-4">Live Safety Status</div>
                <div className="space-y-2.5">
                  {[
                    { label: "CCTV Recording", status: "Active", ok: true },
                    { label: "GPS Tracking", status: "Active · ±3m accuracy", ok: true },
                    { label: "SOS Button", status: "Armed and ready", ok: true },
                    { label: "Driver Verified", status: "Ramesh Kumar · Cleared", ok: true },
                    { label: "Speed Limit", status: `${speed} / 25 km/h`, ok: speed <= 25 },
                    { label: "Emergency Contacts", status: locationShared ? "Notified" : "Not yet notified", ok: locationShared },
                    { label: "Beacon Corridor", status: "Janpath Rd illuminated", ok: true },
                    { label: "Control Centre", status: "Monitoring · Active", ok: true },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center border-b border-[rgba(245,166,35,0.05)] pb-2">
                      <span className="text-xs text-[#8aa4c8]">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? "bg-[#38c172]" : "bg-[#f5a623]"}`} />
                        <span className={`text-xs font-mono ${s.ok ? "text-[#38c172]" : "text-[#f5a623]"}`}>{s.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Helplines */}
              <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Emergency Numbers</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "SETU Helpline", num: "1800-SETU-00", c: "#f5a623" },
                    { label: "Delhi Police PCR", num: "100", c: "#e8433a" },
                    { label: "Women Helpline", num: "1091", c: "#8aa4c8" },
                    { label: "Ambulance", num: "108", c: "#38c172" },
                  ].map(h => (
                    <a key={h.label} href={`tel:${h.num}`}
                      className="flex flex-col items-center p-3 border border-[rgba(245,166,35,0.08)] rounded-sm hover:bg-[rgba(245,166,35,0.04)] transition-colors text-center">
                      <span className="font-mono text-lg font-bold" style={{ color: h.c }}>{h.num}</span>
                      <span className="text-[10px] text-[#8aa4c8] mt-0.5">{h.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Token + QR */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.2)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Active Token</div>
            <div className="text-3xl font-bold text-[#f5a623] text-center mb-3" style={{ fontFamily: "Rajdhani, sans-serif" }}>SU-47</div>
            <div className="flex justify-center mb-3">
              <div className="p-2.5 bg-white rounded-sm">
                <QRCodeSVG value="SETU:TOKEN:SU-47:RAJIV:CP:shared_auto" size={100} bgColor="#ffffff" fgColor="#050e1f" level="M" />
              </div>
            </div>
            <p className="text-[10px] font-mono text-[#8aa4c8] text-center">Show QR at boarding or to kiosk scanner</p>
          </div>

          {/* ETA card */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.15)] rounded-sm p-5 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-1">Time to Your Stop</div>
            <div className="text-[4rem] font-bold text-[#f5a623] leading-none" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              {eta}<span className="text-xl ml-1 text-[#8aa4c8]">min</span>
            </div>
            <div className="h-1.5 bg-[#1a3259] rounded-sm overflow-hidden mt-3 mb-2">
              <div className="h-full bg-[#f5a623] rounded-sm transition-all duration-3000" style={{ width: `${Math.min(100, vehiclePos)}%` }} />
            </div>
            <div className="text-xs text-[#8aa4c8]">{Math.floor(vehiclePos)}% of route complete</div>
          </div>

          {/* Quick actions */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-4 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-2">Quick Actions</div>
            <button onClick={handleSOS} className="w-full py-3 bg-[#e8433a] text-white font-bold rounded-sm hover:bg-[#d63a32] active:scale-[0.97] transition-all text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>🆘 SOS Emergency</button>
            <button onClick={shareLocation} className={`w-full py-2.5 border font-bold rounded-sm text-sm transition-colors ${locationShared ? "border-[#38c172] text-[#38c172]" : "border-[rgba(245,166,35,0.3)] text-[#f5a623] hover:bg-[rgba(245,166,35,0.06)]"}`} style={{ fontFamily: "Rajdhani, sans-serif" }}>
              {locationShared ? "✓ Location Shared" : "📍 Share Location"}
            </button>
            <a href="tel:1800-SETU-00" className="block w-full py-2.5 border border-[rgba(138,164,200,0.2)] text-[#8aa4c8] font-bold rounded-sm text-sm text-center hover:bg-[rgba(138,164,200,0.04)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              📞 Call Helpline
            </a>
            <Link to="/safety" className="block w-full py-2.5 border border-[rgba(245,166,35,0.15)] text-[#8aa4c8] font-bold rounded-sm text-sm text-center hover:bg-[rgba(245,166,35,0.04)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              🛡️ Safety Center
            </Link>
          </div>

          {/* Auto photo */}
          <div className="rounded-sm overflow-hidden border border-[rgba(245,166,35,0.1)]">
            <img src="https://images.unsplash.com/photo-1564291886459-a39ad7415125?w=400&h=200&fit=crop&auto=format"
              alt="Auto rickshaw" className="w-full h-36 object-cover" style={{ backgroundColor: "#0c1d38" }} />
            <div className="bg-[#0c1d38] px-4 py-2.5">
              <div className="text-xs font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>Your Vehicle</div>
              <div className="text-[10px] font-mono text-[#8aa4c8]">AP 07 SU-03 · Shared Auto</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
