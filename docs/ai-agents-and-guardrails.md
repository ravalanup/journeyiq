# JourneyIQ Multi-Agent Orchestration & Deterministic Guardrails

JourneyIQ separates **probabilistic AI synthesis** (powered by `@google/genai` `gemini-3.8-flash`) from **deterministic schedule invariants** (`src/services/deterministicRules.ts`). The LLM enhances guest explanations and contextual reasoning, while deterministic TypeScript rules guarantee zero reservation conflicts, realistic walking physics, and calm alerting.

---

## 1. The 5-Agent Topology

Visible in the **AI Observability Drawer** (`src/components/observability/ObservabilityDrawer.tsx`) and logged in `AIDecisionRecord.agentsInvoked`:

| Agent | Workflow Role | Grounding Tools Used |
| :--- | :--- | :--- |
| **1. GuestContextAgent** | Loads guest preferences (pace, thrill level, indoor preference, dining priority) and party composition/ages | `getGuestContext`, `getParty` |
| **2. TripPlanningAgent** | Synthesizes initial 8-step balanced itinerary respecting park hours and hard dining/Lightning Lane windows | `getReservations`, `validateReservationConflicts` |
| **3. ExperienceOptimizationAgent** | Ranks candidate rides/shows using wait times, category match, indoor/outdoor weather fit, and remaining time budget | `getExperienceState`, `searchExperiences` |
| **4. RealTimeAdaptationAgent** | Evaluates incoming park disruptions against the materiality threshold and generates replacement proposals | `getExperienceState`, `evaluateItinerary`, `validateReservationConflicts` |
| **5. ActionAgent** | Applies itinerary version updates **only after explicit guest approval** (`requiresApproval: true`) | `saveItinerary`, `updateRecommendationStatus` |

---

## 2. Workflow 1: Initial Trip Planning (`POST /api/ai/plan-itinerary`)

1. Server retrieves `guest`, `party`, `experiences`, `experienceStates`, `reservations`, and `weather` from the repository.
2. If `GEMINI_API_KEY` is present, `gemini-3.8-flash` receives a grounded prompt summarizing pace, thrill preference, party composition, reservations, weather, and top 6 park experiences, returning a concise 2-sentence executive rationale.
3. If `GEMINI_API_KEY` is missing or the call fails, `server.ts` falls back to a deterministic rationale string and tags `model: "Deterministic-Rules-Engine"`.
4. An `AIDecisionRecord` (`workflow: "ITINERARY_GENERATION"`, `confidence: 0.96`) is persisted for Cloud Architect inspection.

---

## 3. Workflow 2: Real-Time Disruption Adaptation (`POST /api/simulate-event`)

```text
[OperationalEvent]
       |
       v
+----------------------------------------+
| Guardrail: checkEventMateriality()     |
| - Is ride on itinerary & PLANNED?      |
| - Closure OR Wait >= +25m OR Storm?    |
+----------------------------------------+
   | NO                              | YES
   v                                 v
Drop / Return                  Select Alternative (scoreExperienceCandidate)
isMaterial: false              Build Proposed Itinerary (version + 1)
(Zero Guest Fatigue)           Validate Dining Buffer (validateReservationConflicts)
                                     |
                                     v
                               Gemini Explanation (or Deterministic Fallback)
                                     |
                                     v
                               Return Recommendation (PENDING_REVIEW)
                               Guest Approves -> ActionAgent saves ACTIVE v(N+1)
```

---

## 4. The 3 Unbreakable Deterministic Guardrails

Displayed in `CloudArchitectPage.tsx` and enforced in `src/services/deterministicRules.ts` + `src/domain/mockRepository.ts`:

### Guardrail 1: Mandatory Dining & Hard-Reservation Protection
- Confirmed dining and Lightning Lane windows (`isHardConstraint: true`, e.g., `12:30` - `13:30` Cinderella's Royal Starlight Feast and `15:45` - `16:45` Cosmic Velocity: Star Fleet) cannot be overwritten or encroached upon.
- `validateReservationConflicts()` checks every planned item against confirmed reservations and flags any item ending within the pre-reservation buffer (`itemEnd > resStart - 10 && itemStart < resEnd`), maintaining a 15-minute arrival buffer.

### Guardrail 2: Physical Walking Physics & Time-Window Fit
- Every `ItineraryItem` tracks `walkingTimeFromPrevMinutes` across the 5 park zones (`Celestial Port`, `Fantasy Glade`, `Adventure Spire`, `Cosmic Tomorrow`, `Royal Promenade`).
- `scoreExperienceCandidate()` penalizes (`-30` points) any candidate whose `durationMinutes + waitMinutes + 10` exceeds `availableMinutes` before the next fixed anchor.

### Guardrail 3: Materiality Threshold (Anti-Alert-Fatigue)
- `checkEventMateriality()` prevents unnecessary guest interruptions:
  - Events affecting attractions **not** currently `PLANNED` on the guest's itinerary return `isMaterial: false`.
  - Standby queue changes `< 25` minutes return `isMaterial: false`.
  - Only unscheduled closures (`TEMPORARILY_CLOSED`), wait surges `>= +25` minutes, or severe thunderstorms (`THUNDERSTORM`) trigger an adaptive recommendation.

---

## 5. Candidate Scoring Formula (`scoreExperienceCandidate`)

Starting from base score `50`:

| Factor | Condition | Score Delta |
| :--- | :--- | :--- |
| Category Match | `preferences.favoriteCategories.includes(exp.category)` | `+25` |
| Thrill Match | `preferences.thrillLevel === exp.thrillLevel` | `+15` |
| Short Standby Wait | `state.waitMinutes <= 20` | `+25` |
| Moderate Standby Wait | `20 < state.waitMinutes <= 40` | `+10` |
| Long Standby Wait | `state.waitMinutes > 40` | `-15` |
| Weather Comfort | `isRainOrHeat` and `indoorOutdoor` is `INDOOR` or `HYBRID` | `+20` |
| Schedule Budget Fit | `durationMinutes + waitMinutes + 10 <= availableMinutes` | `+15` |
| Schedule Overflow | `durationMinutes + waitMinutes + 10 > availableMinutes` | `-30` |

Score is clamped to `Math.max(0, score)`.
