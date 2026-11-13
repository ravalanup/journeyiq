# JourneyIQ Security & Compliance Architecture

This document defines JourneyIQ's security boundaries, privacy safeguards, and compliance controls for transitioning from the single-tenant demo to a multi-tenant production deployment.

*(Note: JourneyIQ does not collect, process, or store payment cards or financial transactions, so PCI-DSS cardholder scope and FinCEN SAR reporting do not apply. If ticketing or F&B checkout is added in future phases, use a hosted PSP such as Stripe Elements/Checkout to remain out of PCI-DSS SAQ-D scope.)*

---

## 1. Current Prototype Security Posture vs. Production Requirements

| Control Domain | Current Prototype (`server.ts` / `App.tsx`) | Production Requirement |
| :--- | :--- | :--- |
| **Persona Isolation (RBAC)** | Client-side React state (`currentPersona` dropdown in `Navbar.tsx`); `GET /api/state` returns full snapshot | Server-side OIDC/Cognito JWT validation + PostgreSQL Row-Level Security (RLS) per role and `guest_id` |
| **Gemini API Key** | Server-side only (`process.env.GEMINI_API_KEY` in `server.ts`); never sent to browser | Stored in AWS Secrets Manager / Vercel Encrypted Env Vars with IAM least privilege |
| **Pre-LLM PII Redaction** | Prompts in `server.ts` interpolate `guest.firstName`, `guest.lastName`, and `reservations` | Deterministic PII scrubbing before prompt assembly (replace names/emails with opaque tokens) |
| **Child & Family Data** | `PartyMember` models children's ages (`7`, `11`), interests, and mobility notes in synthetic data | COPPA / GDPR-K verifiable parental consent, field-level encryption at rest, minimal retention |
| **Audit & CoT Safety** | `AIDecisionRecord` stores redacted summaries & tool names (no raw chain-of-thought) | Immutable append-only audit trail in CloudWatch / S3 Object Lock with 90-day retention |

---

## 2. Server-Side RBAC & Tenant Isolation

In the current demo, switching from `PARK_GUEST` to `CAST_MEMBER`, `PRODUCT_MANAGER`, or `AI_CLOUD_ARCHITECT` hides/shows UI views in `App.tsx` and `Navbar.tsx`. Before production launch, enforce authorization on **every backend endpoint**:

### Role Permission Matrix

| Endpoint / Resource | `PARK_GUEST` | `CAST_MEMBER` | `PRODUCT_MANAGER` | `AI_CLOUD_ARCHITECT` |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/health` | Public / Limited | Allowed | Allowed | Full Diagnostics |
| `GET /api/state` (own trip/party) | Own `guest_id` only | Assigned `park_id` (masked PII) | Denied (no raw PII) | Denied (no raw PII) |
| `POST /api/ai/plan-itinerary` | Own `guest_id` only | On behalf of guest (audited) | Denied | Sandbox test only |
| `POST /api/ai/approve-recommendation` | Own `trip_id` only | Denied (guest-approved only) | Denied | Denied |
| `POST /api/simulate-event` / Ops Ingress | Denied in prod | Allowed (`park_id` scoped) | Denied | Staging / Sandbox only |
| `GET /api/analytics/summary` | Denied | Park load only | Aggregated KPIs only | System latency / errors |
| `AIDecisionRecord` traces | Denied | Denied | Denied | Allowed (CoT-redacted) |

### PostgreSQL Row-Level Security (RLS)

Every guest-owned table (`guests`, `parties`, `trips`, `reservations`, `itineraries`, `recommendations`, `feedback_submissions`) enforces RLS policies:

```sql
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY guest_read_own_itineraries
  ON itineraries FOR SELECT
  USING (guest_id = current_setting('app.current_user_id', true));

CREATE POLICY cast_read_park_itineraries
  ON itineraries FOR SELECT
  USING (
    current_setting('app.current_persona', true) = 'CAST_MEMBER'
    AND park_id = current_setting('app.current_park_id', true)
  );
```

---

## 3. Pre-LLM PII Redaction & Zero CoT Leakage

### Pre-LLM Prompt Sanitization

Before sending context to `@google/genai` (`POST /api/ai/plan-itinerary` and `POST /api/simulate-event`), strip directly identifiable fields:
- **Remove:** `guest.email`, `guest.firstName`, `guest.lastName`, `PartyMember.name`, `guest.homeRegion`, exact confirmation numbers.
- **Pass instead:** Opaque `guestToken`, `partyProfile` (`"2 adults, 2 children ages 7 and 11"`), `preferences` (`pace`, `thrillLevel`, `indoorPreferenceInHeatOrRain`), `reservationWindows` (`"12:30-13:30 Table Service"`), and `experience` catalog names.
- **Re-hydrate locally:** Combine the generated 2-sentence rationale with guest display strings only after receiving the response on the server.

### Zero Chain-of-Thought (CoT) Exposure

As enforced in `ObservabilityDrawer.tsx` and `CloudArchitectPage.tsx`:
- `AIDecisionRecord` stores only structured metadata (`workflow`, `trigger`, `agentsInvoked`, `toolsUsed`, `model`, `latencyMs`, `confidence`, `decisionSummary`, `guestDecision`, `outcomeStatus`).
- Raw prompt transcripts, model reasoning tokens, and user emails are never persisted in `ai_decision_records` or returned to the client.

---

## 4. Child Privacy & Family Data Protection (COPPA / GDPR-K)

Because `PartyMember` tracks `ageGroup` (`TODDLER`, `CHILD`), `age`, `interests`, and `mobilityConsiderations`:
- **Data Minimization:** Store child profiles only under an authenticated adult `PRIMARY_PLANNER` account; never require child email addresses or persistent device ad IDs.
- **Consent & Deletion:** Require verifiable adult consent before saving minor accessibility/mobility notes and support cascading deletion (`DELETE /api/guests/:id` -> cascades across `parties`, `trips`, `itineraries`, `feedback`).
- **Telemetry Anonymization:** `AnalyticsEvent` payloads (`src/types.ts`) must never include child names, ages, or `accessibilityNeeds`.

---

## 5. Application & Infrastructure Hardening Checklist

1. **Input Validation:** Validate all `POST` payloads (`plan-itinerary`, `simulate-event`, `approve-recommendation`, `analytics/event`) with strict Zod schemas and reject unknown keys.
2. **Rate Limiting & WAF:** Apply per-IP and per-user token buckets on `/api/ai/*` (e.g., 10 req/min per guest) and `/api/analytics/visit` to protect Gemini quota and prevent counter inflation.
3. **Security Headers:** Enable `helmet` in `server.ts` (CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS in production).
4. **Encryption:** TLS 1.3 in transit (CloudFront/ALB or Vercel Edge); AES-256 KMS encryption at rest for RDS/Aurora, ElastiCache Redis, and S3 audit archives.
5. **No Client-Side Secrets:** Never expose `GEMINI_API_KEY`, database URLs, or webhook signing secrets via `VITE_*` variables.
