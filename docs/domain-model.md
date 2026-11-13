# JourneyIQ Domain Model & Schema Reference

All domain entities are defined in `src/types.ts`, seeded in `src/data/syntheticData.ts`, and accessed via the 11 repository interfaces in `src/domain/repositoryInterfaces.ts`.

---

## 1. Entity Relationship Overview

```text
Guest (1) --------< (N) Trip (1) -------- (1) Party (1) --------< (N) PartyMember
  |                      |
  |                      +--------< (N) Reservation (hard/soft constraints)
  |                      +--------< (N) Itinerary (versioned) --------< (N) ItineraryItem
  |                      +--------< (N) Recommendation (PENDING_REVIEW / APPROVED / DECLINED)
  |                      +--------< (N) GuestFeedback / FeedbackSubmission
  |
Park (1) ---------< (N) Experience (1) -------- (1) ExperienceState (live wait & status)
  +---------------< (N) WeatherCondition
  +---------------< (N) OperationalEvent

Telemetry & Governance:
  - AIDecisionRecord (workflow, agentsInvoked, toolsUsed, model, latencyMs, confidence)
  - AnalyticsEvent (type, metadata, timestamp)
  - ClarifyingStrategy (deployment, persistence, visibility, aiMode)
```

---

## 2. Core Entities & Seed Identifiers

| Entity | Type (`src/types.ts`) | Demo Seed ID (`syntheticData.ts`) | Key Fields |
| :--- | :--- | :--- | :--- |
| **Park** | `Park` | `park-001` ("Kingdom of Wonders") | `operatingHours` (`08:30` early, `09:00`-`22:00`), 5 themed `zones` |
| **Guest** | `Guest` | `guest-alex-morgan` (plus `elena-chen`, `marcus-vance`) | `preferences` (`thrillLevel`, `pace`, `crowdTolerance`, `walkingTolerance`, `diningPreference`, `indoorPreferenceInHeatOrRain`, `protectReservationsAboveAll`, `minimizeWaitsPriority`) |
| **Party** | `Party` | `party-morgan-fam` ("The Morgan Family") | 4 `members` (`Alex 38`, `Jordan 36`, `Leo 11`, `Maya 7`), `compositionSummary` |
| **Trip** | `Trip` | `trip-morgan-001` | `date` (`2026-09-03`), `arrivalTime` (`09:00`), `departureTime` (`21:30`), `status`, `mustDoExperienceIds`, `flexibleExperienceIds`, `currentItineraryId` |
| **Experience** | `Experience` | 12 experiences (e.g., `exp-mythic-mine-train`, `exp-pirate-cove-grotto`, `exp-royal-banquet-dining`, `exp-space-hypercoaster`) | `category` (9 enum types), `zone`, `thrillLevel`, `durationMinutes`, `minimumHeightInches`, `indoorOutdoor` (`INDOOR`/`OUTDOOR`/`HYBRID`), `fastPassEligible`, `reservationRequired` |
| **ExperienceState** | `ExperienceState` | `INITIAL_EXPERIENCE_STATES` | `status` (`OPEN`, `TEMPORARILY_CLOSED`, `DELAYED`, `OPENING_SOON`, `CLOSED`), `waitMinutes`, `lightningLaneAvailable`, `capacityStatus` |
| **Reservation** | `Reservation` | `res-dining-cinderella-001` (`12:30`-`13:30`), `res-ll-cosmic-002` (`15:45`-`16:45`) | `type` (`DINING`, `LIGHTNING_LANE`, `VIP_TOUR`, `SPECIAL_EVENT`), `startTime`, `endTime`, `partySize`, `status`, `isHardConstraint` |
| **WeatherCondition** | `WeatherCondition` | `INITIAL_WEATHER` (`CLEAR`, `78F`) | `condition` (`CLEAR`, `PARTLY_CLOUDY`, `RAIN`, `THUNDERSTORM`, `HEAT_ADVISORY`), `severity` (`NORMAL`, `MODERATE`, `SEVERE`), `alertMessage` |
| **Itinerary** | `Itinerary` | `itin-v1-morgan` (8 items) | `version`, `status` (`ACTIVE`, `SUPERSEDED`, `PROPOSED`), `generatedBy`, `summaryRationale`, `items: ItineraryItem[]` |
| **Recommendation** | `Recommendation` | `rec-mine-train-closure-001` | `trigger`, `actionType`, `affectedExperienceId`, `recommendedExperienceId`, `reasonCodes`, `estimatedTimeSavedMinutes`, `preservesReservations`, `confidenceScore`, `proposedItinerary` |
| **AIDecisionRecord** | `AIDecisionRecord` | `dec-init-plan-001` | `workflow`, `trigger`, `agentsInvoked`, `toolsUsed`, `model`, `latencyMs`, `confidence`, `decisionSummary`, `guestDecision`, `outcomeStatus` |
| **AnalyticsEvent** | `AnalyticsEvent` | Dynamic (`evt-*`) | `type` (`PAGE_VIEW`, `SIMULATION_TRIGGERED`, `AI_PLAN_REQUESTED`, `RECOMMENDATION_ACCEPTED`, `RECOMMENDATION_REJECTED`, `ARCHITECTURE_TOGGLED`, `DEBUG_ACCESSED`), `metadata` |

---

## 3. Production PostgreSQL Schema (Aurora / Supabase)

Extends the starter SQL shown in `ProductionGuidePage.tsx` with full domain coverage, foreign keys, and indexes:

```sql
CREATE TABLE guests (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  home_region TEXT,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  accessibility_needs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE parties (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  lead_guest_id TEXT REFERENCES guests(id) ON DELETE CASCADE,
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  composition_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  guest_id TEXT NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  party_id TEXT NOT NULL REFERENCES parties(id),
  park_id TEXT NOT NULL,
  trip_date DATE NOT NULL,
  arrival_time TIME NOT NULL,
  departure_time TIME NOT NULL,
  status TEXT NOT NULL,
  must_do_experience_ids TEXT[] DEFAULT '{}',
  flexible_experience_ids TEXT[] DEFAULT '{}',
  current_itinerary_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reservations (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  experience_id TEXT NOT NULL,
  experience_name TEXT NOT NULL,
  res_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  party_size INT NOT NULL,
  status TEXT NOT NULL,
  is_hard_constraint BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE itineraries (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  guest_id TEXT NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  generated_by TEXT NOT NULL,
  summary_rationale TEXT,
  estimated_total_wait_minutes INT DEFAULT 0,
  estimated_total_walk_miles NUMERIC(4,2) DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_itineraries_trip_version ON itineraries(trip_id, version);

CREATE TABLE recommendations (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  itinerary_version INT NOT NULL,
  trigger_type TEXT NOT NULL,
  action_type TEXT NOT NULL,
  affected_experience_id TEXT NOT NULL,
  recommended_experience_id TEXT NOT NULL,
  estimated_time_saved_minutes INT NOT NULL,
  preserves_reservations BOOLEAN NOT NULL DEFAULT TRUE,
  confidence_score NUMERIC(3,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  payload JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_decision_records (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  workflow TEXT NOT NULL,
  trigger_label TEXT NOT NULL,
  agents_invoked TEXT[] NOT NULL,
  tools_used TEXT[] NOT NULL,
  model TEXT NOT NULL,
  latency_ms INT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL,
  decision_summary TEXT NOT NULL,
  guest_decision TEXT,
  outcome_status TEXT NOT NULL
);

CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
