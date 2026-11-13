import React from 'react';
import { Trip, Itinerary, Party } from '../types';
import { Award, CheckCircle2, Clock, Footprints, Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface TripSummaryPageProps {
  trip: Trip;
  itinerary: Itinerary;
  party: Party;
  onNavigateFeedback: () => void;
  onNavigateHome: () => void;
}

export const TripSummaryPage: React.FC<TripSummaryPageProps> = ({
  trip,
  itinerary,
  party,
  onNavigateFeedback,
  onNavigateHome,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-[#0B2147] via-[#0D2A5B] to-[#081835] rounded-[36px] p-8 sm:p-12 text-white shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold border border-[#FFD700]/30 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            Day Completed &bull; High Satisfaction
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white font-serif-magic">
            Morgan Family Journey Recap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Here is your executive day summary. JourneyIQ dynamically resolved 1 major queue disruption and preserved every milestone reservation.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onNavigateFeedback}
            className="px-6 py-3.5 rounded-2xl bg-[#FFD700] text-[#0B2147] font-bold text-xs hover:bg-amber-300 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 text-[#0B2147]" />
            Leave Trip Feedback
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Experiences Enjoyed
          </div>
          <div className="text-2xl font-black text-[#0B2147] font-mono">6 Attended</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% of Must-Do List</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Total Time Saved in Lines
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">+32 Mins</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Via proactive queue evasion</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Dining &amp; LL Protected
          </div>
          <div className="text-2xl font-black text-[#FFD700] font-mono">100% Locked</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">12:30 PM &amp; 3:45 PM on-time</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Total Steps Walked
          </div>
          <div className="text-2xl font-black text-[#00D1FF] font-mono">4.2 Miles</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Clustered land pacing</div>
        </div>
      </div>

      {/* Synthetic Portfolio Benchmark Card (Clearly Labeled) */}
      <div className="bg-[#0B2147] rounded-3xl p-7 text-white shadow-xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              JourneyIQ Portfolio Benchmark Comparison
            </h3>
          </div>
          <span className="text-[10px] bg-white/10 text-[#FFD700] font-mono px-2 py-0.5 rounded border border-white/10">
            Synthetic Benchmark Reference
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-slate-400 block text-[11px]">Unassisted Family Average</span>
            <span className="text-base font-bold text-slate-200">4.1 Rides &bull; 135m in Line</span>
            <p className="text-[10px] text-slate-400">Frequent cross-park backtrack fatigue.</p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-cyan-500/30 space-y-1">
            <span className="text-[#00D1FF] block text-[11px] font-bold">Morgan Family (JourneyIQ Assisted)</span>
            <span className="text-base font-bold text-white">6 Rides &bull; 75m in Line</span>
            <p className="text-[10px] text-slate-300">+46% more experiences completed with zero stress.</p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-emerald-400 block text-[11px] font-bold">Net Family Satisfaction</span>
            <span className="text-base font-bold text-white">98% Positive Sentiment</span>
            <p className="text-[10px] text-slate-400">Calculated via post-trip feedback loop.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
