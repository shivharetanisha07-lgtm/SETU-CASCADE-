# SETU

**Bridging the Gap, One Ride at a Time**

**जो दूरी बाकी है, वो SETU करेगा**

SETU is a customer-facing prototype for safe, affordable, and inclusive last-mile mobility in India. It connects commuters from metro stations, bus stops, railway stations, campuses, and peri-urban transit hubs to their final destination through shared rides, assisted booking, multilingual kiosks, WhatsApp, QR codes, and UPI.

The current prototype focuses on Delhi routes and also incorporates the TransitLink concept for demand-responsive shuttle pooling around peri-urban stops and campuses such as VIT-AP.

## Highlights

- Six responsive pages: Home, Book, Vehicles, Track, Safety, and Kiosk
- Standard, QR/WhatsApp, and scripted voice-demo booking flows
- Shared, priority, women-only, accessible, and private vehicle options
- Live-trip tracking and safety interactions
- Multilingual, low-literacy kiosk simulation
- Cash, UPI, NCMC, pass, institutional, and BPL-friendly payment concepts
- Real Unsplash photography and a deep navy/saffron visual system
- QR generation with `qrcode.react`

> This is a demonstration prototype. Routes, fares, contact details, availability, tracking data, and bookings are simulated unless explicitly connected to production services.

## Repository structure

```text
.
├── frontend/             # React website and customer-facing UI
│   ├── src/
│   │   ├── app/          # Router configuration
│   │   ├── components/   # Shared layout and interaction components
│   │   └── pages/        # Home, booking, vehicles, tracking, safety, kiosk
│   └── index.html
├── backend/              # API boundary and future backend notes
├── docs/                 # Problem statement and solution documentation
├── screenshots/          # Prototype image guidance and captures
├── package.json          # Root development scripts and dependencies
├── vite.config.ts        # Vite, React, and Tailwind configuration
└── README.md
```

## Tech stack

- React 19
- React Router
- TypeScript
- Vite
- Tailwind CSS 4
- `qrcode.react`

## Run locally

### Prerequisites

- Node.js 22
- pnpm 10

### Installation

```bash
git clone <your-repository-url>
cd cascade-sih-2026
pnpm install
pnpm dev
```

Open the local URL printed by Vite.

### Production build

```bash
pnpm build
pnpm preview
```

The production output is written to `frontend/dist/`.

## Available routes

| Route | Purpose |
| --- | --- |
| `/` | Product overview, Delhi pilot routes, and quick booking |
| `/book` | Multi-step booking, QR/WhatsApp, and voice demo |
| `/vehicles` | Vehicle categories and accessibility options |
| `/track` | Simulated live ride and route tracking |
| `/safety` | SOS controls, trusted contacts, and helplines |
| `/kiosk` | Multilingual smart-kiosk booking simulation |

## Documentation

- [Problem statement](docs/problem-statement.md)
- [Solution and architecture](docs/solution.md)
- [Backend boundary](backend/README.md)
- [Screenshot guide](screenshots/README.md)

## Suggested next steps

1. Connect route, booking, and vehicle availability data to a backend.
2. Replace prototype WhatsApp and helpline values with verified production numbers.
3. Integrate a mapping provider and real-time driver telemetry.
4. Add authentication, consent, payment verification, and privacy controls.
5. Test accessibility and multilingual flows with target users.

## License

No license has been selected yet. Add a `LICENSE` file before distributing or accepting external contributions.
