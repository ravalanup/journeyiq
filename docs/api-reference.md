# JourneyIQ API Reference

Base URL (local development): `http://localhost:3000`
Content-Type: `application/json`

All backend endpoints are defined in `server.ts`. In the current prototype, data is backed by `MockRepository` (`src/domain/mockRepository.ts`). When `GEMINI_API_KEY` is configured, AI endpoints invoke `gemini-3.8-flash` via `@google/genai` and automatically fall back to deterministic rules on missing keys, errors, or rate limits.

---

## 1. Endpoint Summary

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health and Gemini availability |
| `GET` | `/api/state` | Full current domain snapshot for demo hydration |
| `GET` | `/api/analytics/visit` | Increments visit counter and returns analytics summary |
| `POST` | `/api/analytics/event` | Records a feature or navigation analytics event |
| `POST` | `/api/ai/plan-itinerary` | Generates itinerary rationale (Gemini + fallback) and logs AI decision |
| `POST` | `/api/simulate-event` | Injects closure/wait/weather event, checks materiality, builds adaptive plan |
| `POST` | `/api/ai/approve-recommendation` | Applies proposed itinerary as `ACTIVE` and marks recommendation `APPROVED` |

---

## 2. Endpoints & JSON Schemas

### `GET /api/health`

Checks Express server liveness and whether `GEMINI_API_KEY` is present in the environment.

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "environment": "development",
  "aiAvailable": true
}
```

---

### `GET /api/state`

Retrieves the active guest (`guest-alex-morgan`), party (`party-morgan-fam`), trip (`trip-morgan-001`), park experiences (`park-001`), live experience states, reservations, weather, active itinerary (`itin-v1-morgan`), analytics summary, and AI decision records.

**Response (`200 OK`):**
```json
{
  "guest": { "id": "guest-alex-morgan", "firstName": "Alex", "lastName": "Morgan", "preferences": {} },
  "party": { "id": "party-morgan-fam", "name": "The Morgan Family", "members": [] },
  "trip": { "id": "trip-morgan-001", "parkId": "park-001", "status": "ACTIVE" },
  "experiences": [],
  "experienceStates": {},
  "reservations": [],
  "weather": { "condition": "CLEAR", "temperatureF": 78, "severity": "NORMAL" },
  "itinerary": { "id": "itin-v1-morgan", "version": 1, "status": "ACTIVE", "items": [] },
  "analytics": { "totalVisits": 12843, "featureClicks": {}, "recommendationsCount": 4, "acceptanceRatePct": 88, "timeSavedTotalMinutes": 1240 },
  "decisions": []
}
```

**Error (`500 Internal Server Error`):**
```json
{ "error": "Error message" }
```

---

### `GET /api/analytics/visit`

Increments the server-side visit counter (`mockRepo.incrementVisitCount()`) and returns the updated counter plus summary metrics. Called on initial mount by `src/App.tsx` and synced into `#debug_visit_count`.

**Response (`200 OK`):**
```json
{
  "visitCount": 12843,
  "summary": {
    "totalVisits": 12843,
    "featureClicks": {
      "plan_journey": 148,
      "simulate_closure": 72,
      "simulate_spike": 45,
      "simulate_weather": 38,
      "view_diff": 91,
      "approve_recommendation": 86,
      "architecture_view": 114,
      "production_guide": 98
    },
    "recommendationsCount": 4,
    "acceptanceRatePct": 88,
    "timeSavedTotalMinutes": 1240
  }
}
```

---

### `POST /api/analytics/event`

Records a typed `AnalyticsEvent` (`PAGE_VIEW`, `SIMULATION_TRIGGERED`, `AI_PLAN_REQUESTED`, `RECOMMENDATION_ACCEPTED`, `RECOMMENDATION_REJECTED`, `ARCHITECTURE_TOGGLED`, `DEBUG_ACCESSED`).

**Request Body:**
```json
{
  "type": "SIMULATION_TRIGGERED",
  "metadata": {
    "persona": "CAST_MEMBER",
    "experienceId": "exp-mythic-mine-train"
  }
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "event": {
    "id": "evt-1780000000000-a1b2",
    "type": "SIMULATION_TRIGGERED",
    "metadata": {
      "persona": "CAST_MEMBER",
      "experienceId": "exp-mythic-mine-train"
    },
    "timestamp": "2026-11-13T14:22:00.000Z"
  }
}
```

---

### `POST /api/ai/plan-itinerary`

Invokes the Trip Planning pipeline (`GuestContextAgent`, `TripPlanningAgent`, `ExperienceOptimizationAgent`). Uses `gemini-3.8-flash` to synthesize a 2-sentence executive rationale grounded in guest preferences, party composition, reservations, weather, and top park experiences, falling back cleanly if Gemini is unavailable. Always persists an `AIDecisionRecord`.

**Request Body:**
```json
{
  "guestId": "guest-alex-morgan",
  "partyId": "party-morgan-fam",
  "parkId": "park-001",
  "priorities": ["FAMILY_ADVENTURE", "DARK_RIDE"]
}
```
*(All fields optional; defaults to Morgan Family at `park-001`.)*

**Response (`200 OK`):**
```json
{
  "success": true,
  "itinerary": {
    "id": "itin-v1-morgan",
    "tripId": "trip-morgan-001",
    "version": 1,
    "status": "ACTIVE",
    "generatedBy": "AI_TRIP_PLANNER",
    "summaryRationale": "JourneyIQ optimized your family day around protected lunch dining at Cinderella's Feast...",
    "estimatedTotalWaitMinutes": 145,
    "estimatedTotalWalkMiles": 3.2,
    "items": []
  },
  "latencyMs": 312,
  "modelUsed": "gemini-3.8-flash"
}
```
*(When Gemini is unavailable or errors out, `modelUsed` is `"Deterministic-Rules-Engine"`.)*

---

### `POST /api/simulate-event`

Simulates an operational park disruption, updates repository state (`ExperienceState` or `WeatherCondition`), evaluates materiality via `checkEventMateriality()`, and if material, builds a replacement itinerary + `Recommendation` via `buildDeterministicAdaptiveItinerary()` enriched with a Gemini explanation.

**Request Body:**
```json
{
  "eventType": "EXPERIENCE_STATUS_CHANGED",
  "experienceId": "exp-mythic-mine-train",
  "waitMinutes": 85,
  "weatherCondition": "THUNDERSTORM"
}
```

Supported `eventType` values:
- `EXPERIENCE_STATUS_CHANGED` - sets target experience status to `TEMPORARILY_CLOSED`.
- `WAIT_TIME_CHANGED` - updates `waitMinutes` (default `85`).
- `WEATHER_CHANGED` - sets park weather to `THUNDERSTORM` (`severity: "SEVERE"`).

**Response (`200 OK` - Non-Material Event):**
```json
{
  "isMaterial": false,
  "event": {
    "id": "op-1780000000000",
    "type": "WAIT_TIME_CHANGED",
    "entityId": "exp-hall-of-heroes-show",
    "entityName": "Great Hall of Legends Theater",
    "previousValue": 5,
    "newValue": 15,
    "isMaterial": false,
    "materialityReason": "Event on \"Great Hall of Legends Theater\" does not affect active planned itinerary items."
  },
  "message": "Event on \"Great Hall of Legends Theater\" does not affect active planned itinerary items."
}
```

**Response (`200 OK` - Material Disruption):**
```json
{
  "isMaterial": true,
  "event": {
    "id": "op-1780000000000",
    "timestamp": "2026-11-13T14:22:00.000Z",
    "type": "EXPERIENCE_STATUS_CHANGED",
    "entityId": "exp-mythic-mine-train",
    "entityName": "Seven Dwarfs Gemstone Mine",
    "previousValue": "OPEN",
    "newValue": "TEMPORARILY_CLOSED",
    "isMaterial": true,
    "materialityReason": "High Materiality: Planned experience \"Seven Dwarfs Gemstone Mine\" at 09:50 is temporarily closed."
  },
  "recommendation": {
    "id": "rec-1780000000000",
    "tripId": "trip-morgan-001",
    "itineraryVersion": 2,
    "trigger": "ATTRACTION_CLOSED",
    "actionType": "REPLACE_EXPERIENCE",
    "title": "Adaptive Itinerary Optimization",
    "narrativeExplanation": "...",
    "affectedExperienceId": "exp-mythic-mine-train",
    "recommendedExperienceId": "exp-pirate-cove-grotto",
    "reasonCodes": ["LOWER_WAIT", "PREFERENCE_MATCH", "PROTECTS_RESERVATIONS", "NEARBY_ZONE"],
    "estimatedTimeSavedMinutes": 20,
    "walkingImpactMinutes": -3,
    "preservesReservations": true,
    "confidenceScore": 0.94,
    "requiresApproval": true,
    "status": "PENDING_REVIEW"
  },
  "proposedItinerary": { "id": "itin-v2-...", "version": 2, "status": "PROPOSED", "items": [] },
  "latencyMs": 284,
  "modelUsed": "gemini-3.8-flash"
}
```

---

### `POST /api/ai/approve-recommendation`

Persists guest approval of a proposed itinerary, saves it with `status: "ACTIVE"`, updates the recommendation status to `"APPROVED"`, and records a `RECOMMENDATION_ACCEPTED` analytics event.

**Request Body:**
```json
{
  "recommendationId": "rec-1780000000000",
  "proposedItinerary": {
    "id": "itin-v2-1780000000000",
    "tripId": "trip-morgan-001",
    "version": 2,
    "status": "PROPOSED",
    "items": []
  }
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Simulated Action Complete: Itinerary successfully updated to latest version.",
  "activeItinerary": { "id": "itin-v2-1780000000000", "status": "ACTIVE" }
}
```

---

## 3. Deterministic Fallback & Scoring Rules

All deterministic rules live in `src/services/deterministicRules.ts` and `src/domain/mockRepository.ts`:

### A. Materiality Gate (`checkEventMateriality`)

An operational event is **material** (`isMaterial: true`) only if the entity is on the itinerary with `status === 'PLANNED'` (or severe weather occurs) AND one of:
- `EXPERIENCE_STATUS_CHANGED` where `newValue === 'TEMPORARILY_CLOSED'`
- `WAIT_TIME_CHANGED` where `newValue - previousValue >= 25` minutes
- `WEATHER_CHANGED` where `newValue === 'THUNDERSTORM'`

Otherwise `isMaterial: false` - preventing alert fatigue.

### B. Candidate Experience Scoring (`scoreExperienceCandidate`)

Base score starts at `50` (clamped to `>= 0`):
- `+25` if `preferences.favoriteCategories` includes `exp.category`
- `+15` if `preferences.thrillLevel === exp.thrillLevel`
- Wait-time modifier: `+25` if `waitMinutes <= 20`, `+10` if `<= 40`, `-15` if `> 40`
- `+20` if `isRainOrHeat` and `exp.indoorOutdoor` is `'INDOOR'` or `'HYBRID'`
- Window fit: `+15` if `durationMinutes + waitMinutes + 10 <= availableMinutes`, else `-30`

### C. Reservation Buffer Invariant (`validateReservationConflicts`)

For every `CONFIRMED` reservation (`resStart`, `resEnd`), any planned item overlapping `[resStart - 10, resEnd]` is flagged as a conflict (`hasConflict: true`) with an explanatory message, protecting hard-constrained dining such as the `12:30 PM` Cinderella's Royal Starlight Feast.

---

## 4. Error & Production Webhook Patterns

### Standard Error Response

All routes currently return HTTP `500` with `{ "error": "<message>" }` on unexpected exceptions. In production (Phase 2+), adopt structured error envelopes:

```json
{
  "error": {
    "code": "RESERVATION_CONFLICT",
    "message": "Proposed item overlaps protected 12:30 PM dining window.",
    "traceId": "otel-9f8e7d6c5b4a"
  }
}
```

Recommended HTTP status codes for production: `400` (schema validation), `401` (missing/expired JWT), `403` (persona lacks permission), `409` (optimistic itinerary version conflict), `429` (rate limit), `503` (dependency outage after fallback check).

### Planned Park Telemetry Webhook Pattern (Production Ingress)

When replacing `POST /api/simulate-event` with live park sensor/queue webhooks (`POST /api/webhooks/park-telemetry`):
- Verify HMAC-SHA256 signature (`X-JourneyIQ-Signature`) and timestamp (`<= 5` minutes skew).
- Enforce idempotency using `X-Idempotency-Key` / `event.id` cached in Redis (`TTL 24h`).
- Return `202 Accepted` immediately after enqueuing to Amazon EventBridge / MSK so upstream sensor mesh callers never wait on LLM processing.
