import { Link } from "react-router";
import { useState } from "react";
import QRCode from "../components/QRCode";

const VEHICLES = [
  {
    id: "shared_auto",
    name: "Shared Auto",
    tagline: "Most affordable daily commute — Delhi's backbone",
    icon: "🛺",
    badge: "Most Popular",
    badgeColor: "#38c172",
    seats: 6,
    fare: "₹15–25",
    fareNum: 20,
    eta: "2–4 min",
    images: [
      "https://images.unsplash.com/photo-1564291886459-a39ad7415125?w=700&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519687335474-c85fb3a50ca3?w=700&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1745586325699-55c47396b308?w=700&h=400&fit=crop&auto=format",
    ],
    features: [
      { icon: "👥", label: "Shared Seating", desc: "Up to 6 passengers grouped by destination corridor" },
      { icon: "🔊", label: "Audio Announcements", desc: "Stop names called in Hindi + local language" },
      { icon: "💵", label: "Cash & UPI", desc: "All payment types — no mandatory digital payment" },
      { icon: "📡", label: "Live GPS", desc: "Real-time location visible on track page and to family" },
      { icon: "💡", label: "Occupancy LED", desc: "Roof LED strip shows seat availability at kiosk" },
      { icon: "⚡", label: "Electric", desc: "Zero tailpipe emissions. Solar-charged at SETU hubs." },
    ],
    seating: [
      { type: "driver", label: "Driver" },
      { type: "std", label: "Seat 1" },
      { type: "std", label: "Seat 2" },
      { type: "std", label: "Seat 3" },
      { type: "std", label: "Seat 4" },
      { type: "std", label: "Seat 5" },
    ],
    specs: [["Battery", "48V 100Ah Li-ion"], ["Charge time", "4 hrs / <8 min swap"], ["Range", "80 km/charge"], ["Max speed", "25 km/h (governed)"], ["Frame", "Steel tubular, galvanised"]],
  },
  {
    id: "priority_auto",
    name: "Priority Auto",
    tagline: "Guaranteed priority boarding — elderly, disabled, pregnant first",
    icon: "⭐",
    badge: "Accessible",
    badgeColor: "#f5a623",
    seats: 6,
    fare: "₹25–35",
    fareNum: 30,
    eta: "3–5 min",
    images: [
      "https://images.unsplash.com/photo-1624858020896-4a558c5d7042?w=700&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1592639296346-560c37a0f711?w=700&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1767184113099-788861878a1c?w=700&h=400&fit=crop&auto=format",
    ],
    features: [
      { icon: "⭐", label: "Priority Lane", desc: "Dedicated boarding queue and front seat reserved" },
      { icon: "🤝", label: "Assisted Boarding", desc: "Driver assists elderly and disabled passengers" },
      { icon: "💺", label: "Wide Padded Seat", desc: "52 cm seat (vs 40 cm standard) closest to exit" },
      { icon: "🔊", label: "Audio Confirmation", desc: "Every step confirmed by voice in your language" },
      { icon: "📞", label: "Contact Alert", desc: "SMS to emergency contact on boarding" },
      { icon: "🚫", label: "Fixed Fare", desc: "No negotiation, no surge. Flat ₹25–35." },
    ],
    seating: [
      { type: "driver", label: "Driver" },
      { type: "priority", label: "Priority ★" },
      { type: "priority", label: "Priority ★" },
      { type: "std", label: "Seat 3" },
      { type: "std", label: "Seat 4" },
      { type: "std", label: "Seat 5" },
    ],
    specs: [["Priority seat width", "52 cm"], ["Grab handles", "3 padded per side"], ["Entry step", "0 cm (flush ramp)"], ["Attendant button", "On priority seats"], ["Driver training", "Disability assist certified"]],
  },
  {
    id: "women_only",
    name: "Women-Only",
    tagline: "Safe travel for women — day and night, guaranteed",
    icon: "🔐",
    badge: "Safe Night Return",
    badgeColor: "#8aa4c8",
    seats: 6,
    fare: "₹25–30",
    fareNum: 28,
    eta: "4–6 min",
    images: [
      "https://images.unsplash.com/photo-1760791963527-d170b4cf26ea?w=700&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1760782064968-9357e20a4a71?w=700&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1513014576558-921f00d80b77?w=700&h=400&fit=crop&auto=format",
    ],
    features: [
      { icon: "👩‍✈️", label: "Female Driver", desc: "Trained, verified female driver — every trip" },
      { icon: "👥", label: "Female Co-Attendant", desc: "Onboard attendant for all journeys after 8pm" },
      { icon: "📡", label: "Live Location Share", desc: "Journey auto-shared to your emergency contact" },
      { icon: "🎥", label: "CCTV (4 cameras)", desc: "Encrypted storage — police-accessible only with warrant" },
      { icon: "🆘", label: "Silent SOS", desc: "Under-seat panic — alerts police silently" },
      { icon: "🌙", label: "Safe Night Return", desc: "Beacon-lit corridor, guaranteed female driver after 8pm" },
    ],
    seating: [
      { type: "driver", label: "Female Driver" },
      { type: "attendant", label: "Attendant" },
      { type: "women", label: "Women Only" },
      { type: "women", label: "Women Only" },
      { type: "women", label: "Women Only" },
      { type: "women", label: "Women Only" },
    ],
    specs: [["Driver", "Female, Aadhaar-verified"], ["Active after 8pm", "24/7 on demand"], ["CCTV", "4 cameras, encrypted"], ["SOS response", "<90 seconds"], ["Beacon corridor", "100m solar LED intervals"]],
  },
  {
    id: "accessible",
    name: "Accessible Vehicle",
    tagline: "Full wheelchair access — no compromise, no extra charge",
    icon: "♿",
    badge: "Wheelchair OK",
    badgeColor: "#38c172",
    seats: 4,
    fare: "₹20–30",
    fareNum: 25,
    eta: "5–8 min",
    images: [
      "https://images.unsplash.com/photo-1780324269955-65898a3ef498?w=700&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1534406516536-c34a9683e490?w=700&h=400&fit=crop&auto=format",
    ],
    features: [
      { icon: "♿", label: "Full Ramp", desc: "Electric foldable ramp, 35° grade, 200 kg rated" },
      { icon: "🚪", label: "Wide Door (55 cm)", desc: "Fits standard and large wheelchairs" },
      { icon: "🔒", label: "4-Point Lock", desc: "ISO 10542 wheelchair safety locking system" },
      { icon: "👂", label: "Hearing-Impaired", desc: "Vibrating floor panel + large display for stop alerts" },
      { icon: "🌑", label: "Braille Touchpoints", desc: "All buttons and handles Braille-labelled" },
      { icon: "🤝", label: "Trained Driver", desc: "All accessible vehicle drivers disability-assist certified" },
    ],
    seating: [
      { type: "driver", label: "Driver" },
      { type: "wheelchair", label: "Wheelchair ♿" },
      { type: "accessible", label: "Companion" },
      { type: "accessible", label: "Companion" },
      { type: "accessible", label: "Passenger" },
    ],
    specs: [["Ramp type", "Electric fold, 35° grade"], ["Door width", "55 cm clear"], ["Floor height", "0 cm (flush)"], ["Wheelchair lock", "4-point ISO 10542"], ["Hearing alert", "Vibro-tactile floor panel"]],
  },
  {
    id: "cab",
    name: "SETU Cab",
    tagline: "Private AC cab — when you need comfort and privacy",
    icon: "🚕",
    badge: "AC · Private",
    badgeColor: "#f5a623",
    seats: 3,
    fare: "₹40–70",
    fareNum: 55,
    eta: "5–8 min",
    images: [
      "https://images.unsplash.com/photo-1570168305673-42708ac64073?w=700&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1513014576558-921f00d80b77?w=700&h=400&fit=crop&auto=format",
    ],
    features: [
      { icon: "❄️", label: "Air Conditioned", desc: "CNG + electric hybrid, full AC cabin" },
      { icon: "🔒", label: "Private Ride", desc: "No co-passengers unless you add them. Your car." },
      { icon: "👤", label: "1–3 Passengers", desc: "Perfect for small groups or solo with luggage" },
      { icon: "📱", label: "App Booking", desc: "Book via app, WhatsApp or kiosk. GPS tracked." },
      { icon: "🧾", label: "Invoice Ready", desc: "Digital receipt — expense claims made easy" },
      { icon: "💳", label: "All Payments", desc: "Cash, UPI, corporate billing, NCMC card" },
    ],
    seating: [
      { type: "driver", label: "Driver" },
      { type: "cab", label: "Passenger 1" },
      { type: "cab", label: "Passenger 2" },
      { type: "cab", label: "Passenger 3" },
    ],
    specs: [["Fuel", "CNG + Electric Hybrid"], ["AC", "Yes — roof-mounted"], ["Luggage", "1 large bag per passenger"], ["Max passengers", "3 + driver"], ["Corporate billing", "GST invoice available"]],
  },
];

const seatColors: Record<string, string> = {
  driver: "bg-[#1a3259] text-[#8aa4c8]",
  std: "bg-[#0c1d38] border border-[rgba(245,166,35,0.15)] text-[#edeae4]",
  priority: "bg-[rgba(245,166,35,0.15)] border border-[rgba(245,166,35,0.4)] text-[#f5a623]",
  women: "bg-[rgba(138,164,200,0.1)] border border-[rgba(138,164,200,0.3)] text-[#8aa4c8]",
  wheelchair: "bg-[rgba(56,193,114,0.12)] border border-[rgba(56,193,114,0.3)] text-[#38c172]",
  accessible: "bg-[#0c1d38] border border-[rgba(56,193,114,0.15)] text-[#edeae4]",
  attendant: "bg-[rgba(232,67,58,0.08)] border border-[rgba(232,67,58,0.2)] text-[#e8433a]",
  cab: "bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] text-[#f5a623]",
};

export default function Vehicles() {
  const [activeId, setActiveId] = useState("shared_auto");
  const [activeImg, setActiveImg] = useState(0);
  const vehicle = VEHICLES.find(v => v.id === activeId)!;

  function selectVehicle(id: string) {
    setActiveId(id);
    setActiveImg(0);
  }

  const badgeStyle = (color: string) => ({
    color,
    borderColor: `${color}60`,
    backgroundColor: `${color}15`,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#f5a623]">FLEET</span>
          <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>SETU Vehicles</h1>
        <p className="text-[#8aa4c8] text-sm max-w-xl">All electric, GPS-tracked, safety-certified. From shared autos to private cabs — every commuter need covered.</p>
      </div>

      {/* Vehicle selector cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {VEHICLES.map(v => {
          const active = activeId === v.id;
          return (
            <button key={v.id} onClick={() => selectVehicle(v.id)}
              className={`relative flex flex-col items-center text-center rounded-sm border pt-5 pb-4 px-3 transition-all group overflow-hidden ${active ? "border-[#f5a623] bg-[#0c1d38] shadow-lg" : "border-[rgba(245,166,35,0.1)] bg-[#0c1d38] hover:border-[rgba(245,166,35,0.35)]"}`}
              style={{ boxShadow: active ? `0 0 0 1px ${v.badgeColor}40, 0 8px 24px rgba(0,0,0,0.4)` : undefined }}>
              {/* Accent bar top */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-sm transition-all"
                style={{ backgroundColor: active ? v.badgeColor : "transparent" }} />
              {/* Icon */}
              <span className="text-3xl mb-2 leading-none">{v.icon}</span>
              {/* Name */}
              <div className="font-bold text-sm leading-tight mb-1" style={{ fontFamily: "Rajdhani, sans-serif", color: active ? "#edeae4" : "#8aa4c8" }}>
                {v.name}
              </div>
              {/* Fare */}
              <div className="font-mono text-xs font-bold" style={{ color: active ? v.badgeColor : "#3a5270" }}>
                {v.fare}
              </div>
              {/* Badge pill */}
              <div className="mt-2 px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wide transition-all"
                style={{
                  backgroundColor: active ? `${v.badgeColor}22` : "transparent",
                  color: active ? v.badgeColor : "#3a5270",
                  border: `1px solid ${active ? v.badgeColor + "60" : "transparent"}`,
                }}>
                {v.badge}
              </div>
              {/* Active indicator dot */}
              {active && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: v.badgeColor }} />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Photo gallery */}
          <div className="rounded-sm overflow-hidden border border-[rgba(245,166,35,0.15)]">
            <div className="relative">
              <img key={vehicle.images[activeImg]} src={vehicle.images[activeImg]} alt={vehicle.name}
                className="w-full object-cover transition-opacity duration-500"
                style={{ height: "220px", backgroundColor: "#0c1d38" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050e1f] via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-[11px] font-mono border rounded-sm px-2 py-0.5"
                style={badgeStyle(vehicle.badgeColor)}>{vehicle.badge}</span>
            </div>
            {vehicle.images.length > 1 && (
              <div className="flex gap-1.5 p-3 bg-[#0c1d38]">
                {vehicle.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className="flex-1 relative rounded-sm overflow-hidden border transition-all" style={{ borderColor: activeImg === i ? vehicle.badgeColor : "rgba(245,166,35,0.1)", height: "48px" }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {activeImg !== i && <div className="absolute inset-0 bg-[rgba(5,14,31,0.6)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-px bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.08)] rounded-sm overflow-hidden">
            {[{ l: "Fare", v: vehicle.fare, c: "#f5a623" }, { l: "Seats", v: String(vehicle.seats), c: "#edeae4" }, { l: "ETA", v: vehicle.eta, c: "#38c172" }, { l: "Type", v: "Electric", c: "#edeae4" }].map(s => (
              <div key={s.l} className="bg-[#0c1d38] px-4 py-3 text-center">
                <div className="font-bold text-lg leading-none mb-0.5" style={{ fontFamily: "Rajdhani, sans-serif", color: s.c }}>{s.v}</div>
                <div className="text-[10px] font-mono text-[#8aa4c8]">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Seating layout */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Seating Layout</div>
            <div className="flex flex-col gap-1.5 items-center">
              {vehicle.seating.map((seat, i) => (
                <div key={i} className={`w-full max-w-[200px] rounded-sm px-3 py-2 text-center text-[11px] font-mono ${seatColors[seat.type]}`}>{seat.label}</div>
              ))}
            </div>
            <div className="mt-3 text-[10px] text-[#8aa4c8] text-center">← Entry / ramp side →</div>
          </div>

          {/* Tech specs */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Specifications</div>
            <div className="space-y-1.5">
              {vehicle.specs.map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs border-b border-[rgba(245,166,35,0.05)] pb-1.5">
                  <span className="text-[#8aa4c8]">{k}</span>
                  <span className="text-[#edeae4] font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Features + Book CTA */}
        <div className="lg:col-span-3 space-y-4">
          <div>
            <h2 className="text-[2.2rem] font-bold text-[#edeae4] mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              {vehicle.icon} {vehicle.name}
            </h2>
            <p className="text-[#8aa4c8] text-sm mb-4">{vehicle.tagline}</p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicle.features.map(f => (
              <div key={f.label} className="bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] rounded-sm p-4 hover:border-[rgba(245,166,35,0.25)] transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{f.icon}</span>
                  <span className="font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{f.label}</span>
                </div>
                <p className="text-xs text-[#8aa4c8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Booking card */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.2)] rounded-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-bold text-lg text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>Book {vehicle.name}</div>
                <div className="text-xs text-[#8aa4c8]">ETA {vehicle.eta} · {vehicle.fare} per ride · Delhi routes</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#38c172] animate-pulse" />
                <span className="text-[10px] font-mono text-[#38c172]">AVAILABLE</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Link to="/book" className="col-span-3 py-3.5 text-center font-bold rounded-sm transition-colors text-[#050e1f] hover:opacity-90"
                style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", backgroundColor: vehicle.badgeColor === "#8aa4c8" ? "#8aa4c8" : vehicle.badgeColor }}>
                BOOK {vehicle.name.toUpperCase()} →
              </Link>
              <Link to="/track" className="py-2.5 text-center border border-[rgba(245,166,35,0.2)] text-[#8aa4c8] text-sm font-semibold rounded-sm hover:border-[rgba(245,166,35,0.4)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                📍 Track
              </Link>
              <Link to="/safety" className="py-2.5 text-center border border-[rgba(232,67,58,0.2)] text-[#e8433a] text-sm font-semibold rounded-sm hover:bg-[rgba(232,67,58,0.06)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                🛡️ Safety
              </Link>
              <Link to="/kiosk" className="py-2.5 text-center border border-[rgba(138,164,200,0.2)] text-[#8aa4c8] text-sm font-semibold rounded-sm hover:bg-[rgba(138,164,200,0.04)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                🎙️ Kiosk
              </Link>
            </div>
          </div>

          {/* Infographic: cost comparison */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-4">Cost Comparison — 2–3 km Delhi Last Mile</div>
            <div className="space-y-2.5">
              {[
                { label: `${vehicle.name} (SETU)`, amount: vehicle.fareNum, max: 150, color: vehicle.badgeColor === "#8aa4c8" ? "#8aa4c8" : vehicle.badgeColor, highlight: true },
                { label: "Solo auto-rickshaw", amount: 80, max: 150, color: "#e8433a", highlight: false },
                { label: "Ola / Uber", amount: 130, max: 150, color: "#e8433a", highlight: false },
                { label: "Bike taxi", amount: 55, max: 150, color: "#f5a623", highlight: false },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={item.highlight ? "text-[#edeae4] font-semibold" : "text-[#8aa4c8]"}>{item.label}</span>
                    <span className="font-mono font-bold" style={{ color: item.color }}>₹{item.amount}</span>
                  </div>
                  <div className="h-2 bg-[#050e1f] rounded-sm overflow-hidden">
                    <div className="h-full rounded-sm" style={{ width: `${(item.amount / 150) * 100}%`, backgroundColor: item.color, opacity: item.highlight ? 1 : 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ops card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] rounded-sm p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-2">Operating Hours</div>
              <div className="text-sm font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>6:00 AM – 10:00 PM</div>
              <div className="text-xs text-[#8aa4c8]">{vehicle.id === "women_only" ? "Women-Only: 24/7" : "Ext. hours on request"}</div>
            </div>
            <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] rounded-sm p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-2">Safety Rating</div>
              <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(i => <span key={i} className="text-[#f5a623]">★</span>)}</div>
              <div className="text-xs text-[#8aa4c8]">5/5 — All SETU certified</div>
            </div>
          </div>
        </div>
      </div>

      {/* All vehicles comparison table */}
      <div className="mt-14 border-t border-[rgba(245,166,35,0.1)] pt-10">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[#8aa4c8] mb-6">All Vehicles at a Glance</div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[rgba(245,166,35,0.2)]">
                {["Vehicle", "Fare", "Seats", "ETA", "Best For", "Book"].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-mono text-[11px] uppercase tracking-widest text-[#f5a623] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VEHICLES.map(v => (
                <tr key={v.id} onClick={() => selectVehicle(v.id)} className="border-b border-[rgba(245,166,35,0.06)] hover:bg-[rgba(245,166,35,0.03)] transition-colors cursor-pointer">
                  <td className="py-3 px-4 font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{v.icon} {v.name}</td>
                  <td className="py-3 px-4 font-mono text-[#f5a623]">{v.fare}</td>
                  <td className="py-3 px-4 text-[#8aa4c8]">{v.seats}</td>
                  <td className="py-3 px-4 font-mono text-[#38c172]">{v.eta}</td>
                  <td className="py-3 px-4"><span className="text-[10px] font-mono px-2 py-0.5 border rounded-sm" style={badgeStyle(v.badgeColor)}>{v.badge}</span></td>
                  <td className="py-3 px-4">
                    <Link to="/book" className="px-4 py-1.5 text-xs font-bold rounded-sm hover:opacity-80 transition-opacity text-[#050e1f]" style={{ backgroundColor: v.badgeColor === "#8aa4c8" ? "#8aa4c8" : v.badgeColor, fontFamily: "Rajdhani, sans-serif" }}>
                      BOOK
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
