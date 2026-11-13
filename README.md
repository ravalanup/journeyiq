# JourneyIQ - AI-Powered Theme Park Guest Journey Intelligence

JourneyIQ is an adaptive theme park trip-planning and real-time operational intelligence platform built with React 19, TypeScript, Tailwind CSS, Express, and the Google GenAI SDK (`@google/genai`). Inspired by modern theme park guest experiences (such as My Disney Experience), it pairs Gemini-powered multi-agent reasoning with an unbreakable deterministic rules engine so family itineraries adapt in real time to ride closures, standby queue surges, and severe weather while strictly protecting confirmed dining and Lightning Lane reservations.

---

## Key Capabilities

- **Four Role-Based Personas (RBAC Simulation):** Default login as **Park Guest** with an upper-right persona switcher in the navigation bar for **Cast Member & Park Operations**, **Product Manager**, and **AI Safety & Cloud Architect**.
- **Adaptive Itinerary Generation & Re-Planning:** Synthesizes balanced family schedules (`POST /api/ai/plan-itinerary`) and evaluates real-time operational disruptions (`POST /api/simulate-event`) with side-by-side itinerary diffs and guest approval (`POST /api/ai/approve-recommendation`).
- **Deterministic Guardrails & Fallback Engine:** Enforces hard constraints independently of LLM output - including a 15-minute pre-reservation buffer, walking-time physics, and a 25-minute wait-spike materiality threshold - and falls back to `Deterministic-Rules-Engine` if `GEMINI_API_KEY` is absent or rate-limited.
- **Live Analytics & Invisible Chrome Debug Telemetry:** Tracks application visits and feature interactions, exposes an Analytics Drawer (`window.__JOURNEYIQ_DEBUG__`), and embeds an invisible DOM counter at `#debug_visit_count` for Chrome DevTools verification.
- **6-Layer Decoupled Repository Architecture:** Separates presentation, deterministic rules, multi-agent orchestration, domain tools, repository contracts (`MockRepository` / `SupabaseRepositoryAdapter`), and operational ingress so the prototype maps directly to AWS or Vercel production deployments.

---

## Tech Stack

- **Frontend:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React, Motion
- **Backend:** Node.js + Express 4 (`server.ts`) serving API routes and Vite middleware in development (or `dist/` in production)
- **AI Engine:** `@google/genai` (`gemini-3.8-flash`) with deterministic fallback rules (`src/services/deterministicRules.ts`)
- **Data Layer:** In-memory `MockRepository` (`src/domain/mockRepository.ts`) behind repository interfaces (`src/domain/repositoryInterfaces.ts`), with `SupabaseRepositoryAdapter` (`src/domain/supabaseAdapter.ts`) stubbed for PostgreSQL/RLS

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and set your Gemini API key (optional - if omitted, the server automatically uses the deterministic rules fallback):

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```

### 3. Run the Full-Stack Dev Server

```bash
npm run dev
```

The server starts on `http://localhost:3000` (Express API + Vite SPA middleware).

### 4. Type Check & Production Build

```bash
npm run lint
npm run build
npm start
```

---

## Project Structure

```text
.
|-- server.ts                         # Express server, API routes, Gemini integration, Vite/static serving
|-- index.html                        # SPA entry point
|-- metadata.json                     # App metadata & capabilities
|-- package.json                      # Scripts (dev, build, start, lint, clean)
|-- src/
|   |-- App.tsx                       # Central state, persona RBAC routing, #debug_visit_count DOM element
|   |-- types.ts                      # Core TypeScript domain & persona types
|   |-- data/syntheticData.ts         # Kingdom of Wonders seed park, guests, party, experiences, itineraries
|   |-- domain/
|   |   |-- repositoryInterfaces.ts   # 11 repository contracts (Guest, Party, Trip, Itinerary, Analytics, etc.)
|   |   |-- mockRepository.ts         # In-memory seeded implementation of all repository contracts
|   |   |-- supabaseAdapter.ts        # PostgreSQL/Supabase adapter skeleton
|   |   `-- repositoryFactory.ts      # Provider selector ('mock' | 'supabase')
|   |-- services/
|   |   `-- deterministicRules.ts     # Materiality check, candidate scoring, deterministic swap & diff logic
|   |-- components/
|   |   |-- layout/Navbar.tsx         # Persona-filtered tabs + upper-right persona switcher dropdown
|   |   |-- analytics/AnalyticsDrawer.tsx
|   |   |-- observability/ObservabilityDrawer.tsx
|   |   `-- clarifying/ClarifyingStrategyWidget.tsx
|   `-- pages/                        # Persona-specific pages & modals (Home, LiveJourney, CastOps, PM, CloudArchitect)
`-- docs/                             # Engineering, API, security, operations, testing, and domain documentation
```

---

## API Overview

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health, environment, and Gemini availability check |
| `GET` | `/api/state` | Retrieves full seeded/active domain state for the demo session |
| `GET` | `/api/analytics/visit` | Increments visit counter and returns analytics summary |
| `POST` | `/api/analytics/event` | Records a typed `AnalyticsEvent` (`PAGE_VIEW`, `SIMULATION_TRIGGERED`, etc.) |
| `POST` | `/api/ai/plan-itinerary` | Generates itinerary summary rationale via Gemini (or deterministic fallback) + decision record |
| `POST` | `/api/simulate-event` | Injects attraction closure, wait surge, or weather event; runs materiality + adaptation |
| `POST` | `/api/ai/approve-recommendation` | Applies proposed itinerary version as `ACTIVE` and records guest acceptance |

---

## Documentation Index

- **[User Guide](userguide.md)** - Walkthrough of all 4 personas, UI workflows, Chrome DevTools debug inspection, and programmatic API usage.
- **[System Design & AWS Architecture](systdesign.md)** - 6-layer architecture, sequence flows, and full production AWS deployment blueprint beyond the in-memory mock.
- **[Developer Guide](dev.md)** - Codebase map, component contracts, how to add tabs/personas/routes, and repository swapping.
- **[API Reference](docs/api-reference.md)** - Exact JSON request/response schemas, deterministic scoring rules, and error patterns.
- **[Domain Model](docs/domain-model.md)** - Entity schemas, relationships, synthetic dataset IDs, and PostgreSQL DDL.
- **[AI Agents & Guardrails](docs/ai-agents-and-guardrails.md)** - Multi-agent orchestration, prompt design, fallback behavior, and hard invariants.
- **[Analytics & Telemetry](docs/analytics-telemetry.md)** - Visit counting, `#debug_visit_count`, `window.__JOURNEYIQ_DEBUG__`, and funnel metrics.
- **[Security & Compliance](docs/security-compliance.md)** - Pre-LLM PII/CoT redaction, server-side RBAC migration, COPPA/family data protection, and secret handling.
- **[Operational Runbook](docs/runbook.md)** - Playbooks for Gemini 429 quota failover, alert-fatigue tuning, abuse mitigation, and latency triage.
- **[Testing Strategy](docs/testing.md)** - `curl` smoke tests, deterministic unit tests, Playwright persona E2E, event-replay backtesting, and latency benchmarks.
- **[Delivery Roadmap](docs/roadmap.md)** - Prototype-to-production gap matrix and 4-phase engineering rollout plan.
