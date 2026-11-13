# JourneyIQ Engineering Delivery Roadmap

This roadmap tracks the gap between the current JourneyIQ demo prototype and a multi-tenant, production-ready enterprise deployment (targeting AWS and/or Vercel Edge).

---

## 1. Prototype-to-Production Gap Matrix

| Area | Current Prototype State | Target Production State | Engineering Gap |
| :--- | :--- | :--- | :--- |
| **Data Persistence** | In-memory `MockRepository` (`Map`s seeded from `syntheticData.ts`); data resets on process restart | Amazon Aurora PostgreSQL (or Supabase) with Row-Level Security (RLS) + ElastiCache Redis for live waits | Implement `PostgresRepositoryAdapter`, run DDL migrations, switch `repositoryFactory.ts` |
| **Authentication & RBAC** | Client-side persona dropdown (`currentPersona` in `App.tsx`); anyone can switch roles | Amazon Cognito / OIDC JWT authentication with server-side RBAC middleware and RLS tenant isolation | Add JWT verification middleware in `server.ts`, remove client-only trust, enforce per-role routes |
| **State Synchronization** | `App.tsx` maintains local React state alongside server `mockRepo` | Server-authoritative state with optimistic version locking (`version = version + 1`) | Unify client fetches via React Query/SWR and enforce version checks on `approve-recommendation` |
| **Operational Event Ingress** | Manual trigger buttons on `LiveJourneyPage` and `CastOperationsPage` | Automated park turnstile/ride status streams via EventBridge/MSK + signed webhooks | Build authenticated webhook ingress, idempotency deduplication, and background worker consumers |
| **Real-Time Guest Delivery** | Synchronous HTTP response modal | WebSockets / Server-Sent Events (SSE) + mobile push (SNS / Pinpoint / APNs / FCM) | Add SSE/WebSocket gateway and background notification dispatcher |
| **AI Reliability & Safety** | Direct `@google/genai` call in `server.ts` with fallback string | Pre-LLM PII redaction, Redis semantic cache, circuit breaker, structured JSON output validation | Add PII scrubber, Zod schema validation on Gemini output, and 2.5s timeout budget |
| **Observability & Analytics** | In-memory `decisionRecords` and `visitCount` (`#debug_visit_count`) | OpenTelemetry traces (ADOT/Datadog), persistent analytics warehouse (Firehose -> S3/Athena) | Instrument OTEL spans, export structured logs, replace in-memory counters with atomic Redis/DB counters |
| **Testing & CI/CD** | Manual verification + `tsc --noEmit` + `vite build` | Automated Vitest unit/contract suite, Playwright E2E across 4 personas, GitHub Actions CI/CD | Add test runner, CI pipeline, staging environment, and canary smoke checks |

---

## 2. 4-Phase Engineering Delivery Roadmap

### Phase 1: Persistent Foundation & Server-Side Auth (Weeks 1-3)
**Goal:** Eliminate volatile in-memory state and lock down persona boundaries server-side.
- Provision PostgreSQL (AWS RDS/Aurora or Supabase) and execute schema migrations (`guests`, `parties`, `trips`, `experiences`, `experience_states`, `reservations`, `itineraries`, `recommendations`, `ai_decision_records`, `analytics_events`).
- Enable PostgreSQL Row-Level Security (RLS) policies on `guests`, `parties`, `trips`, and `itineraries`.
- Implement the production repository adapter behind `src/domain/repositoryInterfaces.ts` and configure `repositoryFactory.ts` via `DATA_PROVIDER`.
- Integrate OIDC/Cognito JWT authentication and server-side RBAC middleware protecting Cast Member, Product Manager, and Architect APIs.
- Stand up `vitest` unit tests covering 100% of `src/services/deterministicRules.ts`.

### Phase 2: Hardened AI Pipeline & Real-Time Event Ingress (Weeks 4-6)
**Goal:** Replace manual simulation triggers with scalable, resilient event-driven adaptation.
- Add Zod validation around all API request bodies and structured Gemini responses.
- Implement pre-LLM PII redaction (`email`, full names) and enforce `2,500ms` timeout + automatic `Deterministic-Rules-Engine` circuit breaker.
- Add ElastiCache Redis for live `ExperienceState` wait times, semantic rationale caching, and per-IP/user rate limiting on `/api/ai/*`.
- Implement signed telemetry webhook (`POST /api/webhooks/park-telemetry`) feeding an EventBridge/MSK materiality worker.
- Deliver real-time adaptation alerts to active clients over WebSockets / SSE with optimistic version conflict handling.

### Phase 3: Enterprise Observability, Analytics & Compliance (Weeks 7-8)
**Goal:** Provide production-grade Product Manager analytics, Architect trace auditing, and child-privacy compliance.
- Wire OpenTelemetry (ADOT) SDK into Express and background workers, exporting latency percentiles (`p50`/`p95`/`p99`), Gemini `429`/fallback rates, and tool-invocation spans.
- Stream `AnalyticsEvent` records to persistent storage (PostgreSQL + S3 Parquet/Athena) and wire `ProductManagerPage` to live aggregated queries instead of synthetic constants.
- Implement COPPA/GDPR consent & data-retention workflows for minor `PartyMember` profiles and 90-day audit log archival.
- Add Playwright E2E suite verifying all 4 personas, modal diffs, and `#debug_visit_count` in CI.

### Phase 4: Production Cutover, Load Testing & Multi-Park Scale (Weeks 9-10)
**Goal:** Validate peak park-opening ("rope-drop") traffic and deploy to production AWS / Vercel.
- Run k6 / Artillery load tests simulating 10,000+ concurrent morning itinerary requests and mass thunderstorm outdoor-closure surges (`< 500ms` p95 fallback SLA).
- Replay 30 days of historical park wait-time logs in shadow mode to tune `checkEventMateriality()` (`>= 25m` threshold) and minimize guest alert fatigue.
- Configure Infrastructure as Code (Terraform / AWS CDK) with multi-AZ failover, WAF rules, and automated rollback alarms.
- Execute progressive rollout (10% -> 50% -> 100% park guests) with Cast Member and SRE on-call runbooks active.
