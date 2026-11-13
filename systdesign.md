# JourneyIQ System Design & Production AWS Architecture

This document explains JourneyIQ's **6-layer modular architecture**, compares the current in-memory prototype against the production target, and details a **full-functionality AWS production architecture** beyond the current synthetic mock layer.

---

## 1. Architectural Principles

1. **Deterministic Guardrails Over Probabilistic Guessing:** LLMs (`gemini-3.8-flash`) are used for synthesis, reasoning, and human-friendly rationale generation, never as the sole authority on schedule feasibility. Hard constraints (dining locks, walking physics, materiality thresholds) are enforced deterministically in TypeScript (`src/services/deterministicRules.ts`).
2. **Graceful Degradation (100% Availability):** If `GEMINI_API_KEY` is missing, rate-limited (`429`), or unreachable, the server seamlessly falls back to `Deterministic-Rules-Engine` with zero user-facing errors.
3. **Repository Contract Abstraction:** All domain reads and writes flow through typed interfaces (`src/domain/repositoryInterfaces.ts`), decoupling business logic from `MockRepository` (`src/domain/mockRepository.ts`) so storage can swap cleanly to PostgreSQL/AWS RDS or Supabase (`src/domain/supabaseAdapter.ts`).
4. **Persona-Partitioned Presentation & RBAC:** Today's demo simulates four personas client-side in `App.tsx`; production enforces the same role boundaries server-side via JWT claims and database Row-Level Security (RLS).

---

## 2. The 6-Layer Modular Architecture

```text
+-----------------------------------------------------------------------------+
| LAYER 1: Presentation Layer (React 19 SPA / CloudFront + S3 or Vercel Edge) |
|  - Role-scoped UI (Park Guest, Cast Member, Product Manager, Architect)     |
|  - Adaptive Diff Modal, Analytics Drawer, Observability Drawer              |
+-----------------------------------------------------------------------------+
                                      | HTTPS / SSE / WebSocket
                                      v
+-----------------------------------------------------------------------------+
| LAYER 2: Deterministic Domain Services & Guardrails                         |
|  - checkEventMateriality() (>= 25m wait delta, closure, severe weather)     |
|  - validateReservationConflicts() (15m pre-reservation buffer lock)         |
|  - scoreExperienceCandidate() & buildDeterministicAdaptiveItinerary()       |
+-----------------------------------------------------------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------+
| LAYER 3: Multi-Agent Orchestrator                                           |
|  - GuestContextAgent -> TripPlanningAgent -> ExperienceOptimizationAgent    |
|  - RealTimeAdaptationAgent -> ActionAgent (Guest-approved mutations only)   |
|  - Gemini API (@google/genai) + automatic deterministic fallback            |
+-----------------------------------------------------------------------------+
                                      | Typed Function / Tool Calls
                                      v
+-----------------------------------------------------------------------------+
| LAYER 4: Domain Tools & Grounding Layer                                     |
|  - getGuestContext, getParty, getExperienceState, getReservations,          |
|    searchExperiences, evaluateItinerary, validateReservationConflicts       |
+-----------------------------------------------------------------------------+
                                      | Repository Interfaces (11 Contracts)
                                      v
+-----------------------------------------------------------------------------+
| LAYER 5: Repository Contract & Adapter Layer                                |
|  - Prototype: MockRepository (in-memory Maps seeded from syntheticData.ts)  |
|  - Production: PostgresRepositoryAdapter (AWS RDS / Aurora or Supabase)     |
+-----------------------------------------------------------------------------+
                                      | Event Streams & Identity
                                      v
+-----------------------------------------------------------------------------+
| LAYER 6: Enterprise Operational Ingress & IAM                               |
|  - Prototype: CastOps / LiveJourney simulation triggers + client persona    |
|  - Production: Amazon MSK / EventBridge + ElastiCache Redis + Cognito OIDC  |
+-----------------------------------------------------------------------------+
```

---

## 3. Current Prototype vs. Production Target

| Dimension | Current Demo Implementation | Production Target (AWS Full Functionality) |
| :--- | :--- | :--- |
| **Compute / Hosting** | Single Node/Express process (`server.ts`, port `3000`) serving API + Vite SPA | CloudFront + S3 for SPA; ECS Fargate (or App Runner / EKS) behind ALB for Express/API microservices |
| **Persistence** | `MockRepository` in-memory `Map`s (`src/domain/mockRepository.ts`); resets on restart | Amazon Aurora PostgreSQL (Multi-AZ) with RLS + Prisma/Drizzle or `pg` adapter implementing `repositoryInterfaces.ts` |
| **Caching & Live State** | In-memory `experienceStates` map | Amazon ElastiCache (Redis) for sub-5ms attraction wait times, ride status, and distributed rate limiting |
| **Authentication / RBAC** | Client-side `currentPersona` React state dropdown in `Navbar.tsx` | Amazon Cognito (OIDC/OAuth2 + MFA for Cast/Admins) issuing JWTs with `custom:persona` and `park_id` claims |
| **Operational Event Ingress** | Manual `POST /api/simulate-event` triggers from UI | Park turnstile/ride PLC telemetry ingested via AWS IoT Core / API Gateway -> Amazon MSK (Kafka) / EventBridge |
| **Guest Push Alerts** | Synchronous HTTP response opening `AdaptiveRecommendationModal` | API Gateway WebSockets / Server-Sent Events (SSE) + Amazon SNS / Pinpoint mobile push |
| **AI Orchestration** | Single-hop `ai.models.generateContent` (`gemini-3.8-flash`) with static fallback | Dedicated Orchestrator service on ECS with semantic caching in Redis, circuit breakers, and Bedrock/Gemini multi-provider failover |
| **Observability & Analytics** | In-memory `decisionRecords`, `featureClicks`, `#debug_visit_count` | AWS Distro for OpenTelemetry (ADOT) -> CloudWatch / Datadog, plus Firehose -> S3/Athena for PM funnels |

---

## 4. Production AWS Reference Architecture

```text
                        [Park Guests / Cast / PM / Architects]
                                          |
                                    HTTPS + WSS
                                          v
                           +-----------------------------+
                           | Amazon CloudFront + AWS WAF |
                           +-----------------------------+
                              /                       \
          Static Assets      /                         \  /api/* & /ws
                            v                           v
               +----------------------+      +---------------------------+
               | Amazon S3 (React SPA)|      | Application Load Balancer |
               +----------------------+      |  & API Gateway WebSocket  |
                                             +---------------------------+
                                                           |
                     +-------------------------------------+-------------------------------------+
                     |                                     |                                     |
                     v                                     v                                     v
      +-----------------------------+      +-------------------------------+      +-----------------------------+
      | Core Journey API (ECS Fargate)|     | Adaptation Worker (ECS/Lambda)|      | Telemetry & Analytics API   |
      | - Express/TypeScript        |      | - ConsumesMSK/EventBridge     |      | - Visit & Feature Events    |
      | - JWT RBAC Middleware       |      | - Runs Materiality & Rules    |      | - Redacted AI Decision Logs |
      | - Gemini Client + Fallback  |      | - Pushes WSS/SNS Alerts       |      | - Kinesis Firehose -> S3    |
      +-----------------------------+      +-------------------------------+      +-----------------------------+
             |               |                     |               |                             |
             v               v                     v               v                             v
   +------------------+ +-------------------+ +-----------------------+               +------------------+
   | ElastiCache Redis| | Amazon Aurora     | | Amazon MSK /          |               | Amazon S3 +      |
   | - Live Wait Times| | PostgreSQL (RLS)  | | EventBridge           |               | QuickSight /     |
   | - AI Semantic    | | - Guests, Parties | | - Ride Closure Stream |               | Athena           |
   |   Cache & Limits | | - Trips, Itins    | | - Weather Webhooks    |               +------------------+
   +------------------+ +-------------------+ +-----------------------+
```

---

## 5. AWS Component Breakdown (Beyond Mock)

### 5.1 Edge, Networking & Security
- **VPC Design:** Multi-AZ VPC with Public Subnets (ALB, NAT Gateways), Private App Subnets (ECS Fargate tasks, Lambda ENIs), and Isolated Data Subnets (Aurora PostgreSQL, ElastiCache Redis, MSK).
- **AWS WAF + CloudFront:** Protects `/api/ai/*` and `/api/analytics/*` with rate-based rules (e.g., max 60 AI plan requests/min per IP/user), geo-controls if needed, and TLS 1.3 termination.
- **AWS Secrets Manager:** Stores `GEMINI_API_KEY`, RDS credentials (with automatic rotation), and Cognito client secrets - injected into ECS task definitions at runtime, never committed to code.

### 5.2 Identity & Server-Side RBAC (Amazon Cognito)
- **User Pools & Groups:**
  - `park-guest` - scoped via RLS to `guest_id = auth.uid()` and their own `trip_id` / `party_id`.
  - `cast-member` - scoped to assigned `park_id` for guest lookup, operational event viewing, and service-recovery pass issuance.
  - `product-manager` - read-only access to aggregated/anonymized telemetry views (`analytics_summary`, `funnel_metrics`), blocked from raw guest PII.
  - `ai-cloud-architect` - access to `/api/health`, `ai_decision_records` (CoT-redacted), and infrastructure metrics.
- **API Authorization:** Express middleware validates the Cognito JWT signature via JWKS, attaches `req.user = { sub, persona, parkId }`, and passes `sub` into PostgreSQL session context (`SET LOCAL app.current_user_id = ...`) for RLS enforcement.

### 5.3 Real-Time Park Telemetry & Adaptation Pipeline
In the prototype, `CastOperationsPage` calls `POST /api/simulate-event` synchronously. In AWS production:
1. **Ingress:** Attraction PLC sensors, queue-camera estimators, and NWS/weather webhooks publish normalized events (`EXPERIENCE_STATUS_CHANGED`, `WAIT_TIME_CHANGED`, `WEATHER_CHANGED`) to **Amazon EventBridge** or **Amazon MSK** (`park-operational-events` topic).
2. **Materiality Filter Worker:** A stateless Lambda / ECS consumer runs `checkEventMateriality()` against active itineraries queried from Redis/Aurora. Non-material deltas (`< 25` min wait change or attractions not on active itineraries) are dropped immediately to prevent alert fatigue and unnecessary LLM spend.
3. **Adaptation & Guardrails:** For material events, the worker runs `scoreExperienceCandidate()`, builds a candidate replacement itinerary, verifies `validateReservationConflicts()` (15-min dining buffer) and walking-time matrices, and calls Gemini (with `Deterministic-Rules-Engine` fallback if Gemini times out > 2.5s or returns `429`).
4. **Guest Delivery & One-Tap Approval:** The resulting `Recommendation` (`PENDING_REVIEW`) is persisted to Aurora and pushed to the guest's device via **API Gateway WebSocket** (for open web/app sessions) and **Amazon SNS / Pinpoint** (mobile push). When the guest taps **Approve**, `POST /api/ai/approve-recommendation` performs an optimistic-concurrency version increment (`version = version + 1`) in Aurora inside a single ACID transaction.

### 5.4 Data Tier (Replacing `MockRepository`)
Create `src/domain/awsPostgresAdapter.ts` implementing the 11 interfaces in `src/domain/repositoryInterfaces.ts` using `pg` / Drizzle ORM connected to **Amazon Aurora PostgreSQL** (via RDS Proxy for connection pooling):
- **Transactional Tables:** `guests`, `parties`, `trips`, `reservations`, `itineraries` (versioned JSONB + indexed `trip_id`), `recommendations`, `feedback_submissions`.
- **Append-Only Audit / Telemetry:** `ai_decision_records` (partitioned monthly, S3 archival after 90 days) and `analytics_events` (streamed via **Kinesis Data Firehose** to S3 Parquet for Athena/QuickSight).
- **High-Churn Operational State:** `experience_states` cached in **ElastiCache Redis** (`HSET park:park-001:waits exp-mythic-mine-train ...`) with async write-through to Aurora.

### 5.5 Multi-Agent Orchestration & AI Safety in AWS
- **Primary Model:** Server-side `@google/genai` (`gemini-3.8-flash`) with a 2,500ms timeout and token budget cap (`maxOutputTokens: 300`).
- **Pre-LLM Redaction:** Strip `email`, `firstName`/`lastName`, and raw `PartyMember.name` before calling Gemini; pass anonymized descriptors (e.g., `"Family of 4 (2 adults, child 11, child 7)"`).
- **Semantic Caching:** Cache `plan-itinerary` narrative rationales in Redis keyed by `(park_id, pace, thrill_level, weather_severity, reservation_bucket)` for 15 minutes to reduce Gemini API costs during morning rope-drop spikes.
- **Observability:** Emit structured OpenTelemetry spans from Express and Adaptation Workers via **AWS Distro for OpenTelemetry (ADOT)** to CloudWatch Application Signals / X-Ray, recording `latencyMs`, `modelUsed`, `toolsUsed`, and `outcomeStatus` without ever logging raw chain-of-thought.

---

## 6. Deployment Comparison: Vercel vs. AWS

JourneyIQ's `CloudArchitectPage` and `ProductionGuidePage` also support a **Vercel + Supabase** serverless deployment path for rapid staging:
- **Choose Vercel + Supabase** for rapid demos, low-ops previews, and global edge static delivery (requires refactoring `server.ts` Express routes into Vercel `/api/*.ts` serverless functions).
- **Choose AWS (ECS Fargate + Aurora + MSK + Cognito)** for enterprise theme park scale: persistent WebSocket fan-out to tens of thousands of in-park guests, high-throughput IoT/turnstile Kafka streams, VPC isolation, and strict enterprise IAM/compliance governance.
