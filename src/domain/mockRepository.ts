import {
  IGuestRepository,
  IPartyRepository,
  ITripRepository,
  IExperienceRepository,
  IReservationRepository,
  IWeatherRepository,
  IItineraryRepository,
  IRecommendationRepository,
  IFeedbackRepository,
  IObservabilityRepository,
  IAnalyticsRepository,
} from './repositoryInterfaces';
import {
  Guest,
  Party,
  Trip,
  Experience,
  ExperienceState,
  Reservation,
  WeatherCondition,
  Itinerary,
  Recommendation,
  FeedbackSubmission,
  AIDecisionRecord,
  AnalyticsEvent,
} from '../types';
import {
  SYNTHETIC_GUESTS,
  SYNTHETIC_PARTY,
  SYNTHETIC_EXPERIENCES,
  INITIAL_EXPERIENCE_STATES,
  SYNTHETIC_RESERVATIONS,
  INITIAL_WEATHER,
  INITIAL_TRIP,
  INITIAL_ITINERARY,
} from '../data/syntheticData';

class MockRepository
  implements
    IGuestRepository,
    IPartyRepository,
    ITripRepository,
    IExperienceRepository,
    IReservationRepository,
    IWeatherRepository,
    IItineraryRepository,
    IRecommendationRepository,
    IFeedbackRepository,
    IObservabilityRepository,
    IAnalyticsRepository
{
  private guests: Map<string, Guest> = new Map();
  private parties: Map<string, Party> = new Map();
  private trips: Map<string, Trip> = new Map();
  private experiences: Map<string, Experience> = new Map();
  private experienceStates: Map<string, ExperienceState> = new Map();
  private reservations: Map<string, Reservation> = new Map();
  private weather: WeatherCondition = { ...INITIAL_WEATHER };
  private itineraries: Map<string, Itinerary> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  private feedbacks: FeedbackSubmission[] = [];
  private decisionRecords: AIDecisionRecord[] = [];
  private events: AnalyticsEvent[] = [];
  private visitCount: number = 12842;
  private featureClicks: Record<string, number> = {
    plan_journey: 148,
    simulate_closure: 72,
    simulate_spike: 45,
    simulate_weather: 38,
    view_diff: 91,
    approve_recommendation: 86,
    architecture_view: 114,
    production_guide: 98,
  };

  constructor() {
    this.seed();
  }

  private seed() {
    SYNTHETIC_GUESTS.forEach((g) => this.guests.set(g.id, { ...g }));
    this.parties.set(SYNTHETIC_PARTY.id, { ...SYNTHETIC_PARTY });
    this.trips.set(INITIAL_TRIP.id, { ...INITIAL_TRIP });
    SYNTHETIC_EXPERIENCES.forEach((e) => this.experiences.set(e.id, { ...e }));
    Object.entries(INITIAL_EXPERIENCE_STATES).forEach(([id, st]) =>
      this.experienceStates.set(id, { ...st })
    );
    SYNTHETIC_RESERVATIONS.forEach((r) => this.reservations.set(r.id, { ...r }));
    this.itineraries.set(INITIAL_ITINERARY.id, { ...INITIAL_ITINERARY });
  }

  public resetState() {
    this.guests.clear();
    this.parties.clear();
    this.trips.clear();
    this.experiences.clear();
    this.experienceStates.clear();
    this.reservations.clear();
    this.itineraries.clear();
    this.recommendations.clear();
    this.feedbacks = [];
    this.decisionRecords = [];
    this.weather = { ...INITIAL_WEATHER };
    this.seed();
  }

  // IGuestRepository
  async getGuest(id: string): Promise<Guest | null> {
    return this.guests.get(id) ? { ...this.guests.get(id)! } : null;
  }

  async updateGuestPreferences(id: string, preferences: Guest['preferences']): Promise<Guest> {
    const guest = this.guests.get(id);
    if (!guest) throw new Error(`Guest ${id} not found`);
    const updated = { ...guest, preferences: { ...preferences } };
    this.guests.set(id, updated);
    return { ...updated };
  }

  // IPartyRepository
  async getParty(id: string): Promise<Party | null> {
    return this.parties.get(id) ? { ...this.parties.get(id)! } : null;
  }

  async updatePartyMembers(id: string, members: Party['members']): Promise<Party> {
    const party = this.parties.get(id);
    if (!party) throw new Error(`Party ${id} not found`);
    const updated = { ...party, members: [...members] };
    this.parties.set(id, updated);
    return { ...updated };
  }

  // ITripRepository
  async getTrip(id: string): Promise<Trip | null> {
    return this.trips.get(id) ? { ...this.trips.get(id)! } : null;
  }

  async createTrip(trip: Omit<Trip, 'id'>): Promise<Trip> {
    const id = `trip-${Date.now()}`;
    const newTrip: Trip = { ...trip, id };
    this.trips.set(id, newTrip);
    return { ...newTrip };
  }

  async updateTripStatus(id: string, status: Trip['status']): Promise<Trip> {
    const trip = this.trips.get(id);
    if (!trip) throw new Error(`Trip ${id} not found`);
    const updated = { ...trip, status };
    this.trips.set(id, updated);
    return { ...updated };
  }

  // IExperienceRepository
  async getAllExperiences(parkId?: string): Promise<Experience[]> {
    const all = Array.from(this.experiences.values());
    if (parkId) return all.filter((e) => e.parkId === parkId);
    return all;
  }

  async getExperience(id: string): Promise<Experience | null> {
    return this.experiences.get(id) ? { ...this.experiences.get(id)! } : null;
  }

  async getExperienceState(id: string): Promise<ExperienceState | null> {
    return this.experienceStates.get(id) ? { ...this.experienceStates.get(id)! } : null;
  }

  async getAllExperienceStates(): Promise<Record<string, ExperienceState>> {
    const result: Record<string, ExperienceState> = {};
    this.experienceStates.forEach((val, key) => {
      result[key] = { ...val };
    });
    return result;
  }

  async updateExperienceState(id: string, updates: Partial<ExperienceState>): Promise<ExperienceState> {
    const current = this.experienceStates.get(id) || {
      experienceId: id,
      status: 'OPEN',
      waitMinutes: 15,
      lightningLaneAvailable: true,
      capacityStatus: 'NORMAL',
      lastUpdated: new Date().toISOString(),
    };
    const updated = { ...current, ...updates, lastUpdated: new Date().toISOString() };
    this.experienceStates.set(id, updated);
    return { ...updated };
  }

  // IReservationRepository
  async getReservationsForTrip(tripId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter((r) => r.tripId === tripId);
  }

  async validateReservationConflicts(tripId: string, plannedItems: Itinerary['items']) {
    const tripReservations = await this.getReservationsForTrip(tripId);
    for (const res of tripReservations) {
      if (res.status !== 'CONFIRMED') continue;
      const resStart = timeToMinutes(res.startTime);
      const resEnd = timeToMinutes(res.endTime);

      for (const item of plannedItems) {
        if (item.experienceId === res.experienceId) continue;
        const itemStart = timeToMinutes(item.plannedStartTime);
        const itemEnd = timeToMinutes(item.plannedEndTime);

        // Check if item overlaps within 15 mins buffer before reservation
        if (itemEnd > resStart - 10 && itemStart < resEnd) {
          return {
            hasConflict: true,
            conflictedReservation: res,
            conflictedItem: item,
            explanation: `Item "${item.experienceName}" (${item.plannedStartTime}-${item.plannedEndTime}) risks conflicting with protected reservation "${res.experienceName}" at ${res.startTime}.`,
          };
        }
      }
    }
    return { hasConflict: false };
  }

  // IWeatherRepository
  async getCurrentWeather(parkId: string): Promise<WeatherCondition> {
    return { ...this.weather };
  }

  async updateWeather(parkId: string, weather: WeatherCondition): Promise<WeatherCondition> {
    this.weather = { ...weather };
    return { ...this.weather };
  }

  // IItineraryRepository
  async getItinerary(id: string): Promise<Itinerary | null> {
    return this.itineraries.get(id) ? { ...this.itineraries.get(id)! } : null;
  }

  async getItinerariesForTrip(tripId: string): Promise<Itinerary[]> {
    return Array.from(this.itineraries.values()).filter((it) => it.tripId === tripId);
  }

  async saveItinerary(itinerary: Itinerary): Promise<Itinerary> {
    this.itineraries.set(itinerary.id, { ...itinerary });
    return { ...itinerary };
  }

  // IRecommendationRepository
  async getRecommendation(id: string): Promise<Recommendation | null> {
    return this.recommendations.get(id) ? { ...this.recommendations.get(id)! } : null;
  }

  async saveRecommendation(recommendation: Recommendation): Promise<Recommendation> {
    this.recommendations.set(recommendation.id, { ...recommendation });
    return { ...recommendation };
  }

  async updateRecommendationStatus(id: string, status: Recommendation['status']): Promise<Recommendation> {
    const rec = this.recommendations.get(id);
    if (!rec) throw new Error(`Recommendation ${id} not found`);
    const updated = { ...rec, status };
    this.recommendations.set(id, updated);
    return { ...updated };
  }

  // IFeedbackRepository
  async saveFeedback(feedback: FeedbackSubmission): Promise<FeedbackSubmission> {
    this.feedbacks.push({ ...feedback });
    return { ...feedback };
  }

  async getFeedbackForTrip(tripId: string): Promise<FeedbackSubmission[]> {
    return this.feedbacks.filter((f) => f.tripId === tripId);
  }

  // IObservabilityRepository
  async saveDecisionRecord(record: AIDecisionRecord): Promise<AIDecisionRecord> {
    this.decisionRecords.unshift({ ...record });
    return { ...record };
  }

  async getDecisionRecords(): Promise<AIDecisionRecord[]> {
    return [...this.decisionRecords];
  }

  // IAnalyticsRepository
  async recordEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    this.events.unshift(fullEvent);
    if (event.type && this.featureClicks[event.type]) {
      this.featureClicks[event.type]++;
    }
    return fullEvent;
  }

  async getVisitCount(): Promise<number> {
    return this.visitCount;
  }

  async incrementVisitCount(): Promise<number> {
    this.visitCount++;
    return this.visitCount;
  }

  async getAnalyticsSummary() {
    const totalRecs = this.recommendations.size || 4;
    const acceptedRecs = Array.from(this.recommendations.values()).filter(
      (r) => r.status === 'APPROVED'
    ).length;
    return {
      totalVisits: this.visitCount,
      featureClicks: { ...this.featureClicks },
      recommendationsCount: totalRecs,
      acceptanceRatePct: totalRecs > 0 ? Math.round((Math.max(acceptedRecs, 3) / Math.max(totalRecs, 4)) * 100) : 88,
      timeSavedTotalMinutes: 1240,
    };
  }
}

function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hh, mm] = timeStr.split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

export const mockRepo = new MockRepository();
