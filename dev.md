# JourneyIQ Developer Guide

This guide helps developers navigate the JourneyIQ codebase, understand where state and business rules live, and safely extend components, personas, API routes, and storage adapters.

---

## 1. Architecture & Codebase Map

| Path | Responsibility |
| :--- | :--- |
| `server.ts` | Express server (`PORT = 3000`), all `/api/*` endpoints, `@google/genai` client + fallback handling, Vite dev middleware / `dist/` static hosting |
| `src/App.tsx` | Top-level SPA state, initial `/api/analytics/visit` call, persona-partitioned routing (`currentPersona` + `activeTab`), modals/drawers, and `#debug_visit_count` DOM node |
| `src/types.ts` | All TypeScript interfaces and union types (`Guest`, `Party`, `Trip`, `Experience`, `Itinerary`, `Recommendation`, `AIDecisionRecord`, `UserPersona`, etc.) |
| `src/services/deterministicRules.ts` | Pure TypeScript domain rules: `timeToMinutes`, `minutesToTime`, `checkEventMateriality`, `scoreExperienceCandidate`, `buildDeterministicAdaptiveItinerary`, `compareItineraries` |
| `src/domain/repositoryInterfaces.ts` | 11 repository contracts (`IGuestRepository` through `IAnalyticsRepository`) |
| `src/domain/mockRepository.ts` | Singleton `mockRepo` implementing all 11 repository contracts in memory |
| `src/domain/supabaseAdapter.ts` | Production adapter skeleton (`SupabaseRepositoryAdapter`) implementing the same 11 interfaces |
| `src/domain/repositoryFactory.ts` | `getActiveRepository(providerType)` factory switching between `'mock'` and `'supabase'` |
| `src/data/syntheticData.ts` | Seed data for Kingdom of Wonders (`park-001`), Alex Morgan (`guest-alex-morgan`), Morgan Family (`party-morgan-fam`), 12 experiences, reservations, weather, and itineraries |

---

## 2. UI Components & Pages

### Layout & Chrome (`src/components/`)

- `src/components/layout/Navbar.tsx`
  - Exports `TabId` union type and `PERSONAS` metadata map (`PARK_GUEST`, `CAST_MEMBER`, `PRODUCT_MANAGER`, `AI_CLOUD_ARCHITECT`).
  - Renders persona-filtered desktop tabs and mobile sub-bar buttons.
  - Renders the upper-right persona dropdown (`dropdownRef`) with click-outside dismissal.
- `src/components/analytics/AnalyticsDrawer.tsx`
  - Slide-over telemetry panel for Product Managers / Architects.
  - Sets `window.__JOURNEYIQ_DEBUG__` and logs debug telemetry to Chrome DevTools console.
- `src/components/observability/ObservabilityDrawer.tsx`
  - Slide-over AI governance drawer showing the 5-agent + guardrail topology and `AIDecisionRecord[]` audit trail.
- `src/components/clarifying/ClarifyingStrategyWidget.tsx`
  - Interactive selector for `ClarifyingStrategy` (`deployment`, `persistence`, `visibility`, `aiMode`).

### Pages & Modals (`src/pages/`)

| File | Active Personas | Purpose |
| :--- | :--- | :--- |
| `HomePage.tsx` | `PARK_GUEST` | Hero banner, trip overview, quick launch to Live Journey or disruption demo |
| `GuestProfilePage.tsx` | `PARK_GUEST` | Edit `GuestPreferences` (thrill, pace, crowd, dining, indoor, reservation lock) |
| `PartySetupPage.tsx` | `PARK_GUEST`, `CAST_MEMBER` | View/edit `PartyMember[]` roster and accessibility/shade notes |
| `TripSetupPage.tsx` | `PARK_GUEST` | Review must-dos, reservations, and call `onGeneratePlan()` |
| `ItineraryPage.tsx` | `PARK_GUEST` | Full 8-step time-blocked itinerary with reason codes and protection badges |
| `LiveJourneyPage.tsx` | `PARK_GUEST`, `CAST_MEMBER` | Live park radar, weather banner, disruption simulation triggers |
| `AdaptiveRecommendationModal.tsx` | `PARK_GUEST`, `CAST_MEMBER` | Side-by-side diff (`currentItinerary` vs `proposedItinerary`) + Approve/Decline actions |
| `TripSummaryPage.tsx` | `PARK_GUEST` | Post-trip summary of wait time saved and experiences completed |
| `FeedbackPage.tsx` | `PARK_GUEST` | Guest rating, tags, and freeform feedback form |
| `CastOperationsPage.tsx` | `CAST_MEMBER` | Operations KPIs, guest lookup, instant recovery pass/credit issuance, event simulator |
| `ProductManagerPage.tsx` | `PRODUCT_MANAGER` | Session KPIs, 5-stage conversion funnel, feature click heatmap, guest sentiment |
| `BusinessValuePage.tsx` | `PRODUCT_MANAGER` | Executive ROI breakdown (4 value pillars) |
| `CloudArchitectPage.tsx` | `AI_CLOUD_ARCHITECT` | Site health dashboard, deterministic guardrails, sub-tabs for Architecture/Strategy/Traces/Migration |
| `ArchitecturePage.tsx` | `AI_CLOUD_ARCHITECT` | Interactive 6-layer architecture visualizer (`PROTOTYPE` vs `PRODUCTION_TARGET`) |
| `ProductionGuidePage.tsx` | `AI_CLOUD_ARCHITECT` | 6-stage migration checklist + copyable PostgreSQL/RLS SQL and `vercel.json` |

---

## 3. Common Development Tasks

### Adding a New Page or Navigation Tab

1. Add the new tab identifier to `TabId` in `src/components/layout/Navbar.tsx`.
2. Add desktop and mobile tab buttons inside the appropriate `currentPersona === '...'` block in `Navbar.tsx`.
3. Create your page component under `src/pages/YourNewPage.tsx` using Tailwind CSS v4 utilities and the Vibrant Palette colors (`#0B2147` deep navy, `#081835` dark navy, `#FFD700` gold, `#00D1FF` electric cyan, `#F0F2F5` canvas).
4. Wire the conditional render in `src/App.tsx` under the matching `currentPersona === '...'` section so unauthorized personas cannot view it.

### Adding or Modifying a Persona

1. Extend the `UserPersona` union in `src/types.ts`.
2. Add the persona entry to `PERSONAS` in `src/components/layout/Navbar.tsx` (specify `defaultTab`, `badge`, `avatarBg`, `avatarText`).
3. Add the persona's nav tabs in `Navbar.tsx` and its view partition in `src/App.tsx`.
4. Note: In production, mirror this role in your JWT/Cognito claims and server-side RBAC middleware (`server.ts`).

### Updating Deterministic Guardrails or Scoring

All schedule-safety and scoring math lives in `src/services/deterministicRules.ts`:
- **Materiality threshold:** Update `checkEventMateriality()` (currently triggers on `TEMPORARILY_CLOSED`, wait delta `>= 25`, or `WEATHER_CHANGED === 'THUNDERSTORM'`).
- **Candidate scoring:** Update `scoreExperienceCandidate()` weights (category match `+25`, thrill match `+15`, low wait `<= 20m` `+25`, indoor fit `+20`, time-window fit `+15` / `-30`).
- **Reservation buffer:** Update `validateReservationConflicts()` in `src/domain/mockRepository.ts` (and keep matching SQL/DB constraints in sync).

### Adding a New Backend API Endpoint

1. Add the route in `server.ts` **before** the `startServer()` Vite/static catch-all middleware (lines 345-364).
2. Read/write domain objects through `mockRepo` (or `getActiveRepository()` from `src/domain/repositoryFactory.ts`).
3. If the endpoint calls Gemini via `getAIClient()`, always wrap the call in `try/catch` with a deterministic fallback and record an `AIDecisionRecord` via `mockRepo.saveDecisionRecord()`.
4. Document the new request/response schema in `docs/api-reference.md`.

### Swapping `MockRepository` for a Real Database Adapter

1. Implement all 11 interfaces from `src/domain/repositoryInterfaces.ts` in a new adapter (for example `src/domain/awsPostgresAdapter.ts` or completing `src/domain/supabaseAdapter.ts`).
2. Update `src/domain/repositoryFactory.ts` to select the adapter based on `process.env.DATA_PROVIDER` (`'mock' | 'supabase' | 'aws-postgres'`).
3. Replace direct `mockRepo` imports in `server.ts` with `getActiveRepository(process.env.DATA_PROVIDER)`.

---

## 4. Build, Lint & Verification Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts `tsx server.ts` on `http://localhost:3000` with Express + Vite middleware |
| `npm run lint` | Runs `tsc --noEmit` across the entire TypeScript codebase |
| `npm run build` | Builds frontend (`vite build` -> `dist/`) and bundles server (`esbuild server.ts` -> `dist/server.cjs`) |
| `npm start` | Runs the compiled production bundle (`node dist/server.cjs`) |
| `npm run clean` | Removes `dist/` and temporary server build artifacts |

---

## 5. Conventions & Gotchas

- **Port 3000 Required:** `server.ts` binds to `0.0.0.0:3000`. Keep Vite middleware mounted inside Express rather than running Vite standalone so `/api/*` routes resolve seamlessly.
- **No Secret Leakage:** `GEMINI_API_KEY` must only be accessed in `server.ts` (never prefix with `VITE_`).
- **HMR Disabled in AI Studio:** `vite.config.ts` respects `DISABLE_HMR=true`. Do not force-enable HMR watchers.
- **Keep `mockRepo` State Consistent:** Client `App.tsx` holds React state initialized from `src/data/syntheticData.ts` while `server.ts` holds `mockRepo`. When adding endpoints that mutate state, return the updated entity in the JSON response so `App.tsx` can sync its local React state.
