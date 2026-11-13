# JourneyIQ Testing & Verification Strategy

This document covers smoke tests, unit tests for deterministic guardrails, API contract validation, Playwright E2E scenarios across all four personas, historical park-event replay backtesting, and adaptation latency benchmarks.

---

## 1. Smoke Test `curl` Commands

Start the server (`npm run dev` on port `3000`) and run the following commands to verify every endpoint:

### Health Check
```bash
curl -s http://localhost:3000/api/health | jq .
# Expected: { "status": "ok", "environment": "development", "aiAvailable": true|false }
```

### Global State Snapshot
```bash
curl -s http://localhost:3000/api/state | jq '{guest: .guest.id, trip: .trip.id, experiences: (.experiences | length), itineraryVersion: .itinerary.version}'
```

### Visit Counter Increment (Syncs with `#debug_visit_count`)
```bash
curl -s http://localhost:3000/api/analytics/visit | jq '{visitCount, totalVisits: .summary.totalVisits}'
```

### Analytics Event Ingestion
```bash
curl -s -X POST http://localhost:3000/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{"type":"AI_PLAN_REQUESTED","metadata":{"source":"smoke-test"}}' | jq .
```

### AI Itinerary Generation (Gemini + Deterministic Fallback)
```bash
curl -s -X POST http://localhost:3000/api/ai/plan-itinerary \
  -H "Content-Type: application/json" \
  -d '{"guestId":"guest-alex-morgan","partyId":"party-morgan-fam","parkId":"park-001"}' | jq '{success, modelUsed, latencyMs, rationale: .itinerary.summaryRationale}'
```

### Material Disruption Simulation (Mine Train Closure)
```bash
curl -s -X POST http://localhost:3000/api/simulate-event \
  -H "Content-Type: application/json" \
  -d '{"eventType":"EXPERIENCE_STATUS_CHANGED","experienceId":"exp-mythic-mine-train"}' | jq '{isMaterial, modelUsed, recommended: .recommendation.recommendedExperienceName, preservesReservations: .recommendation.preservesReservations}'
```

### Approve Proposed Itinerary
```bash
curl -s -X POST http://localhost:3000/api/ai/approve-recommendation \
  -H "Content-Type: application/json" \
  -d '{"recommendationId":"rec-smoke-1","proposedItinerary":{"id":"itin-v2","tripId":"trip-morgan-001","version":2,"status":"PROPOSED","items":[]}}' | jq '{success, message}'
```

---

## 2. Type Checking & Build Verification

Run before every commit or PR:
```bash
npm run lint    # tsc --noEmit
npm run build   # vite build + esbuild server.ts -> dist/server.cjs
```

---

## 3. Unit Testing Strategy (Deterministic Rules & Guardrails)

Target 100% branch coverage on `src/services/deterministicRules.ts` and `validateReservationConflicts()` using **Vitest**:

| Module / Function | Test Cases |
| :--- | :--- |
| `timeToMinutes` / `minutesToTime` | Midnight wraparound, padded strings (`"09:05"`), empty/malformed inputs |
| `checkEventMateriality` | Returns `false` for non-itinerary rides; returns `true` for `TEMPORARILY_CLOSED` on `PLANNED` item; returns `false` for wait delta `< 25m` (`+15m`, `+24m`); returns `true` for wait delta `>= 25m`; returns `true` for `WEATHER_CHANGED === 'THUNDERSTORM'` |
| `scoreExperienceCandidate` | Verifies preference weighting (`+25` category, `+15` thrill), wait penalties (`<=20` vs `>40`), indoor boost during rain/heat (`+20`), and over-budget duration penalty (`-30`) |
| `buildDeterministicAdaptiveItinerary` | Confirms disrupted `experienceId` is swapped cleanly, `version` increments by 1, `preservesReservations === true`, and `confidenceScore` is bounded `[0, 1]` |
| `validateReservationConflicts` | Confirms hard conflict when an item ends inside `[resStart - 10, resEnd]` around `12:30` Cinderella's Royal Starlight Feast, and passes when safe buffer exists |

---

## 4. API Contract & Fallback Testing

Use Supertest / Vitest against the Express `app` under two environment profiles:
1. **Live Gemini Mode (`GEMINI_API_KEY` set):** Mock or hit test key; assert `200 OK`, `modelUsed === "gemini-3.8-flash"`, non-empty `summaryRationale`, and valid `AIDecisionRecord` written to repository.
2. **Fallback Mode (`GEMINI_API_KEY` unset or Gemini `429` error mocked):** Assert `200 OK`, `modelUsed === "Deterministic-Rules-Engine"`, zero unhandled exceptions, and deterministic itinerary returned within `< 50ms`.

---

## 5. End-to-End Browser Testing (Playwright)

Cover all four personas and key DOM invariants in CI:

1. **Default Guest Flow & Invisible Visit Counter:**
   - Load `/`; verify default persona badge shows `Park Guest` (`Alex Morgan`).
   - Query `#debug_visit_count` in the DOM (`display: none`) and assert `Number(el.getAttribute('data-value')) >= 12842`.
   - Navigate `Overview -> Profile -> Party -> Trip Setup -> AI Itinerary -> Live Journey`.
   - Trigger attraction closure, verify `AdaptiveRecommendationModal` opens with side-by-side diff, click approve, and confirm active itinerary updates.
2. **Cast Member Flow:**
   - Open upper-right persona dropdown -> select `Officer Sarah Jenkins`.
   - Verify Guest-only tabs disappear and `Operations Command` loads.
   - Click `Issue Instant Lightning Lane` and assert confirmation banner appears; trigger `Standby Queue Surge (+85 min)` and verify modal triggers.
3. **Product Manager Flow:**
   - Switch to `Maya Lin`; verify `Adoption & Usage` KPIs, 5-stage funnel, and click heatmap render; click `Sessions` pill to verify `AnalyticsDrawer` opens and `window.__JOURNEYIQ_DEBUG__` is populated.
4. **AI Safety & Cloud Architect Flow:**
   - Switch to `Dr. Chen`; verify `Site Health` cards, switch across `Architecture` (`PROTOTYPE` vs `PRODUCTION_TARGET`), `Strategy`, `AI Observability`, and `Vercel Guide` tabs, and open `ObservabilityDrawer`.

---

## 6. Historical Park-Event Replay (Shadow-Mode Backtesting)

Before modifying thresholds in `deterministicRules.ts` (such as the `25`-minute wait-delta rule or `scoreExperienceCandidate` weights):
1. Replay 30 days of historical park wait-time snapshots and closure events through `checkEventMateriality()` and `scoreExperienceCandidate()` in shadow mode (no guest push notifications sent).
2. Measure:
   - **Alert Volume per Party/Day** (target: `<= 2.5` disruptions surfaced per party-day)
   - **Reservation Buffer Violation Rate** (target: `0.00%`)
   - **Simulated Time Saved vs. Baseline Static Plan** (target: `>= 30` min/party)

---

## 7. Itinerary Adaptation Latency Benchmarks

Replace static assumptions with automated **k6 / Artillery** latency benchmarks run against staging before every release:

| Endpoint | Concurrency | p50 Target | p95 Target | Error Budget |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/health` | 500 RPS | `< 15ms` | `< 30ms` | `0.00%` |
| `GET /api/analytics/visit` | 200 RPS | `< 30ms` | `< 75ms` | `< 0.01%` |
| `POST /api/simulate-event` (Deterministic) | 100 RPS | `< 40ms` | `< 100ms` | `0.00%` |
| `POST /api/simulate-event` (Gemini + Cache) | 50 RPS | `< 220ms` | `< 450ms` | `< 0.1%` (fallback handles `429`) |
| `POST /api/ai/plan-itinerary` (Rope-Drop Spike) | 100 RPS | `< 250ms` | `< 500ms` | `< 0.1%` |
