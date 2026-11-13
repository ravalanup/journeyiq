import React from 'react';
import { Itinerary, Trip, Party, Reservation } from '../types';
import {
  Sparkles,
  Clock,
  Footprints,
  PlayCircle,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ItineraryPageProps {
  itinerary: Itinerary;
  trip: Trip;
  party: Party;
  reservations: Reservation[];
  onNavigateLive: () => void;
  onModifyPreferences: () => void;
}

export const ItineraryPage: React.FC<ItineraryPageProps> = ({
  itinerary,
  trip,
  party,
  reservations,
  onNavigateLive,
  onModifyPreferences,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold bg-[#00D1FF]/20 text-[#0B2147] px-2.5 py-0.5 rounded-full border border-[#00D1FF]/30">
              Itinerary Version {itinerary.version}.0 &bull; Active Plan
            </span>
            <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Deterministic Validated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B2147] font-serif-magic">
            AI-Optimized Family Journey
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kingdom of Wonders &bull; {party.compositionSummary} &bull; 8 Scheduled Milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onModifyPreferences}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Tweak Preferences
          </button>
          <button
            onClick={onNavigateLive}
            className="px-6 py-3 rounded-2xl bg-[#FFD700] text-[#0B2147] font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg"
          >
            <PlayCircle className="w-4 h-4 text-[#0B2147]" />
            Enter Live Journey &rarr;
          </button>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Standby Wait</span>
          <span className="text-xl font-bold text-[#0B2147] font-mono">{itinerary.estimatedTotalWaitMinutes} Mins</span>
          <span className="text-[11px] text-emerald-600 font-medium block">Reduced by 45m vs average</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Walking Distance</span>
          <span className="text-xl font-bold text-[#0B2147] font-mono">{itinerary.estimatedTotalWalkMiles} Miles</span>
          <span className="text-[11px] text-slate-500 font-medium block">Zone-clustered routing</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Dining Protection</span>
          <span className="text-xl font-bold text-emerald-600 font-mono">100% Locked</span>
          <span className="text-[11px] text-slate-500 font-medium block">12:30 PM Palace Feast</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Planner Engine</span>
          <span className="text-xl font-bold text-[#00D1FF] font-mono">Multi-Agent</span>
          <span className="text-[11px] text-slate-500 font-medium block">Gemini 2.5 + Rules</span>
        </div>
      </div>

      {/* AI Rationale Box */}
      <div className="bg-[#0B2147] rounded-3xl p-6 text-white shadow-xl border border-white/10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#FFD700] text-[#0B2147] flex items-center justify-center font-bold shrink-0 shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            Trip Planning Agent Executive Rationale
            <span className="text-[10px] font-mono text-[#00D1FF]">Confidence: 96%</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            &ldquo;{itinerary.summaryRationale}&rdquo;
          </p>
        </div>
      </div>

      {/* Timeline Schedule */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 space-y-6">
        <h3 className="text-lg font-bold text-[#0B2147] border-b border-slate-100 pb-3">
          Chronological Journey Timeline
        </h3>

        <div className="space-y-4">
          {itinerary.items.map((item, idx) => (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.isReservationProtected
                  ? 'border-amber-300/90 bg-amber-50/40 shadow-xs'
                  : item.status === 'COMPLETED'
                  ? 'border-slate-100 bg-slate-50/60 opacity-70'
                  : 'border-slate-100 hover:border-cyan-400/40 bg-white shadow-xs'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Time Badge */}
                <div className="w-20 text-center shrink-0">
                  <div className="text-sm font-bold text-[#0B2147] font-mono">{item.plannedStartTime}</div>
                  <div className="text-[10px] text-slate-400 font-mono">to {item.plannedEndTime}</div>
                  {item.status === 'COMPLETED' ? (
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded mt-1 inline-block">
                      COMPLETED
                    </span>
                  ) : item.status === 'IN_PROGRESS' ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-1 inline-block animate-pulse">
                      NOW
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                      PLANNED
                    </span>
                  )}
                </div>

                {/* Vertical Divider */}
                <div className="w-1 h-12 rounded-full bg-slate-200 hidden sm:block"></div>

                {/* Experience Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-[#0B2147]">{item.experienceName}</h4>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.zone}
                    </span>
                    {item.isReservationProtected && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Hard Reservation Window
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 italic leading-snug">{item.reasonForInclusion}</p>
                </div>
              </div>

              {/* Stats & Wait Badge */}
              <div className="flex items-center gap-3 sm:border-l sm:border-slate-100 sm:pl-5 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#0B2147] font-mono">
                    {item.estimatedWaitMinutes > 0 ? `${item.estimatedWaitMinutes}m Wait` : 'Instant Access'}
                  </div>
                  <div className="text-[10px] text-slate-400">+{item.walkingTimeFromPrevMinutes}m walk</div>
                </div>

                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${
                    item.isReservationProtected
                      ? 'bg-amber-400 text-[#0B2147]'
                      : item.estimatedWaitMinutes <= 20
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.isReservationProtected ? '★' : `${item.estimatedWaitMinutes}m`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
