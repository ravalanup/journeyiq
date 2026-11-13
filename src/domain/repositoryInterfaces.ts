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
  TripOutcome,
  AIDecisionRecord,
  AnalyticsEvent,
} from '../types';

export interface IGuestRepository {
  getGuest(id: string): Promise<Guest | null>;
  updateGuestPreferences(id: string, preferences: Guest['preferences']): Promise<Guest>;
}

export interface IPartyRepository {
  getParty(id: string): Promise<Party | null>;
  updatePartyMembers(id: string, members: Party['members']): Promise<Party>;
}

export interface ITripRepository {
  getTrip(id: string): Promise<Trip | null>;
  createTrip(trip: Omit<Trip, 'id'>): Promise<Trip>;
  updateTripStatus(id: string, status: Trip['status']): Promise<Trip>;
}

export interface IExperienceRepository {
  getAllExperiences(parkId?: string): Promise<Experience[]>;
  getExperience(id: string): Promise<Experience | null>;
  getExperienceState(id: string): Promise<ExperienceState | null>;
  getAllExperienceStates(): Promise<Record<string, ExperienceState>>;
  updateExperienceState(id: string, updates: Partial<ExperienceState>): Promise<ExperienceState>;
}

export interface IReservationRepository {
  getReservationsForTrip(tripId: string): Promise<Reservation[]>;
  validateReservationConflicts(tripId: string, plannedItems: Itinerary['items']): Promise<{
    hasConflict: boolean;
    conflictedReservation?: Reservation;
    conflictedItem?: Itinerary['items'][0];
    explanation?: string;
  }>;
}

export interface IWeatherRepository {
  getCurrentWeather(parkId: string): Promise<WeatherCondition>;
  updateWeather(parkId: string, weather: WeatherCondition): Promise<WeatherCondition>;
}

export interface IItineraryRepository {
  getItinerary(id: string): Promise<Itinerary | null>;
  getItinerariesForTrip(tripId: string): Promise<Itinerary[]>;
  saveItinerary(itinerary: Itinerary): Promise<Itinerary>;
}

export interface IRecommendationRepository {
  getRecommendation(id: string): Promise<Recommendation | null>;
  saveRecommendation(recommendation: Recommendation): Promise<Recommendation>;
  updateRecommendationStatus(id: string, status: Recommendation['status']): Promise<Recommendation>;
}

export interface IFeedbackRepository {
  saveFeedback(feedback: FeedbackSubmission): Promise<FeedbackSubmission>;
  getFeedbackForTrip(tripId: string): Promise<FeedbackSubmission[]>;
}

export interface IObservabilityRepository {
  saveDecisionRecord(record: AIDecisionRecord): Promise<AIDecisionRecord>;
  getDecisionRecords(): Promise<AIDecisionRecord[]>;
}

export interface IAnalyticsRepository {
  recordEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent>;
  getVisitCount(): Promise<number>;
  incrementVisitCount(): Promise<number>;
  getAnalyticsSummary(): Promise<{
    totalVisits: number;
    featureClicks: Record<string, number>;
    recommendationsCount: number;
    acceptanceRatePct: number;
    timeSavedTotalMinutes: number;
  }>;
}
