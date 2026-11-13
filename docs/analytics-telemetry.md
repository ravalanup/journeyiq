# JourneyIQ Analytics, Telemetry & Chrome Debug Contract

JourneyIQ captures visit counts, feature engagement clicks, conversion funnel metrics, and AI acceptance telemetry while enforcing strict role-based visibility so consumer **Park Guests** are never distracted by admin analytics.

---

## 1. Role-Based Visibility Rules

- **`PARK_GUEST`:** Telemetry footer shortcut, `AnalyticsDrawer`, and `ObservabilityDrawer` triggers are hidden (`currentPersona !== 'PARK_GUEST'` in `src/App.tsx`). However, the invisible `#debug_visit_count` DOM tag remains present for Chrome DevTools verification.
- **`PRODUCT_MANAGER`:** Sees the navbar `Sessions` counter pill, footer `Telemetry` link, `ProductManagerPage` (Adoption & Usage, Business ROI, Guest Sentiment), and can open `AnalyticsDrawer`.
- **`AI_CLOUD_ARCHITECT`:** Sees the footer `Telemetry` and `AI Traces` links, `CloudArchitectPage` (Site Health, `AIDecisionRecord` traces), and can open both `AnalyticsDrawer` and `ObservabilityDrawer`.
- **`CAST_MEMBER`:** Sees operational KPIs on `CastOperationsPage` and the footer `Telemetry` trigger.

---

## 2. Invisible Chrome DevTools Visit Counter

Implemented in `src/App.tsx` (lines 88-104 and 252-254):

1. On application mount, `App.tsx` calls `GET /api/analytics/visit`.
2. `server.ts` invokes `mockRepo.incrementVisitCount()` (seeded at `12842`, incrementing to `12843+`) and returns `{ visitCount, summary }`.
3. `App.tsx` renders an invisible DOM element outside the visual layout:
   ```tsx
   <div id="debug_visit_count" style={{ display: 'none' }} data-value={visitCount}>
     {visitCount}
   </div>
   ```
4. When `AnalyticsDrawer` (`src/components/analytics/AnalyticsDrawer.tsx`) mounts, it also attaches:
   ```ts
   window.__JOURNEYIQ_DEBUG__ = {
     websiteVisitCount: visitCount,
     featureClicks,
     acceptanceRatePct,
     timestamp: new Date().toISOString(),
     systemStatus: 'ONLINE_PROD_READY',
     activeTelemetryNodes: 12,
   };
   ```

### How to Inspect in Google Chrome

Open Chrome DevTools (`F12` / `Cmd+Option+I`) and run in the **Console** tab:
```javascript
document.getElementById('debug_visit_count').dataset.value
document.getElementById('debug_visit_count').textContent
window.__JOURNEYIQ_DEBUG__
```

---

## 3. Event Taxonomy (`AnalyticsEvent`)

Defined in `src/types.ts` and recorded via `POST /api/analytics/event`:

| Event Type | Trigger Source | Metadata Example |
| :--- | :--- | :--- |
| `PAGE_VIEW` | Initial load or route transition | `{ "tab": "live", "persona": "PARK_GUEST" }` |
| `SIMULATION_TRIGGERED` | Guest or Cast Member triggers disruption | `{ "eventType": "EXPERIENCE_STATUS_CHANGED", "experienceId": "exp-mythic-mine-train" }` |
| `AI_PLAN_REQUESTED` | Guest triggers Trip Setup synthesis | `{ "guestId": "guest-alex-morgan", "parkId": "park-001" }` |
| `RECOMMENDATION_ACCEPTED` | Guest clicks Approve in diff modal | `{ "recommendationId": "rec-..." }` |
| `RECOMMENDATION_REJECTED` | Guest declines proposed swap | `{ "recommendationId": "rec-..." }` |
| `ARCHITECTURE_TOGGLED` | Architect switches Prototype/Production view | `{ "mode": "PRODUCTION_TARGET" }` |
| `DEBUG_ACCESSED` | Telemetry / AI Traces drawer opened | `{ "persona": "AI_CLOUD_ARCHITECT" }` |

---

## 4. Client Feature Click Counters (`featureClicks`)

Tracked in `App.tsx` and displayed in `ProductManagerPage` ("Live Feature Click Heatmap") and `AnalyticsDrawer`:
- `plan_journey` (seeded: `148`, incremented on `handleGeneratePlan`)
- `simulate_closure` (seeded: `72`, incremented on `handleSimulateDisruption`)
- `view_diff` (seeded: `91`)
- `architecture_view` (seeded: `114`)
- Dynamic navigation keys: `tab_<tabId>` and `switch_to_<persona>`

---

## 5. Production Telemetry Pipeline (Beyond Mock)

In the current demo, `visitCount` and `featureClicks` reside in `MockRepository` memory and client React state. In production:
1. Replace `incrementVisitCount()` with an atomic Redis `INCR` (`journeyiq:visits:total`) backed by PostgreSQL daily rollups (`analytics_daily_summary`).
2. Stream `POST /api/analytics/event` payloads through **Amazon Kinesis Data Firehose** to **S3 Parquet**, queried by **Amazon Athena / QuickSight** to power live **Product Manager** conversion funnels without impacting transactional Aurora latency.
3. Deduplicate session visits using an HttpOnly session identifier so browser reloads do not over-count unique visits.
