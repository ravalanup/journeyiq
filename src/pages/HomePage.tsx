import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  PlayCircle,
  Users,
  Calendar,
  Clock,
  Compass,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Trip, Guest, Party, Itinerary } from '../types';

interface HomePageProps {
  guest: Guest;
  party: Party;
  trip: Trip;
  itinerary: Itinerary;
  onNavigate: (tab: any) => void;
  onTriggerSimulation: (type: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  guest,
  party,
  trip,
  itinerary,
  onNavigate,
  onTriggerSimulation,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0B2147] via-[#0D2A5B] to-[#081835] rounded-[36px] p-8 sm:p-12 text-white shadow-2xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#00D1FF]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -bottom-16 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Guest Journey Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white mb-4 leading-tight">
            Plan smarter. Adapt instantly. <span className="text-[#FFD700]">Enjoy more.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            JourneyIQ transforms rigid theme park schedules into continuously adaptive, AI-guided journeys that dynamically balance wait times, crowd surges, and weather shifts while keeping the guest firmly in control.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onNavigate('live')}
              className="px-6 py-3.5 rounded-2xl bg-[#FFD700] text-[#0B2147] font-bold text-sm shadow-lg hover:bg-amber-300 transition-all flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              Launch Live Journey Demo
            </button>

            <button
              onClick={() => onNavigate('itinerary')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#00D1FF]" />
              View Active AI Itinerary
            </button>

            <button
              onClick={() => onNavigate('trip')}
              className="px-4 py-3.5 rounded-2xl text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              Trip Setup &amp; Dining &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Active Trip Quick Card & How It Works Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Journey Snapshot */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0B2147] text-[#00D1FF] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B2147]">Active Family Journey</h3>
                  <p className="text-xs text-slate-500">Kingdom of Wonders • Today&apos;s Itinerary</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Journey in Progress
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Party</span>
                <span className="text-sm font-bold text-[#0B2147]">{party.members.length} Guests</span>
                <span className="text-[10px] text-slate-500 block">2 Adults, 2 Kids</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Dining Window</span>
                <span className="text-sm font-bold text-amber-600">12:30 PM</span>
                <span className="text-[10px] text-emerald-600 block">Protected Lock</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Time Saved</span>
                <span className="text-sm font-bold text-emerald-600">+32 Mins</span>
                <span className="text-[10px] text-slate-500 block">Optimized Lines</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Confidence</span>
                <span className="text-sm font-bold text-[#00D1FF]">96% Match</span>
                <span className="text-[10px] text-slate-500 block">Multi-Agent Ranked</span>
              </div>
            </div>

            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 mb-6">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00D1FF]" />
                Current AI Summary
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &ldquo;{itinerary.summaryRationale}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">8 Planned Experiences &bull; Next: 10:45 AM</span>
            <button
              onClick={() => onNavigate('live')}
              className="px-4 py-2 bg-[#0B2147] text-white text-xs font-bold rounded-xl hover:bg-[#0D2A5B] transition-colors flex items-center gap-1.5"
            >
              Open Live Journey <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Real-Time Simulation Sandbox Quick Launcher */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B2147] to-[#081835] rounded-[32px] p-7 text-white shadow-xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-[#FFD700] text-[#0B2147] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Disruption Simulator</h3>
                <p className="text-xs text-slate-400">Test real-time event materiality & adaptation</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Trigger live theme park disruptions to observe JourneyIQ&apos;s real-time materiality logic, multi-agent evaluation, and guest-approved itinerary updates.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  onTriggerSimulation('EXPERIENCE_STATUS_CHANGED');
                  onNavigate('live');
                }}
                className="w-full text-left p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-rose-500/30 text-xs font-semibold flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 group-hover:scale-125 transition-transform"></span>
                  <span>Simulate: Attraction Closure (Gemstone Mine)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#FFD700] bg-white/10 px-2 py-0.5 rounded">
                  High Materiality
                </span>
              </button>

              <button
                onClick={() => {
                  onTriggerSimulation('WAIT_TIME_CHANGED');
                  onNavigate('live');
                }}
                className="w-full text-left p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-amber-500/30 text-xs font-semibold flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform"></span>
                  <span>Simulate: 85-Min Standby Line Surge</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#00D1FF] bg-white/10 px-2 py-0.5 rounded">
                  Line Spike
                </span>
              </button>

              <button
                onClick={() => {
                  onTriggerSimulation('WEATHER_CHANGED');
                  onNavigate('live');
                }}
                className="w-full text-left p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-cyan-500/30 text-xs font-semibold flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform"></span>
                  <span>Simulate: Sudden Severe Thunderstorm</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-cyan-300 bg-white/10 px-2 py-0.5 rounded">
                  Indoor Shift
                </span>
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Deterministic Hard Constraints Enforced
            </span>
            <span className="font-mono text-[#00D1FF]">v2.5 Engine</span>
          </div>
        </div>
      </div>

      {/* How It Works 5-Stage Orchestration Pipeline */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100">
        <h3 className="text-xl font-bold text-[#0B2147] mb-2 font-serif-magic">
          The 5-Stage Adaptive Intelligence Lifecycle
        </h3>
        <p className="text-xs text-slate-500 mb-8">
          How JourneyIQ balances real-time operations, guest preference signals, and AI multi-agent orchestration
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border-b-4 border-blue-500 shadow-xs">
            <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Stage 01</div>
            <h4 className="text-sm font-bold text-[#0B2147] mb-1">Understand</h4>
            <p className="text-xs text-slate-500 leading-tight">
              Ingests party composition, mobility needs, thrill preferences, and confirmed dining constraints.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-b-4 border-[#00D1FF] shadow-xs">
            <div className="text-[10px] text-[#00D1FF] font-bold uppercase tracking-wider mb-1">Stage 02</div>
            <h4 className="text-sm font-bold text-[#0B2147] mb-1">Plan</h4>
            <p className="text-xs text-slate-500 leading-tight">
              Multi-agent planning optimizes ride sequencing, walking paths, and lightning lane windows.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-b-4 border-amber-500 shadow-xs">
            <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">Stage 03</div>
            <h4 className="text-sm font-bold text-[#0B2147] mb-1">Monitor</h4>
            <p className="text-xs text-slate-500 leading-tight">
              Real-time event radar monitors queue surges, closures, and weather shifts with materiality filters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-b-4 border-[#FFD700] shadow-xs">
            <div className="text-[10px] text-[#0B2147] font-bold uppercase tracking-wider mb-1">Stage 04</div>
            <h4 className="text-sm font-bold text-[#0B2147] mb-1">Adapt</h4>
            <p className="text-xs text-slate-500 leading-tight">
              Generates explainable alternatives with time-saved metrics requiring explicit guest approval.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-b-4 border-emerald-500 shadow-xs">
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Stage 05</div>
            <h4 className="text-sm font-bold text-[#0B2147] mb-1">Learn</h4>
            <p className="text-xs text-slate-500 leading-tight">
              Captures feedback and outcome telemetry to continuously refine recommendations and operational flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
