export type AgeGroup = 'TODDLER' | 'CHILD' | 'TEEN' | 'ADULT' | 'SENIOR';

export type PacePreference = 'RELAXED' | 'MODERATE' | 'INTENSIVE';
export type ThrillPreference = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
export type CrowdTolerance = 'LOW' | 'MEDIUM' | 'HIGH';
export type DiningPreference = 'QUICK_SERVICE' | 'TABLE_SERVICE' | 'CHARACTER_DINING' | 'FINE_DINING' | 'SNACK_FOCUSED';

export interface GuestPreferences {
  thrillLevel: ThrillPreference;
  pace: PacePreference;
  crowdTolerance: CrowdTolerance;
  walkingTolerance: 'LOW' | 'MODERATE' | 'HIGH';
  diningPreference: DiningPreference;
  favoriteCategories: string[];
  indoorPreferenceInHeatOrRain: boolean;
  protectReservationsAboveAll: boolean;
  minimizeWaitsPriority: number; // 1 - 5
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  homeRegion: string;
  preferences: GuestPreferences;
  accessibilityNeeds?: string[];
  createdAt: string;
}

export interface PartyMember {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  age?: number;
  role: 'PRIMARY_PLANNER' | 'PARTY_MEMBER' | 'CHILD';
  interests: string[];
  mobilityConsiderations?: string;
}

export interface Party {
  id: string;
  tripId: string;
  name: string;
  members: PartyMember[];
  compositionSummary: string;
}

export interface Park {
  id: string;
  name: string;
  theme: string;
  operatingHours: {
    open: string;
    close: string;
    earlyEntry?: string;
  };
  zones: string[];
}

export type ExperienceCategory =
  | 'THRILL_RIDE'
  | 'FAMILY_ADVENTURE'
  | 'DARK_RIDE'
  | 'WATER_RIDE'
  | 'CHARACTER_GREETING'
  | 'LIVE_SHOW'
  | 'TABLE_SERVICE_DINING'
  | 'QUICK_SERVICE_DINING'
  | 'IMMERSIVE_ZONE';

export interface Experience {
  id: string;
  parkId: string;
  name: string;
  category: ExperienceCategory;
  zone: string;
  thrillLevel: ThrillPreference;
  durationMinutes: number;
  minimumHeightInches?: number;
  indoorOutdoor: 'INDOOR' | 'OUTDOOR' | 'HYBRID';
  fastPassEligible: boolean;
  reservationRequired: boolean;
  imageUrl: string;
  shortDescription: string;
  rating: number;
}

export type ExperienceStatus = 'OPEN' | 'TEMPORARILY_CLOSED' | 'DELAYED' | 'OPENING_SOON' | 'CLOSED';

export interface ExperienceState {
  experienceId: string;
  status: ExperienceStatus;
  waitMinutes: number;
  lightningLaneAvailable: boolean;
  lightningLaneNextTime?: string;
  capacityStatus: 'NORMAL' | 'ELEVATED' | 'AT_CAPACITY';
  lastUpdated: string;
}

export interface Reservation {
  id: string;
  tripId: string;
  type: 'DINING' | 'LIGHTNING_LANE' | 'VIP_TOUR' | 'SPECIAL_EVENT';
  experienceId: string;
  experienceName: string;
  date: string;
  startTime: string; // e.g., "12:30"
  endTime: string;   // e.g., "13:30"
  partySize: number;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
  isHardConstraint: boolean;
}

export interface WeatherCondition {
  timestamp: string;
  condition: 'CLEAR' | 'PARTLY_CLOUDY' | 'RAIN' | 'THUNDERSTORM' | 'HEAT_ADVISORY';
  temperatureF: number;
  precipitationProbability: number;
  humidityPct: number;
  severity: 'NORMAL' | 'MODERATE' | 'SEVERE';
  alertMessage?: string;
}

export interface ItineraryItem {
  id: string;
  experienceId: string;
  experienceName: string;
  category: ExperienceCategory;
  zone: string;
  plannedStartTime: string;
  plannedEndTime: string;
  estimatedWaitMinutes: number;
  walkingTimeFromPrevMinutes: number;
  type: 'EXPERIENCE' | 'RESERVATION' | 'BREAK' | 'TRANSIT';
  priority: 'MUST_DO' | 'PREFERRED' | 'FLEXIBLE';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'DISRUPTED';
  isReservationProtected?: boolean;
  reasonForInclusion: string;
  reasonCode: string;
}

export interface Itinerary {
  id: string;
  tripId: string;
  version: number;
  status: 'ACTIVE' | 'SUPERSEDED' | 'PROPOSED';
  items: ItineraryItem[];
  generatedBy: 'AI_TRIP_PLANNER' | 'AI_REALTIME_ADAPTATION' | 'MANUAL_EDIT';
  summaryRationale: string;
  estimatedTotalWaitMinutes: number;
  estimatedTotalWalkMiles: number;
  generatedAt: string;
}

export type RecommendationTrigger =
  | 'ATTRACTION_CLOSED'
  | 'WAIT_TIME_SPIKE'
  | 'WEATHER_ALERT'
  | 'RESERVATION_CONFLICT_RISK'
  | 'ATTRACTION_REOPENED'
  | 'EARLY_COMPLETION';

export type RecommendationActionType =
  | 'REPLACE_EXPERIENCE'
  | 'REORDER_ITINERARY'
  | 'INSERT_INDOOR_BREAK'
  | 'SWAP_WITH_LOWER_WAIT'
  | 'EARLY_RESERVATION_BUFFER';

export interface Recommendation {
  id: string;
  tripId: string;
  itineraryVersion: number;
  trigger: RecommendationTrigger;
  actionType: RecommendationActionType;
  title: string;
  narrativeExplanation: string;
  affectedExperienceId: string;
  affectedExperienceName: string;
  recommendedExperienceId: string;
  recommendedExperienceName: string;
  reasonCodes: string[];
  estimatedTimeSavedMinutes: number;
  walkingImpactMinutes: number;
  preservesReservations: boolean;
  confidenceScore: number; // 0.0 - 1.0
  requiresApproval: boolean;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'DECLINED' | 'SUPERSEDED';
  proposedItinerary: Itinerary;
  generatedAt: string;
}

export interface Trip {
  id: string;
  guestId: string;
  partyId: string;
  parkId: string;
  date: string;
  arrivalTime: string;
  departureTime: string;
  status: 'DRAFT' | 'PLANNED' | 'ACTIVE' | 'ADAPTING' | 'UPDATED' | 'COMPLETED';
  mustDoExperienceIds: string[];
  flexibleExperienceIds: string[];
  currentItineraryId?: string;
  activeRecommendationId?: string;
  notes?: string;
}

export interface OperationalEvent {
  id: string;
  timestamp: string;
  type: 'EXPERIENCE_STATUS_CHANGED' | 'WAIT_TIME_CHANGED' | 'WEATHER_CHANGED' | 'EXPERIENCE_REOPENED';
  entityId: string;
  entityName: string;
  previousValue: string | number;
  newValue: string | number;
  isMaterial: boolean;
  materialityReason?: string;
}

export interface GuestFeedback {
  id: string;
  tripId: string;
  guestId?: string;
  overallRating: number;
  paceSatisfaction?: number;
  diningSatisfaction?: number;
  adaptationSatisfaction?: number;
  tags: string[];
  freeformComment: string;
  timestamp: string;
}

export interface FeedbackSubmission {
  id: string;
  tripId: string;
  rating: number;
  satisfactionCategory: 'VERY_SATISFIED' | 'SATISFIED' | 'NEUTRAL' | 'UNSATISFIED';
  usefulRecommendationsCount: number;
  tags: string[];
  feedbackComment: string;
  timestamp: string;
}

export interface TripOutcome {
  tripId: string;
  experiencesCompleted: number;
  recommendationsReceived: number;
  recommendationsAccepted: number;
  totalEstimatedTimeSavedMinutes: number;
  reservationsProtected: number;
  guestSatisfactionScore: number;
  netPromoterScore: number;
}

export interface AIDecisionRecord {
  id: string;
  timestamp: string;
  workflow: 'ITINERARY_GENERATION' | 'REAL_TIME_ADAPTATION' | 'ACTION_EXECUTION' | 'FALLBACK_DETERMINISTIC';
  trigger: string;
  agentsInvoked: string[];
  toolsUsed: string[];
  model: string;
  latencyMs: number;
  confidence: number;
  decisionSummary: string;
  guestDecision?: 'APPROVED' | 'DECLINED' | 'AUTO_APPLIED';
  outcomeStatus: 'SUCCESS' | 'VALIDATION_FAILED' | 'REVERTED';
}

export interface AnalyticsEvent {
  id: string;
  type: 'PAGE_VIEW' | 'SIMULATION_TRIGGERED' | 'AI_PLAN_REQUESTED' | 'RECOMMENDATION_ACCEPTED' | 'RECOMMENDATION_REJECTED' | 'ARCHITECTURE_TOGGLED' | 'DEBUG_ACCESSED';
  metadata: Record<string, any>;
  timestamp: string;
}

export interface ClarifyingStrategy {
  deployment: 'SERVERLESS_VERCEL' | 'CONTAINERIZED_CLOUD_RUN';
  persistence: 'RELATIONAL_POSTGRES' | 'NOSQL_FLEXIBLE';
  visibility: 'FULL_EVENTS' | 'AGGREGATED_PULSE';
  aiMode: 'HYBRID_GEMINI_FALLBACK' | 'STRICT_LLM';
}

export type UserPersona = 'PARK_GUEST' | 'CAST_MEMBER' | 'PRODUCT_MANAGER' | 'AI_CLOUD_ARCHITECT';

export interface PersonaProfile {
  id: UserPersona;
  title: string;
  name: string;
  roleLabel: string;
  subtitle: string;
  badgeBg: string;
  badgeText: string;
  avatarBg: string;
  iconName: string;
  description: string;
}
