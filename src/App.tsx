import React, { useState, useEffect } from 'react';
import { Navbar, TabId, PERSONAS } from './components/layout/Navbar';
import { ObservabilityDrawer } from './components/observability/ObservabilityDrawer';
import { AnalyticsDrawer } from './components/analytics/AnalyticsDrawer';
import { AdaptiveRecommendationModal } from './pages/AdaptiveRecommendationModal';

import { HomePage } from './pages/HomePage';
import { GuestProfilePage } from './pages/GuestProfilePage';
import { PartySetupPage } from './pages/PartySetupPage';
import { TripSetupPage } from './pages/TripSetupPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { LiveJourneyPage } from './pages/LiveJourneyPage';
import { TripSummaryPage } from './pages/TripSummaryPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { BusinessValuePage } from './pages/BusinessValuePage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ProductionGuidePage } from './pages/ProductionGuidePage';
import { CastOperationsPage } from './pages/CastOperationsPage';
import { ProductManagerPage } from './pages/ProductManagerPage';
import { CloudArchitectPage } from './pages/CloudArchitectPage';

import {
  alexMorganGuest,
  morganParty,
  sampleTrip,
  sampleExperiences,
  sampleReservations,
  sampleWeather,
  sampleItineraryV1,
  sampleAlternativeItinerary,
  sampleRecommendation,
  sampleDecisionRecords,
} from './data/syntheticData';
import {
  Guest,
  Party,
  Trip,
  Experience,
  Reservation,
  WeatherCondition,
  Itinerary,
  Recommendation,
  AIDecisionRecord,
  ClarifyingStrategy,
  GuestPreferences,
  GuestFeedback,
  UserPersona,
} from './types';

export function App() {
  // Default to Park Guest per instructions
  const [currentPersona, setCurrentPersona] = useState<UserPersona>('PARK_GUEST');
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Core domain states
  const [guest, setGuest] = useState<Guest>(alexMorganGuest);
  const [party, setParty] = useState<Party>(morganParty);
  const [trip, setTrip] = useState<Trip>(sampleTrip);
  const [experiences, setExperiences] = useState<Experience[]>(sampleExperiences);
  const [reservations, setReservations] = useState<Reservation[]>(sampleReservations);
  const [weather, setWeather] = useState<WeatherCondition>(sampleWeather);
  const [itinerary, setItinerary] = useState<Itinerary>(sampleItineraryV1);
  const [proposedItinerary, setProposedItinerary] = useState<Itinerary>(sampleAlternativeItinerary);
  const [activeRecommendation, setActiveRecommendation] = useState<Recommendation | null>(null);
  const [decisionRecords, setDecisionRecords] = useState<AIDecisionRecord[]>(sampleDecisionRecords);

  // Telemetry & analytics
  const [visitCount, setVisitCount] = useState<number>(12842);
  const [featureClicks, setFeatureClicks] = useState<Record<string, number>>({
    plan_journey: 148,
    simulate_closure: 72,
    view_diff: 91,
    architecture_view: 114,
  });

  const [isObservabilityOpen, setIsObservabilityOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);

  const [clarifyingStrategy, setClarifyingStrategy] = useState<ClarifyingStrategy>({
    deployment: 'SERVERLESS_VERCEL',
    persistence: 'RELATIONAL_POSTGRES',
    visibility: 'FULL_EVENTS',
    aiMode: 'HYBRID_GEMINI_FALLBACK',
  });

  // Track page view and increment visit count on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch('/api/analytics/visit');
        if (res.ok) {
          const data = await res.json();
          if (data.visitCount) {
            setVisitCount(data.visitCount);
          }
        }
      } catch (e) {
        // Fallback to in-memory state
        setVisitCount((prev) => prev + 1);
      }
    };
    fetchInitialData();
  }, []);

  // Handle switching user persona
  const handleSelectPersona = (persona: UserPersona) => {
    setCurrentPersona(persona);
    setActiveTab(PERSONAS[persona].defaultTab);
    setFeatureClicks((prev) => ({
      ...prev,
      [`switch_to_${persona.toLowerCase()}`]: (prev[`switch_to_${persona.toLowerCase()}`] || 0) + 1,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Record tab switch analytics
  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    setFeatureClicks((prev) => ({
      ...prev,
      [`tab_${tab}`]: (prev[`tab_${tab}`] || 0) + 1,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate Plan via Server API
  const handleGeneratePlan = async () => {
    setFeatureClicks((prev) => ({ ...prev, plan_journey: (prev.plan_journey || 0) + 1 }));
    try {
      const res = await fetch('/api/ai/plan-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest.id,
          partyId: party.id,
          parkId: trip.parkId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.itinerary) {
          setItinerary(data.itinerary);
        }
      }
    } catch (e) {
      console.warn('API plan fallback to local synthesizer:', e);
    }
  };

  // Simulate Disruption
  const handleSimulateDisruption = async (eventType: string, expId?: string) => {
    setFeatureClicks((prev) => ({ ...prev, simulate_closure: (prev.simulate_closure || 0) + 1 }));

    try {
      const res = await fetch('/api/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          experienceId: expId || 'exp-mythic-mine-train',
          waitMinutes: eventType === 'WAIT_TIME_CHANGED' ? 85 : undefined,
          weatherCondition: eventType === 'WEATHER_CHANGED' ? 'THUNDERSTORM' : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recommendation) {
          setActiveRecommendation(data.recommendation);
          if (data.proposedItinerary) {
            setProposedItinerary(data.proposedItinerary);
          }
          setIsRecommendationModalOpen(true);
        }
        if (eventType === 'WEATHER_CHANGED') {
          setWeather((prev) => ({
            ...prev,
            condition: 'THUNDERSTORM',
            temperatureF: 76,
            alertMessage: 'Heavy thunderstorm active. Outdoor attractions suspended.',
          }));
        }
      } else {
        triggerLocalDisruption(eventType, expId);
      }
    } catch (e) {
      triggerLocalDisruption(eventType, expId);
    }
  };

  const triggerLocalDisruption = (eventType: string, expId?: string) => {
    const rec: Recommendation = {
      ...sampleRecommendation,
      id: `rec-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      reasonCodes: [eventType === 'WAIT_TIME_CHANGED' ? 'STANDBY_QUEUE_SURGE' : 'EXPERIENCE_UNAVAILABLE'],
    };
    setActiveRecommendation(rec);
    setProposedItinerary(sampleAlternativeItinerary);
    setIsRecommendationModalOpen(true);

    const newRecord: AIDecisionRecord = {
      id: `dec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      workflow: 'REAL_TIME_ADAPTATION',
      trigger: `${eventType}: Gemstone Mine`,
      agentsInvoked: ['RealTimeAdaptationAgent', 'ExperienceOptimizationAgent', 'ActionAgent'],
      toolsUsed: ['getExperienceState', 'searchExperiences', 'evaluateItinerary', 'validateReservationConflicts'],
      model: 'gemini-3.8-flash',
      latencyMs: 380,
      confidence: 0.94,
      decisionSummary: 'Replaced Seven Dwarfs Gemstone Mine with Sunken Galleon & Cursed Reef (+25m saved, 12:30 PM protected).',
      guestDecision: 'APPROVED',
      outcomeStatus: 'SUCCESS',
    };
    setDecisionRecords((prev) => [newRecord, ...prev]);
  };

  // Approve Recommendation
  const handleApproveRecommendation = async () => {
    if (proposedItinerary) {
      setItinerary(proposedItinerary);
    }
    if (activeRecommendation) {
      setActiveRecommendation(null);
    }
    setIsRecommendationModalOpen(false);

    try {
      await fetch('/api/ai/approve-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId: activeRecommendation?.id,
          proposedItinerary,
        }),
      });
    } catch (e) {
      console.warn('Approval recorded locally');
    }
  };

  const handleDeclineRecommendation = () => {
    setActiveRecommendation(null);
    setIsRecommendationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1E293B] flex flex-col font-sans selection:bg-[#00D1FF] selection:text-[#0B2147]">
      {/* Invisible DOM Visit Count Tag for Chrome Developer Tools Debugging */}
      <div id="debug_visit_count" style={{ display: 'none' }} data-value={visitCount}>
        {visitCount}
      </div>

      {/* Navigation Header with Upper-Right Persona Dropdown */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        currentPersona={currentPersona}
        onSelectPersona={handleSelectPersona}
        visitCount={visitCount}
        onOpenObservability={() => setIsObservabilityOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        activeDisruptionCount={activeRecommendation ? 1 : 0}
      />

      {/* Main Container - Renders Persona-Restricted Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* =========================================================================
            PERSONA 1: PARK GUEST (Default)
            Only views related to trip planning, preferences, itinerary, live radar
           ========================================================================= */}
        {currentPersona === 'PARK_GUEST' && (
          <>
            {activeTab === 'home' && (
              <HomePage
                guest={guest}
                party={party}
                trip={trip}
                itinerary={itinerary}
                onNavigate={handleSelectTab}
                onTriggerSimulation={handleSimulateDisruption}
              />
            )}

            {activeTab === 'profile' && (
              <GuestProfilePage
                guest={guest}
                onUpdatePreferences={(prefs: GuestPreferences) => setGuest({ ...guest, preferences: prefs })}
                onNavigateNext={() => handleSelectTab('party')}
              />
            )}

            {activeTab === 'party' && (
              <PartySetupPage
                party={party}
                onUpdateParty={(updated: Party) => setParty(updated)}
                onNavigateNext={() => handleSelectTab('trip')}
                onNavigateBack={() => handleSelectTab('profile')}
              />
            )}

            {activeTab === 'trip' && (
              <TripSetupPage
                trip={trip}
                reservations={reservations}
                experiences={experiences}
                onGeneratePlan={handleGeneratePlan}
                onNavigateNext={() => handleSelectTab('itinerary')}
                onNavigateBack={() => handleSelectTab('party')}
              />
            )}

            {activeTab === 'itinerary' && (
              <ItineraryPage
                itinerary={itinerary}
                trip={trip}
                party={party}
                reservations={reservations}
                onNavigateLive={() => handleSelectTab('live')}
                onModifyPreferences={() => handleSelectTab('profile')}
              />
            )}

            {activeTab === 'live' && (
              <LiveJourneyPage
                itinerary={itinerary}
                trip={trip}
                party={party}
                reservations={reservations}
                weather={weather}
                activeRecommendation={activeRecommendation}
                onSimulateDisruption={handleSimulateDisruption}
                onOpenRecommendationModal={() => setIsRecommendationModalOpen(true)}
                onOpenObservability={() => setIsObservabilityOpen(true)}
                onNavigateSummary={() => handleSelectTab('summary')}
              />
            )}

            {activeTab === 'summary' && (
              <TripSummaryPage
                trip={trip}
                itinerary={itinerary}
                party={party}
                onNavigateFeedback={() => handleSelectTab('feedback')}
                onNavigateHome={() => handleSelectTab('home')}
              />
            )}

            {activeTab === 'feedback' && (
              <FeedbackPage
                trip={trip}
                onSubmitFeedback={(fb: GuestFeedback) => console.log('Feedback submitted:', fb)}
                onNavigateHome={() => handleSelectTab('home')}
              />
            )}
          </>
        )}

        {/* =========================================================================
            PERSONA 2: CAST MEMBER & PARK OPERATIONS
            Guest lookup, crowd flow, 12:30 PM F&B lock, service recovery passes
           ========================================================================= */}
        {currentPersona === 'CAST_MEMBER' && (
          <>
            {(activeTab === 'cast_ops' || activeTab === 'home') && (
              <CastOperationsPage
                party={party}
                trip={trip}
                itinerary={itinerary}
                experiences={experiences}
                reservations={reservations}
                weather={weather}
                onSimulateDisruption={handleSimulateDisruption}
                onNavigateGuestItinerary={() => handleSelectTab('live')}
              />
            )}

            {activeTab === 'party' && (
              <div className="space-y-6">
                <div className="bg-[#0B2147] rounded-3xl p-6 text-white flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold font-serif-magic">Active In-Park Guest Party Roster</h2>
                    <p className="text-xs text-slate-300">View and update party composition for accessibility or assistance</p>
                  </div>
                  <button
                    onClick={() => handleSelectTab('cast_ops')}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all"
                  >
                    &larr; Back to Ops Command
                  </button>
                </div>
                <PartySetupPage
                  party={party}
                  onUpdateParty={(updated: Party) => setParty(updated)}
                  onNavigateNext={() => handleSelectTab('cast_ops')}
                  onNavigateBack={() => handleSelectTab('cast_ops')}
                />
              </div>
            )}

            {activeTab === 'live' && (
              <LiveJourneyPage
                itinerary={itinerary}
                trip={trip}
                party={party}
                reservations={reservations}
                weather={weather}
                activeRecommendation={activeRecommendation}
                onSimulateDisruption={handleSimulateDisruption}
                onOpenRecommendationModal={() => setIsRecommendationModalOpen(true)}
                onOpenObservability={() => setIsObservabilityOpen(true)}
                onNavigateSummary={() => handleSelectTab('cast_ops')}
              />
            )}
          </>
        )}

        {/* =========================================================================
            PERSONA 3: PRODUCT MANAGER
            App adoption, feature engagement funnels, Business ROI & NPS insights
           ========================================================================= */}
        {currentPersona === 'PRODUCT_MANAGER' && (
          <>
            {(activeTab === 'pm_analytics' || activeTab === 'home') && (
              <ProductManagerPage
                visitCount={visitCount}
                featureClicks={featureClicks}
                acceptanceRatePct={94}
              />
            )}

            {activeTab === 'business' && <BusinessValuePage />}

            {activeTab === 'feedback' && (
              <ProductManagerPage
                visitCount={visitCount}
                featureClicks={featureClicks}
                acceptanceRatePct={94}
              />
            )}
          </>
        )}

        {/* =========================================================================
            PERSONA 4: AI SAFETY & CLOUD ARCHITECT
            Site health, 6-layer architecture, Vercel/Cloud Run strategy & traces
           ========================================================================= */}
        {currentPersona === 'AI_CLOUD_ARCHITECT' && (
          <>
            {(activeTab === 'cloud_console' || activeTab === 'home') && (
              <CloudArchitectPage
                decisionRecords={decisionRecords}
                strategy={clarifyingStrategy}
                onStrategyChange={setClarifyingStrategy}
                onOpenObservabilityDrawer={() => setIsObservabilityOpen(true)}
              />
            )}

            {activeTab === 'architecture' && <ArchitecturePage />}

            {activeTab === 'strategy' && (
              <CloudArchitectPage
                decisionRecords={decisionRecords}
                strategy={clarifyingStrategy}
                onStrategyChange={setClarifyingStrategy}
                onOpenObservabilityDrawer={() => setIsObservabilityOpen(true)}
              />
            )}

            {activeTab === 'production' && <ProductionGuidePage />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B2147] text-white border-t border-white/10 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#FFD700] text-[#0B2147] font-serif font-black flex items-center justify-center text-xs">
              J
            </div>
            <span className="text-white font-bold font-serif-magic">JourneyIQ Enterprise Platform</span>
            <span>&bull; Role-Based Experience Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-xs">
              Logged in as: <strong className="text-amber-300">{PERSONAS[currentPersona].name}</strong> ({PERSONAS[currentPersona].badge})
            </span>
            {currentPersona !== 'PARK_GUEST' && (
              <>
                <span>&bull;</span>
                <button
                  onClick={() => setIsAnalyticsOpen(true)}
                  className="hover:text-[#00D1FF] transition-colors"
                >
                  Telemetry ({visitCount.toLocaleString()})
                </button>
              </>
            )}
            {currentPersona === 'AI_CLOUD_ARCHITECT' && (
              <>
                <span>&bull;</span>
                <button
                  onClick={() => setIsObservabilityOpen(true)}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  AI Observability
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Drawers & Modals */}
      {activeRecommendation && (
        <AdaptiveRecommendationModal
          isOpen={isRecommendationModalOpen}
          onClose={() => setIsRecommendationModalOpen(false)}
          recommendation={activeRecommendation}
          currentItinerary={itinerary}
          proposedItinerary={proposedItinerary}
          onApprove={handleApproveRecommendation}
          onDecline={handleDeclineRecommendation}
        />
      )}

      <ObservabilityDrawer
        isOpen={isObservabilityOpen}
        onClose={() => setIsObservabilityOpen(false)}
        decisionRecords={decisionRecords}
      />

      <AnalyticsDrawer
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        visitCount={visitCount}
        featureClicks={featureClicks}
        acceptanceRatePct={94}
      />
    </div>
  );
}

export default App;
