import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { mockRepo } from './src/domain/mockRepository';
import {
  checkEventMateriality,
  buildDeterministicAdaptiveItinerary,
  scoreExperienceCandidate,
} from './src/services/deterministicRules';
import { OperationalEvent } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Gemini client initialization notice:', e);
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    aiAvailable: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 2. Global State Retrieval
app.get('/api/state', async (req, res) => {
  try {
    const guest = await mockRepo.getGuest('guest-alex-morgan');
    const party = await mockRepo.getParty('party-morgan-fam');
    const trip = await mockRepo.getTrip('trip-morgan-001');
    const experiences = await mockRepo.getAllExperiences('park-001');
    const experienceStates = await mockRepo.getAllExperienceStates();
    const reservations = await mockRepo.getReservationsForTrip('trip-morgan-001');
    const weather = await mockRepo.getCurrentWeather('park-001');
    const itinerary = await mockRepo.getItinerary('itin-v1-morgan');
    const analytics = await mockRepo.getAnalyticsSummary();
    const decisions = await mockRepo.getDecisionRecords();

    res.json({
      guest,
      party,
      trip,
      experiences,
      experienceStates,
      reservations,
      weather,
      itinerary,
      analytics,
      decisions,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Analytics & Invisible Chrome Debug Metric
app.get('/api/analytics/visit', async (req, res) => {
  try {
    const count = await mockRepo.incrementVisitCount();
    const summary = await mockRepo.getAnalyticsSummary();
    res.json({ visitCount: count, summary });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/analytics/event', async (req, res) => {
  try {
    const { type, metadata } = req.body;
    const evt = await mockRepo.recordEvent({ type: type || 'PAGE_VIEW', metadata: metadata || {} });
    res.json({ success: true, event: evt });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 4. AI Itinerary Generation (Guest Context Agent + Trip Planning Agent)
app.post('/api/ai/plan-itinerary', async (req, res) => {
  const startTime = Date.now();
  const { guestId, partyId, parkId, priorities } = req.body;

  try {
    const guest = (await mockRepo.getGuest(guestId || 'guest-alex-morgan'))!;
    const party = (await mockRepo.getParty(partyId || 'party-morgan-fam'))!;
    const experiences = await mockRepo.getAllExperiences(parkId || 'park-001');
    const states = await mockRepo.getAllExperienceStates();
    const reservations = await mockRepo.getReservationsForTrip('trip-morgan-001');
    const weather = await mockRepo.getCurrentWeather(parkId || 'park-001');

    const ai = getAIClient();
    let generatedRationale =
      'JourneyIQ optimized your family day around protected lunch dining at Cinderella’s Feast, placing high-thrill Cosmic Velocity in the afternoon and low-wait dark rides in the morning.';

    if (ai) {
      try {
        const prompt = `You are JourneyIQ's TripPlanningAgent for a Disney-inspired luxury park.
Guest: ${guest.firstName} ${guest.lastName} (${guest.preferences.pace} pace, ${guest.preferences.thrillLevel} thrill preference).
Party: ${party.compositionSummary}.
Reservations: ${JSON.stringify(reservations)}.
Weather: ${weather.condition}, ${weather.temperatureF}F.
Top Experiences available: ${experiences.slice(0, 6).map((e) => e.name).join(', ')}.

Generate a concise 2-sentence executive rationale explaining why this itinerary minimizes wait times while protecting the dining reservation.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response?.text) {
          generatedRationale = response.text.trim();
        }
      } catch (aiErr) {
        console.warn('Gemini call fallback:', aiErr);
      }
    }

    const latencyMs = Date.now() - startTime;

    // Record AI Decision metadata
    await mockRepo.saveDecisionRecord({
      id: `dec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      workflow: 'ITINERARY_GENERATION',
      trigger: 'GUEST_PLAN_REQUEST',
      agentsInvoked: ['GuestContextAgent', 'TripPlanningAgent', 'ExperienceOptimizationAgent'],
      toolsUsed: ['getGuestContext', 'getParty', 'getExperienceState', 'getReservations', 'validateReservationConflicts'],
      model: ai ? 'gemini-3.8-flash' : 'Deterministic-Rules-Engine',
      latencyMs,
      confidence: 0.96,
      decisionSummary: 'Initial 8-step balanced itinerary generated adhering to all hard reservations.',
      outcomeStatus: 'SUCCESS',
    });

    const currentItin = await mockRepo.getItinerary('itin-v1-morgan');
    res.json({
      success: true,
      itinerary: {
        ...currentItin,
        summaryRationale: generatedRationale,
      },
      latencyMs,
      modelUsed: ai ? 'gemini-3.8-flash' : 'Deterministic-Rules-Engine',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Real-Time Disruption Simulation & Adaptation (RealTimeAdaptationAgent + ActionAgent)
app.post('/api/simulate-event', async (req, res) => {
  const startTime = Date.now();
  const { eventType, experienceId, waitMinutes, weatherCondition } = req.body;

  try {
    const currentItin = (await mockRepo.getItinerary('itin-v1-morgan'))!;
    const guest = (await mockRepo.getGuest('guest-alex-morgan'))!;
    const experiences = await mockRepo.getAllExperiences('park-001');
    const states = await mockRepo.getAllExperienceStates();

    let targetExpId = experienceId || 'exp-mythic-mine-train';
    let targetExp = experiences.find((e) => e.id === targetExpId)!;

    // Build operational event
    const opEvent: OperationalEvent = {
      id: `op-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: eventType || 'EXPERIENCE_STATUS_CHANGED',
      entityId: targetExpId,
      entityName: targetExp ? targetExp.name : 'Target Attraction',
      previousValue: states[targetExpId]?.status || 'OPEN',
      newValue: eventType === 'WAIT_TIME_CHANGED' ? waitMinutes || 85 : 'TEMPORARILY_CLOSED',
      isMaterial: false,
    };

    // Update state in repository
    if (eventType === 'WAIT_TIME_CHANGED') {
      await mockRepo.updateExperienceState(targetExpId, { waitMinutes: Number(waitMinutes) || 85 });
    } else if (eventType === 'WEATHER_CHANGED') {
      await mockRepo.updateWeather('park-001', {
        timestamp: new Date().toISOString(),
        condition: weatherCondition || 'THUNDERSTORM',
        temperatureF: 76,
        precipitationProbability: 0.9,
        humidityPct: 88,
        severity: 'SEVERE',
        alertMessage: 'Heavy thunderstorm active. Outdoor attractions temporarily closed.',
      });
    } else {
      await mockRepo.updateExperienceState(targetExpId, { status: 'TEMPORARILY_CLOSED' });
    }

    // Materiality check
    const materiality = checkEventMateriality(opEvent, currentItin);
    opEvent.isMaterial = materiality.isMaterial;
    opEvent.materialityReason = materiality.reason;

    if (!materiality.isMaterial) {
      return res.json({
        isMaterial: false,
        event: opEvent,
        message: materiality.reason,
      });
    }

    // Candidate ranking & optimization
    // Choose the best alternative dark ride / family adventure: Sunken Galleon & Cursed Reef or Buzz Astro Blaster
    const alternativeExp = experiences.find((e) => e.id === 'exp-pirate-cove-grotto') || experiences[1];
    const altState = (await mockRepo.getExperienceState(alternativeExp.id)) || {
      experienceId: alternativeExp.id,
      status: 'OPEN',
      waitMinutes: 15,
      lightningLaneAvailable: true,
      capacityStatus: 'NORMAL',
      lastUpdated: new Date().toISOString(),
    };

    const ai = getAIClient();
    let explanation = `JourneyIQ detected that ${targetExp.name} is temporarily closed. We recommend swapping with "${alternativeExp.name}" (15m wait), saving ~25 minutes and ensuring on-time arrival for your 12:30 PM lunch dining reservation.`;

    if (ai) {
      try {
        const prompt = `You are JourneyIQ's RealTimeAdaptationAgent.
Disrupted Attraction: ${targetExp.name} (TEMPORARILY CLOSED).
Recommended Alternative: ${alternativeExp.name} (Wait: ${altState.waitMinutes} mins).
Guest Preferences: ${guest.preferences.pace} pace, indoor preference during heat/rain, 12:30 PM royal feast reservation.

Write a friendly, concise, 2-sentence executive recommendation explaining why this replacement preserves the schedule and protects the reservation.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response?.text) {
          explanation = response.text.trim();
        }
      } catch (aiErr) {
        console.warn('Gemini adaptation call fallback:', aiErr);
      }
    }

    const { proposedItinerary, recommendation } = buildDeterministicAdaptiveItinerary(
      currentItin,
      targetExpId,
      alternativeExp,
      altState,
      explanation
    );

    recommendation.narrativeExplanation = explanation;

    await mockRepo.saveRecommendation(recommendation);

    const latencyMs = Date.now() - startTime;

    // AI Observability Decision Record
    await mockRepo.saveDecisionRecord({
      id: `dec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      workflow: 'REAL_TIME_ADAPTATION',
      trigger: `${opEvent.type}: ${opEvent.entityName}`,
      agentsInvoked: ['RealTimeAdaptationAgent', 'ExperienceOptimizationAgent', 'ActionAgent'],
      toolsUsed: ['getExperienceState', 'searchExperiences', 'evaluateItinerary', 'validateReservationConflicts'],
      model: ai ? 'gemini-3.8-flash' : 'Deterministic-Rules-Engine',
      latencyMs,
      confidence: 0.94,
      decisionSummary: `Replaced ${targetExp.name} with ${alternativeExp.name}. Protected 12:30 PM royal reservation.`,
      guestDecision: 'APPROVED',
      outcomeStatus: 'SUCCESS',
    });

    res.json({
      isMaterial: true,
      event: opEvent,
      recommendation,
      proposedItinerary,
      latencyMs,
      modelUsed: ai ? 'gemini-3.8-flash' : 'Deterministic-Rules-Engine',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Approve Recommendation & Simulate Action
app.post('/api/ai/approve-recommendation', async (req, res) => {
  const { recommendationId, proposedItinerary } = req.body;
  try {
    if (proposedItinerary) {
      await mockRepo.saveItinerary({
        ...proposedItinerary,
        status: 'ACTIVE',
      });
    }
    if (recommendationId) {
      await mockRepo.updateRecommendationStatus(recommendationId, 'APPROVED');
    }
    await mockRepo.recordEvent({
      type: 'RECOMMENDATION_ACCEPTED',
      metadata: { recommendationId },
    });

    res.json({
      success: true,
      message: 'Simulated Action Complete: Itinerary successfully updated to latest version.',
      activeItinerary: proposedItinerary,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / PRODUCTION STATIC SERVER
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JourneyIQ Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
