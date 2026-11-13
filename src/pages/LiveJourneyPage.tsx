import React, { useState } from 'react';
import { Itinerary, Trip, Party, Reservation, WeatherCondition, Recommendation } from '../types';
import {
  PlayCircle,
  Clock,
  Sparkles,
  Zap,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  CloudRain,
  Sun,
  Eye,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface LiveJourneyPageProps {
  itinerary: Itinerary;
  trip: Trip;
  party: Party;
  reservations: Reservation[];
  weather: WeatherCondition;
  activeRecommendation: Recommendation | null;
  onSimulateDisruption: (type: string, expId?: string) => void;
  onOpenRecommendationModal: () => void;
  onOpenObservability: () => void;
  onNavigateSummary: () => void;
}

export const LiveJourneyPage: React.FC<LiveJourneyPageProps> = ({
  itinerary,
  trip,
  party,
  reservations,
  weather,
  activeRecommendation,
  onSimulateDisruption,
  onOpenRecommendationModal,
  onOpenObservability,
  onNavigateSummary,
}) => {
  const currentItem = itinerary.items.find((i) => i.status === 'IN_PROGRESS') || itinerary.items[1];
  const nextItem = itinerary.items.find((i) => i.status === 'PLANNED') || itinerary.items[2];
  const diningRes = reservations.find((r) => r.type === 'DINING');

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Live Status Header */}
      <div className="bg-[#0B2147] rounded-[36px] p-8 text-white shadow-2xl border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#00D1FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Live Park Journey Active &bull; 10:15 AM
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white font-serif-magic">
            Journey Radar &amp; Telemetry
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            JourneyIQ is continuously evaluating standby lines, weather shifts, and party pace to protect your 12:30 PM royal dining window.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 text-left">
            <div className="text-[9px] text-slate-400 font-bold uppercase">Park Weather</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              {weather.condition === 'THUNDERSTORM' ? (
                <CloudRain className="w-4 h-4 text-cyan-400" />
              ) : (
                <Sun className="w-4 h-4 text-[#FFD700]" />
              )}
              {weather.temperatureF}&deg;F &bull; {weather.condition}
            </div>
          </div>

          <div className="bg-[#FFD700] text-[#0B2147] px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md">
            Next: {diningRes ? diningRes.startTime : '12:30 PM'} Feast
          </div>
        </div>
      </div>

      {/* DISRUPTION ALERT BANNER (If Active Recommendation Pending) */}
      {activeRecommendation && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-[32px] p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 border border-white/30 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white text-rose-800 px-2 py-0.5 rounded">
                  Action Required
                </span>
                <span className="text-xs font-mono opacity-90">
                  Confidence: {Math.round(activeRecommendation.confidenceScore * 100)}%
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {activeRecommendation.title}: Replaced {activeRecommendation.affectedExperienceName}
              </h3>
              <p className="text-xs text-white/90 leading-tight line-clamp-1">
                {activeRecommendation.narrativeExplanation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenRecommendationModal}
              className="px-5 py-2.5 rounded-2xl bg-[#0B2147] text-[#FFD700] font-bold text-xs hover:bg-slate-900 transition-colors shadow-lg flex items-center gap-1.5"
            >
              Review Adaptation Diff &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Current Experience & Countdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Activity */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                In Progress Now
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">{currentItem.plannedStartTime} - {currentItem.plannedEndTime}</span>
            </div>
            <h3 className="text-base font-bold text-[#0B2147] mb-1">{currentItem.experienceName}</h3>
            <p className="text-xs text-slate-500">{currentItem.zone} &bull; Family Coaster</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Wait Duration</span>
            <span className="font-bold text-[#0B2147] font-mono">{currentItem.estimatedWaitMinutes} mins</span>
          </div>
        </div>

        {/* Up Next Activity */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                Up Next (10:45 AM)
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">In ~30 mins</span>
            </div>
            <h3 className="text-base font-bold text-[#0B2147] mb-1">{nextItem.experienceName}</h3>
            <p className="text-xs text-slate-500">{nextItem.zone} &bull; Dark Ride</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Standby Queue</span>
            <span className="font-bold text-emerald-600 font-mono">
              {nextItem.estimatedWaitMinutes}m (Low Wait)
            </span>
          </div>
        </div>

        {/* Protected Dining Countdown */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 rounded-[32px] p-6 shadow-xl border border-amber-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Hard Constraint
              </span>
              <span className="text-xs font-mono text-amber-800 font-bold">12:30 PM</span>
            </div>
            <h3 className="text-base font-bold text-[#0B2147] mb-1">Cinderella’s Royal Starlight Feast</h3>
            <p className="text-xs text-amber-900/80">Table Service Banquet &bull; Party of 4</p>
          </div>

          <div className="pt-4 border-t border-amber-200/80 flex items-center justify-between text-xs">
            <span className="text-amber-800">Buffer Protected</span>
            <span className="font-bold text-emerald-700 font-mono">+20 min safe window</span>
          </div>
        </div>
      </div>

      {/* DISRUPTION SIMULATION CONTROL PANEL */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B2147] text-[#FFD700] flex items-center justify-center font-bold shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0B2147]">Theme Park Operational Disruption Simulator</h3>
              <p className="text-xs text-slate-500">
                Trigger synthetic operational events to test JourneyIQ&apos;s real-time multi-agent adaptation loop
              </p>
            </div>
          </div>
          <button
            onClick={onOpenObservability}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5 text-[#00D1FF]" />
            Inspect AI Observability
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Simulation 1: Attraction Closure */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-rose-400 transition-colors">
            <div>
              <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Scenario A</div>
              <h4 className="text-sm font-bold text-[#0B2147] mb-1">Attraction Closure</h4>
              <p className="text-xs text-slate-500 leading-tight">
                Gemstone Mine closes unexpectedly. System detects high materiality and proposes low-wait alternative.
              </p>
            </div>
            <button
              onClick={() => onSimulateDisruption('EXPERIENCE_STATUS_CHANGED', 'exp-mythic-mine-train')}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Simulate Closure &rarr;
            </button>
          </div>

          {/* Simulation 2: Wait Time Surge */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-amber-400 transition-colors">
            <div>
              <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Scenario B</div>
              <h4 className="text-sm font-bold text-[#0B2147] mb-1">Queue Surge Spike</h4>
              <p className="text-xs text-slate-500 leading-tight">
                Standby queue surges to 85 minutes. Materiality check triggers optimization to preserve afternoon dining.
              </p>
            </div>
            <button
              onClick={() => onSimulateDisruption('WAIT_TIME_CHANGED', 'exp-mythic-mine-train')}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Simulate 85m Spike &rarr;
            </button>
          </div>

          {/* Simulation 3: Severe Weather Alert */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-cyan-400 transition-colors">
            <div>
              <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider mb-1">Scenario C</div>
              <h4 className="text-sm font-bold text-[#0B2147] mb-1">Severe Thunderstorm</h4>
              <p className="text-xs text-slate-500 leading-tight">
                Outdoor river cruise suspended. AI dynamically swaps in air-conditioned indoor dark rides and shows.
              </p>
            </div>
            <button
              onClick={() => onSimulateDisruption('WEATHER_CHANGED')}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Simulate Storm &rarr;
            </button>
          </div>

          {/* Simulation 4: Attraction Reopening */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-emerald-400 transition-colors">
            <div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Scenario D</div>
              <h4 className="text-sm font-bold text-[#0B2147] mb-1">Surprise Reopening</h4>
              <p className="text-xs text-slate-500 leading-tight">
                Previously closed coaster reopens with low 10m initial queue. Opportunity alert surfaced.
              </p>
            </div>
            <button
              onClick={() => onSimulateDisruption('EXPERIENCE_REOPENED', 'exp-space-hypercoaster')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Simulate Reopening &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* End of Day Summary Fast Link */}
      <div className="flex items-center justify-between p-6 bg-white rounded-[32px] shadow-md border border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-[#0B2147]">Completed Today&apos;s Journey?</h4>
          <p className="text-xs text-slate-500">Review time saved, experiences completed, and submit trip feedback</p>
        </div>
        <button
          onClick={onNavigateSummary}
          className="px-5 py-2.5 rounded-2xl bg-[#0B2147] text-[#FFD700] text-xs font-bold hover:bg-[#0D2A5B] transition-colors"
        >
          View Trip Outcome Summary &rarr;
        </button>
      </div>
    </div>
  );
};
