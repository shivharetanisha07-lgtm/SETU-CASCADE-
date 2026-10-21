import { Link, Outlet, useLocation } from "react-router";
import { useState, useRef, useEffect } from "react";

const NAV = [
  {
    to: "/",
    label: "Home",
    icon: "🏠",
    dropdown: null,
  },
  {
    to: "/book",
    label: "Book a Ride",
    icon: "🛺",
    dropdown: [
      { to: "/book", icon: "📋", label: "Standard Booking", desc: "Step-by-step ride booking" },
      { to: "/book", icon: "📷", label: "QR / WhatsApp", desc: "Scan & book without app" },
      { to: "/book", icon: "🎙️", label: "Voice Booking", desc: "Speak your destination" },
      { to: "/kiosk", icon: "🖥️", label: "Kiosk Booking", desc: "Physical kiosk simulation" },
    ],
  },
  {
    to: "/vehicles",
    label: "Vehicles",
    icon: "🚗",
    dropdown: [
      { to: "/vehicles", icon: "🛺", label: "Shared Auto", desc: "₹15–25 · 6 seats · Cheapest" },
      { to: "/vehicles", icon: "⭐", label: "Priority Auto", desc: "₹25–35 · Accessible boarding" },
      { to: "/vehicles", icon: "🔐", label: "Women-Only Auto", desc: "₹25–30 · Female driver" },
      { to: "/vehicles", icon: "♿", label: "Accessible Vehicle", desc: "₹20–30 · Wheelchair ramp" },
      { to: "/vehicles", icon: "🚕", label: "SETU Cab", desc: "₹40–70 · AC private cab" },
    ],
  },
  {
    to: "/track",
    label: "Track Ride",
    icon: "📍",
    dropdown: [
      { to: "/track", icon: "🗺️", label: "Live Map", desc: "Real-time vehicle position" },
      { to: "/track", icon: "📊", label: "Telemetry", desc: "Speed · Battery · ETA data" },
      { to: "/track", icon: "👤", label: "Driver Info", desc: "Verified ID & co-passengers" },
      { to: "/track", icon: "🛡️", label: "Safety Status", desc: "SOS & live safety checks" },
    ],
  },
  {
    to: "/safety",
    label: "Safety",
    icon: "🛡️",
    dropdown: [
      { to: "/safety", icon: "🆘", label: "SOS Emergency", desc: "One-tap police alert" },
      { to: "/safety", icon: "📞", label: "Helplines", desc: "Women · Police · Ambulance" },
      { to: "/safety", icon: "🎥", label: "CCTV & Tracking", desc: "4-camera encrypted cabin" },
      { to: "/safety", icon: "🌙", label: "Safe Night Return", desc: "Female-only late night rides" },
    ],
  },
  {
    to: "/kiosk",
    label: "Kiosk",
    icon: "🖥️",
    dropdown: null,
  },
];

function DropdownMenu({ items, visible }: { items: NonNullable<typeof NAV[0]["dropdown"]>; visible: boolean }) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 transition-all duration-200 origin-top z-50
      ${visible ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}`}>
      {/* Arrow */}
      <div className="flex justify-center mb-[-1px]">
        <div className="w-3 h-3 rotate-45 bg-[#0c1d38] border-l border-t border-[rgba(245,166,35,0.25)]" />
      </div>
      <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.22)] rounded-sm overflow-hidden shadow-2xl"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.08)" }}>
        {items.map((item, i) => (
          <Link key={i} to={item.to}
            className="flex items-start gap-3 px-4 py-3 hover:bg-[rgba(245,166,35,0.07)] border-b border-[rgba(245,166,35,0.06)] last:border-0 transition-all group">
            <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">{item.icon}</span>
            <div>
              <div className="text-sm font-semibold text-[#edeae4] group-hover:text-[#f5a623] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>{item.label}</div>
              <div className="text-[10px] text-[#6b8ab0] mt-0.5">{item.desc}</div>
            </div>
            <span className="ml-auto text-[#3a5270] group-hover:text-[#f5a623] transition-all group-hover:translate-x-0.5 text-xs mt-1">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [logoHovered, setLogoHovered] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setOpenDropdown(null); setMenuOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050e1f] text-[#edeae4]">
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-[rgba(5,14,31,0.96)] backdrop-blur-xl border-b border-[rgba(245,166,35,0.14)]"
        style={{ boxShadow: "0 1px 40px rgba(0,0,0,0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* ── LOGO ─────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group" onMouseEnter={() => setLogoHovered(true)} onMouseLeave={() => setLogoHovered(false)}>
            {/* Animated SVG logo */}
            <div className="relative">
              {/* Glow ring */}
              <div className={`absolute inset-0 rounded-lg blur-md transition-all duration-500 ${logoHovered ? "opacity-80 scale-110" : "opacity-0"}`}
                style={{ background: "radial-gradient(circle, rgba(245,166,35,0.6) 0%, transparent 70%)" }} />
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="relative transition-transform duration-300 group-hover:scale-105">
                {/* Background */}
                <rect width="42" height="42" rx="10" fill="url(#logoGrad)" />
                {/* Shine overlay */}
                <rect width="42" height="21" rx="10" fill="rgba(255,255,255,0.06)" />
                {/* Road */}
                <rect x="5" y="30" width="32" height="3" rx="1.5" fill="#050e1f" opacity="0.85" />
                {/* Road dashes */}
                <rect x="11" y="31.2" width="5" height="1" rx="0.5" fill="rgba(245,166,35,0.5)" />
                <rect x="19" y="31.2" width="5" height="1" rx="0.5" fill="rgba(245,166,35,0.5)" />
                <rect x="27" y="31.2" width="5" height="1" rx="0.5" fill="rgba(245,166,35,0.5)" />
                {/* Left tower */}
                <rect x="8" y="17" width="5" height="13" rx="1.5" fill="#050e1f" opacity="0.9" />
                {/* Right tower */}
                <rect x="29" y="17" width="5" height="13" rx="1.5" fill="#050e1f" opacity="0.9" />
                {/* Tower tops */}
                <rect x="8.5" y="14" width="4" height="4" rx="1" fill="#050e1f" opacity="0.7" />
                <rect x="29.5" y="14" width="4" height="4" rx="1" fill="#050e1f" opacity="0.7" />
                {/* Main arch cable */}
                <path d="M10 28 Q21 8 32 28" stroke="#050e1f" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Suspender cables */}
                <line x1="15.5" y1="18.5" x2="15.5" y2="28" stroke="#050e1f" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="21" y1="13" x2="21" y2="28" stroke="#050e1f" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="26.5" y1="18.5" x2="26.5" y2="28" stroke="#050e1f" strokeWidth="1.5" strokeLinecap="round" />
                {/* Auto silhouette on bridge */}
                <ellipse cx={logoHovered ? 28 : 14} cy="27" rx="3.5" ry="2" fill="#050e1f" opacity="0.6"
                  style={{ transition: "cx 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fbb740" />
                    <stop offset="50%" stopColor="#f5a623" />
                    <stop offset="100%" stopColor="#e08a10" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span className="font-bold tracking-[0.12em] transition-colors duration-200"
                style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.25rem", color: logoHovered ? "#fbb740" : "#f5a623" }}>
                SETU
              </span>
              <span className="text-[8.5px] font-mono tracking-[0.18em] uppercase transition-colors duration-200"
                style={{ color: logoHovered ? "#8aa4c8" : "#4d6b8a" }}>
                सेतु · Mobility
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ──────────────────────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV.map(item => {
              const active = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              const hasDropdown = !!item.dropdown;
              const isOpen = openDropdown === item.to;

              return (
                <div key={item.to} className="relative"
                  onMouseEnter={() => hasDropdown && setOpenDropdown(item.to)}
                  onMouseLeave={() => setOpenDropdown(null)}>
                  <Link to={item.to}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold rounded-sm transition-all duration-150 select-none
                      ${active ? "bg-[rgba(245,166,35,0.12)] text-[#f5a623]" : "text-[#8aa4c8] hover:text-[#edeae4] hover:bg-[rgba(255,255,255,0.04)]"}`}
                    style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.04em" }}>
                    {item.label}
                    {hasDropdown && (
                      <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    )}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#f5a623]" style={{ bottom: "-1px" }} />
                    )}
                  </Link>

                  {hasDropdown && item.dropdown && (
                    <DropdownMenu items={item.dropdown} visible={isOpen} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── CTA ──────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/book"
              className="relative px-5 py-2 text-[13px] font-bold rounded-sm overflow-hidden group transition-all"
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em", background: "linear-gradient(135deg,#f5a623,#fbb740,#e8900a)", color: "#050e1f", boxShadow: "0 0 16px rgba(245,166,35,0.25)" }}>
              <span className="relative z-10">BOOK NOW</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </Link>
          </div>

          {/* ── MOBILE HAMBURGER ─────────────────── */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-[5px] rounded-sm hover:bg-[rgba(245,166,35,0.06)] transition-colors">
            <span className={`w-5 h-0.5 rounded-full bg-[#8aa4c8] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`w-5 h-0.5 rounded-full bg-[#8aa4c8] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`w-5 h-0.5 rounded-full bg-[#8aa4c8] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>

        {/* ── MOBILE MENU ──────────────────────── */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="border-t border-[rgba(245,166,35,0.1)] bg-[rgba(5,14,31,0.98)] px-4 py-3 space-y-1">
            {NAV.map(item => {
              const active = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <div key={item.to}>
                  <Link to={item.to} onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-sm transition-colors ${active ? "text-[#f5a623] bg-[rgba(245,166,35,0.08)]" : "text-[#8aa4c8] hover:text-[#f5a623] hover:bg-[rgba(245,166,35,0.06)]"}`}
                    style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f5a623]" />}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-10 mt-0.5 mb-1 space-y-0.5">
                      {item.dropdown.map((sub, i) => (
                        <Link key={i} to={sub.to} onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#6b8ab0] hover:text-[#f5a623] rounded-sm transition-colors"
                          style={{ fontFamily: "Noto Sans, sans-serif" }}>
                          <span className="text-sm">{sub.icon}</span>{sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link to="/book" onClick={() => setMenuOpen(false)}
              className="block mt-3 px-3 py-3 text-sm font-bold text-center rounded-sm"
              style={{ fontFamily: "Rajdhani, sans-serif", background: "linear-gradient(135deg,#f5a623,#fbb740)", color: "#050e1f" }}>
              BOOK NOW →
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <Outlet />
      </div>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="border-t border-[rgba(245,166,35,0.12)] bg-[#030b17] py-10 mt-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <svg width="28" height="28" viewBox="0 0 42 42" fill="none">
                  <rect width="42" height="42" rx="10" fill="#f5a623" />
                  <rect x="5" y="30" width="32" height="3" rx="1.5" fill="#050e1f" opacity="0.85" />
                  <rect x="8" y="17" width="5" height="13" rx="1.5" fill="#050e1f" opacity="0.9" />
                  <rect x="29" y="17" width="5" height="13" rx="1.5" fill="#050e1f" opacity="0.9" />
                  <path d="M10 28 Q21 8 32 28" stroke="#050e1f" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <line x1="21" y1="13" x2="21" y2="28" stroke="#050e1f" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[#f5a623] font-bold text-xl tracking-wider" style={{ fontFamily: "Rajdhani, sans-serif" }}>SETU सेतु</span>
              </div>
              <p className="text-xs text-[#6b8ab0] italic mb-1">"Bridging the Gap, One Ride at a Time."</p>
              <p className="text-[10px] font-mono text-[#3a5270]">जो दूरी बाकी है, वो सेतु करेगा</p>
            </div>
            <div className="flex gap-10 text-xs text-[#6b8ab0]">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#3a5270] mb-2">Services</div>
                {[{to:"/book",l:"Book a Ride"},{to:"/vehicles",l:"Vehicles"},{to:"/kiosk",l:"Kiosk"}].map(x => (
                  <Link key={x.to} to={x.to} className="block py-1 hover:text-[#f5a623] transition-colors">{x.l}</Link>
                ))}
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#3a5270] mb-2">Safety</div>
                {[{to:"/safety",l:"Safety Hub"},{to:"/track",l:"Track Ride"}].map(x => (
                  <Link key={x.to} to={x.to} className="block py-1 hover:text-[#f5a623] transition-colors">{x.l}</Link>
                ))}
              </div>
            </div>
            <div className="text-xs">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#3a5270] mb-2">Contact</div>
              <div className="text-[#f5a623] font-mono font-bold">1800-SETU-00</div>
              <div className="text-[#6b8ab0] mt-0.5">Toll-free · 24×7</div>
              <div className="text-[#6b8ab0] mt-1 font-mono text-[10px]">WhatsApp: +91 80012 34567</div>
            </div>
          </div>
          <div className="border-t border-[rgba(245,166,35,0.08)] pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-[#3a5270]">
            <span>© 2026 SETU Mobility · Delhi Pilot</span>
            <span>All electric · Zero emissions · GPS-tracked · Safety-certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
