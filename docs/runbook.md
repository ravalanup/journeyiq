# JourneyIQ Operational Runbook

This runbook provides step-by-step triage and mitigation playbooks for on-call engineers and AI Safety / Cloud Architects operating JourneyIQ in production.

---

## 1. Playbook: Gemini `429` Quota Exhaustion or API Outage

**Symptoms:**
- Server logs emit `Gemini call fallback:` or `Gemini adaptation call fallback:` warnings.
- `AIDecisionRecord.model` switches from `gemini-3.8-flash` to `Deterministic-Rules-Engine`.
- Elevated `429 RESOURCE_EXHAUSTED` or `503` responses from Google GenAI API.

**Built-In Automatic Mitigation:**
- `server.ts` wraps every `ai.models.generateContent()` call in `try/catch` and automatically falls back to deterministic template rationales + `buildDeterministicAdaptiveItinerary()`, keeping HTTP responses at `200 OK`.

**Immediate Triage Steps:**
1. Verify fallback health via `GET /api/health` (`status: "ok"`) and inspect recent `AIDecisionRecord` entries in **AI Safety & Cloud Architect -> AI Observability**.
2. Check Gemini API quota utilization and billing tier in Google Cloud / AI Studio console.
3. Verify Redis semantic cache hit ratio (target `>= 60%` for `plan-itinerary` rationales); if cache hit rate dropped, inspect cache TTL and key cardinality.
4. Enable `STRICT_DETERMINISTIC_FALLBACK=true` (if configured via feature flag / Secrets Manager) during prolonged upstream incidents to skip the 2.5s Gemini timeout wait and keep p95 latency under `50ms`.

**Post-Incident:**
- Request quota increase or implement multi-region Gemini endpoint routing; confirm `AIDecisionRecord.outcomeStatus` remained `SUCCESS` throughout.

---

## 2. Playbook: False-Positive Disruption / Alert-Fatigue Spikes

**Symptoms:**
- Surge in `Recommendation` records generated per active party (`> 3` alerts/hour).
- Drop in guest `RECOMMENDATION_ACCEPTED` rate below `85%` target (`ProductManagerPage`).
- Cast Members report guests receiving unnecessary swap prompts for minor wait fluctuations.

**Root Cause:**
- Sensor/queue-estimator jitter crossing the `checkEventMateriality()` threshold (`wait delta >= 25` minutes in `src/services/deterministicRules.ts`), or transient weather webhook oscillation.

**Immediate Triage Steps:**
1. Inspect recent `OperationalEvent` logs and filter by `isMaterial: true` to identify which attraction or event type (`WAIT_TIME_CHANGED` vs `WEATHER_CHANGED`) is spiking.
2. Check upstream queue-feed variance: if a single attraction is oscillating between `40m` and `68m` every 2 minutes, enable a 5-minute moving average / debounce window at the EventBridge/worker ingestion layer.
3. Temporarily raise the materiality delta threshold (e.g., from `25` minutes to `35` minutes) for `WAIT_TIME_CHANGED` events while preserving instant triggers for `TEMPORARILY_CLOSED` and `THUNDERSTORM`.
4. Suppress duplicate recommendations for the same `(tripId, affectedExperienceId)` within a 20-minute cooldown window.

---

## 3. Playbook: Bot / Endpoint Abuse & Visit-Counter Spam

**Symptoms:**
- Abnormal spike in `GET /api/analytics/visit` (`visitCount` / `#debug_visit_count` climbing rapidly) or `POST /api/ai/plan-itinerary` from a narrow set of IPs or headless user-agents.
- Elevated Express/ECS CPU or Gemini token burn without matching authenticated guest sessions.

**Immediate Triage Steps:**
1. Check CloudFront / AWS WAF or ALB access logs for top source IPs, ASNs, and `User-Agent` strings hitting `/api/analytics/visit` and `/api/ai/*`.
2. Verify WAF rate-based rule is active (block or CAPTCHA IPs exceeding `100 req / 5 min` on `/api/ai/*`).
3. Enforce JWT authentication on `POST /api/ai/*` and `POST /api/simulate-event` so unauthenticated callers receive `401 Unauthorized` before reaching `getAIClient()`.
4. Deduplicate `/api/analytics/visit` increments using a short-lived session cookie or Redis `HyperLogLog`/session key (`TTL 30m`) so page refreshes or scraper loops do not distort Product Manager KPIs.

---

## 4. Playbook: API Latency Triage (`p95 > 500ms`)

**Symptoms:**
- Cloud Architect `Site Health` dashboard or ADOT alerts report `p95` latency exceeding `500ms` (baseline target: `p50 ~180ms`, `p95 <= 380ms`).

**Triage Checklist:**
1. **Isolate the bottleneck span** in OpenTelemetry / X-Ray:
   - *Gemini upstream slow (`> 1,500ms`):* Enforce strict `AbortSignal.timeout(2500)` on `ai.models.generateContent()` so slow LLM responses fall back to `Deterministic-Rules-Engine` cleanly.
   - *PostgreSQL / RDS slow:* Check RDS Proxy connection pool saturation and missing indexes on `itineraries(trip_id, version)` or `experience_states(experience_id)`.
   - *Redis cache miss storm:* Check ElastiCache memory eviction (`evicted_keys`); ensure attraction catalog and experience states remain cached with short TTLs.
2. **Verify Express event loop health:** Confirm no synchronous JSON cloning of large arrays on the main thread and scale ECS Fargate task count if CPU > 70%.

---

## 5. Playbook: Hard Reservation Buffer Violation Incident

**Symptoms:**
- A guest or Cast Member reports an adaptive swap whose end time encroaches within 15 minutes of a `CONFIRMED` dining or Lightning Lane reservation (`isHardConstraint: true`, e.g., `12:30 PM` Cinderella's Royal Starlight Feast).

**Immediate Triage Steps:**
1. Pull the `AIDecisionRecord` and `Recommendation` (`id`, `itineraryVersion`, `toolsUsed`) from **AI Observability**.
2. Verify `validateReservationConflicts()` in `src/domain/mockRepository.ts` (or production Postgres adapter) executed and inspect why the buffer check passed (`itemEnd > resStart - 10 && itemStart < resEnd` vs walking transit time).
3. Account for walking transit time (`walkingTimeFromPrevMinutes`) between the swapped attraction's `zone` and `Royal Promenade` - ensure `itemEnd + walkingMinutes <= resStart - 15`.
4. Revert the affected trip's active itinerary to `version - 1` and issue a Cast Member recovery pass (`CastOperationsPage` Service Recovery) if the guest was impacted.
