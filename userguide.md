# JourneyIQ User Guide - Personas, Visual Workflows & Programmatic Usage

JourneyIQ is built around **four distinct user personas** with role-scoped navigation, actions, and views. By default, the application opens as **Alex Morgan (Park Guest)**. You can switch to any of the other three personas at any time using the **upper-right persona dropdown** in the navigation bar (`src/components/layout/Navbar.tsx`).

---

## 1. Persona Overview

| Persona ID | Display Name | Default Tab | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `PARK_GUEST` | **Alex Morgan** (Park Guest) | `home` (Overview) | Trip setup, family party management, AI itinerary viewing, live radar, disruption approvals, and feedback |
| `CAST_MEMBER` | **Officer Sarah Jenkins** (Cast Member) | `cast_ops` (Operations Command) | In-park guest party lookup, crowd dispersal KPIs, service recovery pass/voucher issuance, and live incident simulation |
| `PRODUCT_MANAGER` | **Maya Lin** (Product Manager) | `pm_analytics` (Adoption & Usage) | Application visit analytics, 5-stage guest conversion funnel, click heatmaps, business ROI, and NPS/sentiment |
| `AI_CLOUD_ARCHITECT` | **Dr. Chen** (AI Safety & Cloud Architect) | `cloud_console` (Site Health & Console) | Edge API health, AI safety guardrails, 6-layer architecture explorer, deployment strategy, Vercel/cloud guide, and AI traces |

---

## 2. Visual Usage by Persona

### A. Park Guest (`PARK_GUEST` - Default)

Designed like a modern theme park consumer planner (Kingdom of Wonders):

1. **Overview (`home`):** View Alex Morgan's active trip summary, party of 4 (2 adults, 2 children aged 7 and 11), and launch directly into **Live Journey** or trigger a quick disruption demo.
2. **Profile (`profile`):** Configure thrill level (`LOW` | `MODERATE` | `HIGH` | `EXTREME`), pace (`RELAXED` | `MODERATE` | `INTENSIVE`), crowd/walking tolerance, dining preference, indoor preference during heat/rain, and reservation protection priority.
3. **Party (`party`):** Review or edit the Morgan Family roster (`member-1` through `member-4`), including children's heights, interests, and shade/mobility notes.
4. **Trip Setup (`trip`):** Review park operating hours (`09:00` - `22:00`), must-do attractions, confirmed reservations (including the hard-constrained `12:30 PM` Cinderella's Royal Starlight Feast and `15:45` Lightning Lane), and click to synthesize an itinerary via `POST /api/ai/plan-itinerary`.
5. **AI Itinerary (`itinerary`):** Inspect the 8-step time-blocked schedule with wait-time estimates, walking transitions, and reason codes (`MUST_DO_PRIORITY`, `HARD_RESERVATION_CONSTRAINT`, `LIGHTNING_LANE_LOCKED`).
6. **Live Journey (`live`):** View the active attraction (`10:15 AM` park clock), next scheduled step, protected dining countdown, and weather banner. Guests can also test disruption simulation buttons, which open the **Adaptive Recommendation Modal** showing a side-by-side comparison of the current vs. proposed itinerary and **Approve & Update Schedule** / **Keep Current Schedule** controls.
7. **Summary (`summary`) & Feedback (`feedback`):** Review end-of-day time saved and submit star ratings, tags, and freeform trip feedback.

---

### B. Cast Member & Park Operations (`CAST_MEMBER`)

Switch to **Officer Sarah Jenkins** from the upper-right dropdown:

1. **Operations Command (`cast_ops`):**
   - **KPI Strip:** Monitors `100% Protected` table-service dining, `74% Park Load` crowd dispersal across Fantasy Glade, Adventure Spire, and Cosmic Tomorrow, and `94% Approval` on adaptive reroutes.
   - **Guest Party Lookup:** Search active parties (default query: `Morgan`) to inspect current scheduled steps, party composition, and the `12:30 PM` dining lock.
   - **Service Recovery Station:** Issue an instant **Lightning Lane Recovery Pass** or **$25 F&B Recovery Credit** to the active party with immediate confirmation feedback.
   - **Operational Event Simulator:** Inject three realistic park incidents to trigger and observe the AI adaptation pipeline:
     - *Unscheduled Attraction Closure* (`EXPERIENCE_STATUS_CHANGED` on `exp-mythic-mine-train`)
     - *Standby Queue Surge (+85 min)* (`WAIT_TIME_CHANGED` on `exp-mythic-mine-train`)
     - *Severe Weather / Thunderstorm* (`WEATHER_CHANGED`)
2. **Party Roster (`party`):** Access and adjust the guest party roster for accessibility or guest-relations updates.
3. **Live Guest Radar (`live`):** View the guest's live journey timeline from an operations standpoint, including access to the AI Observability drawer.

---

### C. Product Manager (`PRODUCT_MANAGER`)

Switch to **Maya Lin** from the upper-right dropdown:

1. **Adoption & Usage (`pm_analytics`):**
   - Inspect **Total Application Sessions** (live `visitCount`), **Adaptive Acceptance Rate** (`94%`), **Avg Wait Time Saved / Party** (`42.5 min`), and **Dining Preservation Rate** (`100%`).
   - Review the **5-Stage Guest Journey Conversion Funnel** (Profile -> AI Itinerary -> Live Radar -> Disruption Encountered -> Alternative Accepted) and the **Live Feature Click Heatmap**.
2. **Business ROI (`business`):** Explore the 4 value pillars - Guest Experience & NPS Lift (`+18 Point Net Lift`), Demand Redistribution & Capacity, In-Park Commercial & Dining Protection, and Reduced Operational Recovery Cost.
3. **Guest Sentiment (`feedback` / Sentiment sub-tab):** Review `+74 NPS`, `4.9 / 5.0` average rating, `-68%` stress reduction, top sentiment tags, and verified guest quotes.
4. **Top-Right Sessions Pill:** Clicking the `Sessions` counter in the navbar (or `Telemetry` in the footer) opens the **Platform Telemetry & Analytics Drawer** (`AnalyticsDrawer.tsx`).

---

### D. AI Safety & Cloud Architect (`AI_CLOUD_ARCHITECT`)

Switch to **Dr. Chen** from the upper-right dropdown:

1. **Site Health & Console (`cloud_console`):**
   - **Telemetry Cards:** Edge API Status (`100% Operational`), p95 API Latency (`380 ms`), Gemini Engine connection status, and Error Rate (`0.00%`).
   - **AI Safety Guardrails:** Reviews the 3 deterministic invariants (15-min dining protection, physical walking distance matrix, 25-min wait materiality threshold).
   - **Sub-tabs:** Switch across `Site Health`, `Architecture`, `Strategy`, `AI Observability` (structured `AIDecisionRecord` traces with tools, model, latency, confidence), and `Vercel Guide`.
2. **6-Layer Architecture (`architecture`):** Toggle between **Current Prototype Mode** and **Production Target Mode** across Layers 1 through 6.
3. **Deployment Strategy (`strategy`):** Interactively toggle target deployment (`Vercel Serverless / Edge` vs. `Containerized Cloud Run / Node`), persistence (`Supabase / PostgreSQL` vs. `In-Memory / Synthetic Mock`), and analytics visibility (`Full Event Telemetry` vs. `Aggregated Pulse Mode`).
4. **Vercel Guide (`production`):** View the 6-stage migration checklist and copy PostgreSQL/RLS SQL and `vercel.json` snippets.
5. **AI Traces Button:** Located in the navbar and footer to open the **AI Observability Drawer** (`ObservabilityDrawer.tsx`) showing active multi-agent topology and redacted audit logs.

---

## 3. Chrome DevTools Verification (Invisible Visit Counter)

JourneyIQ embeds an invisible visit counter in the DOM and exposes telemetry on `window` for browser debugging:

1. Open JourneyIQ in Google Chrome (`http://localhost:3000`).
2. Press `F12` (or `Cmd+Option+I` on macOS) to open **Chrome DevTools**.
3. **Inspect the hidden DOM element** in the **Elements** tab or run in **Console**:
   ```javascript
   const el = document.getElementById('debug_visit_count');
   console.log('Visit count text:', el.textContent);
   console.log('Visit count data attribute:', el.dataset.value);
   ```
   The element is rendered in `src/App.tsx` as:
   ```html
   <div id="debug_visit_count" style="display: none" data-value="12843">12843</div>
   ```
4. **Inspect the global telemetry object** (populated when `AnalyticsDrawer` mounts):
   ```javascript
   window.__JOURNEYIQ_DEBUG__
   ```

---

## 4. Programmatic Usage (REST API)

External scripts, integration tests, or companion services can interact with JourneyIQ's Express backend directly.

### Check Health & Gemini Availability

```bash
curl -s http://localhost:3000/api/health
```

### Increment & Fetch Visit Analytics

```bash
curl -s http://localhost:3000/api/analytics/visit
```

### Record a Custom Feature Event

```bash
curl -s -X POST http://localhost:3000/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{"type":"SIMULATION_TRIGGERED","metadata":{"persona":"CAST_MEMBER","source":"cli"}}'
```

### Generate an AI-Optimized Itinerary

```bash
curl -s -X POST http://localhost:3000/api/ai/plan-itinerary \
  -H "Content-Type: application/json" \
  -d '{"guestId":"guest-alex-morgan","partyId":"party-morgan-fam","parkId":"park-001"}'
```

### Simulate a Park Disruption & Trigger Adaptation

```bash
curl -s -X POST http://localhost:3000/api/simulate-event \
  -H "Content-Type: application/json" \
  -d '{"eventType":"EXPERIENCE_STATUS_CHANGED","experienceId":"exp-mythic-mine-train"}'
```

### Approve the Proposed Itinerary

```bash
curl -s -X POST http://localhost:3000/api/ai/approve-recommendation \
  -H "Content-Type: application/json" \
  -d '{"recommendationId":"rec-mine-train-closure-001","proposedItinerary":{"id":"itin-v2","tripId":"trip-morgan-001","version":2,"status":"ACTIVE","items":[]}}'
```

For complete JSON schemas and deterministic scoring logic, see [docs/api-reference.md](docs/api-reference.md).
