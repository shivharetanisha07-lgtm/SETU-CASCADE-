import { useState } from "react";
import { Link } from "react-router";

export default function Safety() {
  const [sosPressed, setSosPressed] = useState(false);
  const [contacts, setContacts] = useState([
    { name: "Priya Sharma (Sister)", phone: "+91 98765 43210", notified: true },
    { name: "Arun Kumar (Son)", phone: "+91 87654 32109", notified: false },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [nightMode, setNightMode] = useState(false);
  const [trackingOn, setTrackingOn] = useState(true);
  const [addingContact, setAddingContact] = useState(false);
  const [sosCooldown, setSosCooldown] = useState(0);

  function handleSOS() {
    if (sosCooldown > 0) return;
    setSosPressed(true);
    setSosCooldown(5);
    const t = setInterval(() => setSosCooldown(c => {
      if (c <= 1) { clearInterval(t); return 0; }
      return c - 1;
    }), 1000);
    setTimeout(() => setSosPressed(false), 8000);
  }

  function addContact() {
    if (!newName || !newPhone) return;
    setContacts([...contacts, { name: newName, phone: newPhone, notified: false }]);
    setNewName(""); setNewPhone(""); setAddingContact(false);
  }

  function toggleNotify(i: number) {
    setContacts(contacts.map((c, idx) => idx === i ? { ...c, notified: !c.notified } : c));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#f5a623]">SAFETY</span>
          <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
        </div>
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>Your Safety, Our Priority</h1>
        <p className="text-[#8aa4c8] text-sm max-w-xl">Every SETU ride is monitored, tracked, and protected — for everyone, especially women, elderly, and solo travellers.</p>
      </div>

      {sosPressed && (
        <div className="mb-6 p-5 bg-[rgba(232,67,58,0.12)] border-2 border-[#e8433a] rounded-sm text-center">
          <div className="text-[#e8433a] font-bold text-xl mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>🚨 SOS ALERT ACTIVATED</div>
          <p className="text-sm text-[#e8433a]">Police PCR + SETU Control Centre notified. Your live location is being shared. Driver has been alerted.</p>
          <p className="text-xs text-[#8aa4c8] mt-2">Expected response: under 90 seconds · Toll-free: 1800-SETU-00</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: SOS + Quick actions */}
        <div className="space-y-4">
          {/* SOS Button */}
          <div className="bg-[#0c1d38] border border-[rgba(232,67,58,0.3)] rounded-sm p-6 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-4">Emergency Button</div>
            <button onClick={handleSOS}
              className="w-full h-28 rounded-sm font-bold text-2xl transition-all active:scale-95 relative overflow-hidden"
              style={{
                fontFamily: "Rajdhani, sans-serif",
                background: sosPressed ? "rgba(232,67,58,0.3)" : "#e8433a",
                color: "#fff",
                boxShadow: sosPressed ? "0 0 30px rgba(232,67,58,0.5)" : "none",
              }}>
              {sosCooldown > 0 ? (
                <span className="text-lg">SOS sent · {sosCooldown}s</span>
              ) : (
                <>🆘 SOS<br /><span className="text-sm font-normal">Press for emergency</span></>
              )}
            </button>
            <p className="text-[10px] font-mono text-[#8aa4c8] mt-3">Notifies: Police PCR · SETU Control · Your contacts</p>
          </div>

          {/* Quick safety toggles */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-4">Active Protections</div>
            <div className="space-y-3">
              {[
                { label: "Live Location Tracking", state: trackingOn, toggle: () => setTrackingOn(!trackingOn), icon: "📡" },
                { label: "Safe Night Return Mode", state: nightMode, toggle: () => setNightMode(!nightMode), icon: "🌙" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[rgba(245,166,35,0.07)]">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-sm text-[#edeae4]">{item.label}</span>
                  </div>
                  <button onClick={item.toggle}
                    className={`w-11 h-6 rounded-full transition-all relative ${item.state ? "bg-[#38c172]" : "bg-[#1a3259]"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${item.state ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              ))}
              {nightMode && (
                <div className="mt-2 p-3 bg-[rgba(138,164,200,0.07)] border border-[rgba(138,164,200,0.15)] rounded-sm text-xs text-[#8aa4c8]">
                  <strong className="text-[#8aa4c8]">Safe Night Return active:</strong> Female driver + co-attendant assigned. Route uses beacon-lit corridors. Journey auto-shared to contacts.
                </div>
              )}
            </div>
          </div>

          {/* Helpline */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-1">Emergency Helplines</div>
            <p className="text-[10px] text-[#3a5270] mb-3">Tap any number to call directly</p>

            {/* Women's Safety */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c084fc]">🩷 Women's Safety</span>
                <div className="h-px flex-1 bg-[rgba(192,132,252,0.15)]" />
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Women Helpline (National)", number: "1091", note: "24×7 · All India" },
                  { label: "Women Helpline (Domestic)", number: "181", note: "Domestic violence · 24×7" },
                  { label: "Delhi Commission for Women", number: "011-23379181", note: "DCW · 9 AM–6 PM" },
                  { label: "Nirbhaya Helpline", number: "112", note: "Emergency response team" },
                  { label: "iCall (Mental support)", number: "9152987821", note: "Mon–Sat 8 AM–10 PM" },
                ].map(h => (
                  <a key={h.label} href={`tel:${h.number.replace(/[^0-9+]/g, "")}`}
                    className="flex items-center justify-between py-2 px-3 border border-[rgba(192,132,252,0.12)] rounded-sm hover:bg-[rgba(192,132,252,0.06)] transition-colors group">
                    <div>
                      <div className="text-xs text-[#edeae4] group-hover:text-[#c084fc] transition-colors">{h.label}</div>
                      <div className="text-[9px] font-mono text-[#3a5270]">{h.note}</div>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#c084fc]">{h.number}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Emergency Services */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#e8433a]">🚨 Emergency Services</span>
                <div className="h-px flex-1 bg-[rgba(232,67,58,0.15)]" />
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "All Emergencies (Integrated)", number: "112", note: "Police · Fire · Ambulance" },
                  { label: "Police Control Room", number: "100", note: "Delhi Police" },
                  { label: "Ambulance / Medical", number: "108", note: "Free · Pan-India" },
                  { label: "Fire Brigade", number: "101", note: "Delhi Fire Service" },
                  { label: "Child Helpline", number: "1098", note: "CHILDLINE · 24×7" },
                ].map(h => (
                  <a key={h.label} href={`tel:${h.number}`}
                    className="flex items-center justify-between py-2 px-3 border border-[rgba(232,67,58,0.1)] rounded-sm hover:bg-[rgba(232,67,58,0.06)] transition-colors group">
                    <div>
                      <div className="text-xs text-[#edeae4] group-hover:text-[#e8433a] transition-colors">{h.label}</div>
                      <div className="text-[9px] font-mono text-[#3a5270]">{h.note}</div>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#e8433a]">{h.number}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* SETU Support */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#f5a623]">🛺 SETU Support</span>
                <div className="h-px flex-1 bg-[rgba(245,166,35,0.15)]" />
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "SETU Toll-Free Helpline", number: "1800-00-7388", note: "24×7 · Free from any phone" },
                  { label: "SETU WhatsApp Support", number: "+91-8001234567", note: "Send 'HELP' to start" },
                  { label: "Ride Complaint / SOS Follow-up", number: "1800-00-7388", note: "Press 2 after connect" },
                ].map(h => (
                  <a key={h.label} href={`tel:${h.number.replace(/[^0-9+]/g, "")}`}
                    className="flex items-center justify-between py-2 px-3 border border-[rgba(245,166,35,0.1)] rounded-sm hover:bg-[rgba(245,166,35,0.05)] transition-colors group">
                    <div>
                      <div className="text-xs text-[#edeae4] group-hover:text-[#f5a623] transition-colors">{h.label}</div>
                      <div className="text-[9px] font-mono text-[#3a5270]">{h.note}</div>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#f5a623]">{h.number}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Safety features */}
        <div className="space-y-4">
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-4">In-Vehicle Safety</div>
            <div className="space-y-3">
              {[
                { icon: "🎥", title: "CCTV Inside Cabin", desc: "4 cameras, encrypted cloud storage. Accessible only to police with warrant." },
                { icon: "🔘", title: "Under-Seat Panic Button", desc: "Silent SOS — triggers alert without alarming any perpetrator. GPS + police." },
                { icon: "📱", title: "Driver Verified", desc: "Aadhaar-linked licence, police clearance, refreshed every 6 months. Badge visible in cabin." },
                { icon: "🚦", title: "Speed Limiter", desc: "Hard-coded 25 km/h max — control centre notified if tampered." },
                { icon: "💬", title: "In-Trip Support", desc: "Tap 'SETU Support' in app or call toll-free from any phone during your ride." },
                { icon: "🧾", title: "Journey Receipt", desc: "Every trip auto-recorded with timestamp, route, driver ID. Available 30 days." },
              ].map(f => (
                <div key={f.title} className="flex gap-3 pb-3 border-b border-[rgba(245,166,35,0.06)]">
                  <span className="text-lg flex-shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <div className="font-semibold text-[#edeae4] text-sm mb-0.5" style={{ fontFamily: "Rajdhani, sans-serif" }}>{f.title}</div>
                    <p className="text-xs text-[#8aa4c8] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Women-specific */}
          <div className="bg-[#0c1d38] border border-[rgba(138,164,200,0.2)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-4">Women Travellers</div>
            <div className="space-y-3">
              {[
                { icon: "🔐", feat: "Women-Only vehicle option", sub: "All-women cabin, female driver, co-attendant after 8pm" },
                { icon: "🌙", feat: "Safe Night Return", sub: "Beacon-lit route, guaranteed female driver, contact auto-notified" },
                { icon: "💺", feat: "Reserved window seat", sub: "Closest to exit, CCTV-monitored, separate boarding lane" },
                { icon: "📍", feat: "Auto location share", sub: "Journey link sent to 2 contacts at ride start" },
              ].map(w => (
                <div key={w.feat} className="flex gap-3 py-2 border-b border-[rgba(138,164,200,0.06)]">
                  <span className="text-base">{w.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{w.feat}</div>
                    <div className="text-[11px] text-[#8aa4c8]">{w.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/book" className="mt-4 block w-full py-2.5 text-center border border-[rgba(138,164,200,0.3)] text-[#8aa4c8] text-sm font-bold rounded-sm hover:bg-[rgba(138,164,200,0.07)] transition-colors" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              BOOK WOMEN-ONLY VEHICLE →
            </Link>
          </div>
        </div>

        {/* Right: Emergency contacts + beacon map */}
        <div className="space-y-4">
          {/* Emergency contacts */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8]">Emergency Contacts</div>
              <button onClick={() => setAddingContact(!addingContact)}
                className="text-[11px] font-mono text-[#f5a623] hover:underline">
                {addingContact ? "Cancel" : "+ Add"}
              </button>
            </div>

            {addingContact && (
              <div className="mb-4 space-y-2 p-3 bg-[#050e1f] border border-[rgba(245,166,35,0.12)] rounded-sm">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (e.g. Priya — Sister)"
                  className="w-full bg-transparent border border-[rgba(245,166,35,0.15)] rounded-sm px-3 py-2 text-xs text-[#edeae4] placeholder-[#4a6280] outline-none focus:border-[#f5a623] transition-colors" />
                <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-transparent border border-[rgba(245,166,35,0.15)] rounded-sm px-3 py-2 text-xs text-[#edeae4] placeholder-[#4a6280] outline-none focus:border-[#f5a623] transition-colors" />
                <button onClick={addContact} className="w-full py-2 bg-[#f5a623] text-[#050e1f] text-xs font-bold rounded-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>SAVE CONTACT</button>
              </div>
            )}

            <div className="space-y-2">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-[#050e1f] border border-[rgba(245,166,35,0.07)] rounded-sm">
                  <div>
                    <div className="text-sm font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{c.name}</div>
                    <div className="text-[10px] font-mono text-[#8aa4c8]">{c.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleNotify(i)}
                      className={`text-[10px] font-mono px-2 py-1 rounded-sm border transition-colors ${c.notified
                        ? "border-[#38c172] text-[#38c172] bg-[rgba(56,193,114,0.08)]"
                        : "border-[rgba(245,166,35,0.2)] text-[#8aa4c8] hover:border-[rgba(245,166,35,0.4)]"}`}>
                      {c.notified ? "✓ ON" : "OFF"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#8aa4c8] mt-3">Contacts marked ON receive SMS at ride start + end. SOS sends to all contacts.</p>
          </div>

          {/* Beacon corridor */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Safety Beacon Network</div>
            <div className="bg-[#050e1f] rounded-sm p-4 mb-3">
              <svg viewBox="0 0 260 120" className="w-full">
                <line x1="20" y1="60" x2="240" y2="60" stroke="rgba(245,166,35,0.2)" strokeWidth="8" strokeLinecap="round" />
                {[20, 60, 100, 140, 180, 220].map((x, i) => (
                  <g key={i}>
                    <circle cx={x} cy="60" r="6" fill={i < 2 ? "#38c172" : "rgba(245,166,35,0.4)"} />
                    <circle cx={x} cy="60" r="10" fill="none" stroke={i < 2 ? "rgba(56,193,114,0.3)" : "rgba(245,166,35,0.15)"} strokeWidth="1" />
                    <text x={x} y="80" textAnchor="middle" fontSize="7" fill="rgba(138,164,200,0.6)" fontFamily="JetBrains Mono">{100 * i}m</text>
                  </g>
                ))}
                <text x="20" y="30" fontSize="8" fill="rgba(56,193,114,0.8)" fontFamily="Rajdhani">Metro Exit</text>
                <text x="200" y="30" fontSize="8" fill="rgba(245,166,35,0.8)" fontFamily="Rajdhani">Campus Gate</text>
                <circle cx="85" cy="60" r="5" fill="#f5a623">
                  <animateTransform attributeName="transform" type="translate" values="0,0;15,0;0,0" dur="3s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { icon: "🌞", text: "Solar-powered LED bollards every 100m on unlit corridors" },
                { icon: "🔴", text: "Panic button on each bollard — activates alarm + GPS alert" },
                { icon: "💡", text: "Auto-illuminate as SETU vehicle passes at night" },
                { icon: "📡", text: "Connected to SETU control centre and nearest police station" },
              ].map(b => (
                <div key={b.text} className="flex gap-2 text-[#8aa4c8]">
                  <span>{b.icon}</span><span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating prompt */}
          <div className="bg-[#0c1d38] border border-[rgba(245,166,35,0.12)] rounded-sm p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8aa4c8] mb-3">Rate Your Safety Experience</div>
            <p className="text-xs text-[#8aa4c8] mb-3">After every ride, rate how safe you felt. 1 poor report = driver reviewed within 24 hrs.</p>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} className="text-2xl hover:scale-110 transition-transform text-[#8aa4c8] hover:text-[#f5a623]">☆</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety features grid */}
      <div className="mt-10 border-t border-[rgba(245,166,35,0.1)] pt-10">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[#8aa4c8] mb-6">All Safety Features</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { icon: "🎥", label: "4-Camera CCTV" },
            { icon: "📡", label: "Live GPS Tracking" },
            { icon: "🆘", label: "One-Touch SOS" },
            { icon: "👮", label: "Police Integration" },
            { icon: "👩‍✈️", label: "Female Driver Option" },
            { icon: "🔒", label: "Aadhaar-Verified Drivers" },
            { icon: "🌙", label: "Safe Night Return" },
            { icon: "💡", label: "Beacon-Lit Corridors" },
            { icon: "📞", label: "24/7 Toll-Free Helpline" },
            { icon: "🧾", label: "Trip Records 30 Days" },
            { icon: "🚦", label: "Speed Limiter (25 km/h)" },
            { icon: "👥", label: "Emergency Contact Alerts" },
          ].map(f => (
            <div key={f.label} className="bg-[#0c1d38] border border-[rgba(245,166,35,0.08)] rounded-sm p-4 flex items-center gap-3 hover:border-[rgba(245,166,35,0.25)] transition-colors">
              <span className="text-xl">{f.icon}</span>
              <span className="text-xs font-semibold text-[#edeae4]" style={{ fontFamily: "Rajdhani, sans-serif" }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
