import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Clock,
  MapPin,
  Utensils,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  Search,
  Check,
  Compass,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Party, Trip, Itinerary, Experience, Reservation, WeatherCondition } from '../types';

interface CastOperationsPageProps {
  party: Party;
  trip: Trip;
  itinerary: Itinerary;
  experiences: Experience[];
  reservations: Reservation[];
  weather: WeatherCondition;
  onSimulateDisruption: (eventType: string, expId?: string) => void;
  onNavigateGuestItinerary?: () => void;
}

export const CastOperationsPage: React.FC<CastOperationsPageProps> = ({
  party,
  trip,
  itinerary,
  experiences,
  reservations,
  weather,
  onSimulateDisruption,
  onNavigateGuestItinerary,
}) => {
  const [searchQuery, setSearchQuery] = useState('Morgan');
  const [issuedPass, setIssuedPass] = useState<string | null>(null);
  const [isInjecting, setIsInjecting] = useState<string | null>(null);

  const handleIssueRecoveryPass = (type: string) => {
    setIssuedPass(type);
    setTimeout(() => setIssuedPass(null), 3500);
  };

  const handleSimulate = (eventType: string, expId?: string) => {
    setIsInjecting(eventType);
    onSimulateDisruption(eventType, expId);
    setTimeout(() => setIsInjecting(null), 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#0B2147] rounded-[36px] p-8 sm:p-10 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold uppercase tracking-wider border border-[#FFD700]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cast Member &amp; Park Operations Console
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white font-serif-magic">
              Guest Relations &amp; Flow Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Real-time operational monitoring, guest party lookup, commercial dining protection, and live crowd dispersal tools.
            </p>
          </div>

          {/* Quick Ops Badge */}
          <div className="bg-[#081835] px-4 py-3 rounded-2xl border border-white/15 flex items-center gap-4 shrink-0 shadow-inner">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Park Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Kingdom of Wonders (Active)
              </div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weather</div>
              <div className="text-xs font-bold text-cyan-300 mt-0.5">
                {weather.temperatureF}°F • {weather.condition}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Operational KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Dining Protection Guarantee */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              Zero-Risk
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B2147]">100% Protected</div>
            <div className="text-xs font-bold text-slate-600">High-Value Table Service Dining</div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            12:30 PM Cinderella Royal Feast table reservation locked with guaranteed 15-minute walking buffers.
          </p>
        </div>

        {/* Card 2: Crowd Load Balancing */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-[#00D1FF] flex items-center justify-center border border-cyan-200 font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-full">
              Balanced
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B2147]">74% Park Load</div>
            <div className="text-xs font-bold text-slate-600">Dispersal Index Optimal</div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Fantasyland (82%) mitigated via secondary steering into Adventureland (64%) and Tomorrowland (71%).
          </p>
        </div>

        {/* Card 3: Guest Satisfaction Pulse */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">
              Real-Time
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B2147]">94% Approval</div>
            <div className="text-xs font-bold text-slate-600">Adaptive Reroute Acceptance</div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Guests in disruption zones accepted proactive alternative suggestions within 45 seconds on average.
          </p>
        </div>
      </div>

      {/* Main Two-Column Operations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Guest Party Lookup & Itinerary Health */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[32px] p-6 sm:p-7 shadow-xl border border-slate-100 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0B2147] text-[#FFD700] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B2147]">Guest Party Lookup</h3>
                  <p className="text-xs text-slate-500">Search active in-park parties and review itinerary state</p>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guest or party name..."
                  className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs text-[#0B2147] focus:outline-none focus:ring-2 focus:ring-[#00D1FF]"
                />
              </div>
            </div>

            {/* Active Party Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0B2147]">{party.name}</span>
                    <span className="text-[10px] bg-[#0B2147] text-white px-2 py-0.5 rounded-full font-mono font-bold">
                      {party.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lead: Alex Morgan (alex.morgan@example.com) • Party of 4 (2 Adults, 2 Children)
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full self-start sm:self-auto">
                  In-Park Active
                </span>
              </div>

              {/* Party Member Tags */}
              <div className="flex flex-wrap gap-2">
                {party.members.map((m) => (
                  <span
                    key={m.id}
                    className="text-[11px] bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-xl shadow-xs"
                  >
                    <span className="font-bold text-[#0B2147]">{m.name}</span>{' '}
                    <span className="text-slate-400">({m.ageGroup}{m.age ? `, ${m.age}y` : ''})</span>
                  </span>
                ))}
              </div>

              {/* Current Active Step & Reservation Safeguards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Current Scheduled Step</div>
                  <div className="font-bold text-[#0B2147] truncate">
                    {itinerary.items[1]?.experienceName || 'Sunken Galleon & Cursed Reef'}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium">
                    Standby queue ~15m (On Schedule)
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-amber-600">Critical Dining Lock</div>
                  <div className="font-bold text-[#0B2147]">12:30 PM • Cinderella&apos;s Royal Feast</div>
                  <div className="text-[11px] text-slate-500">Party of 4 • Guaranteed Buffer</div>
                </div>
              </div>

              {/* Action: Service Recovery & Pass Issuance */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleIssueRecoveryPass('Lightning Lane Recovery Pass')}
                  className="px-3.5 py-2 rounded-xl bg-[#0B2147] text-white text-xs font-bold hover:bg-[#0D2A5B] transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
                  Issue Instant Lightning Lane
                </button>

                <button
                  onClick={() => handleIssueRecoveryPass('$25 F&B Dining Credit')}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  Grant $25 F&amp;B Recovery Credit
                </button>

                {issuedPass && (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Issued: {issuedPass} to {party.name}!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Operational Event Injector / Flow Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[32px] p-6 sm:p-7 shadow-xl border border-slate-100 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B2147]">Operational Event Simulator</h3>
                <p className="text-xs text-slate-500">Trigger live park incidents to test agentic adaptation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When an operational disruption occurs, the <strong>RealTimeAdaptationAgent</strong> evaluates whether the change is <em>material</em> (e.g. &gt;25 min delay or threat to dining), calculates alternatives, and alerts affected guests.
            </p>

            <div className="space-y-3">
              {/* Event 1: Mine Train Closure */}
              <button
                onClick={() => handleSimulate('EXPERIENCE_STATUS_CHANGED', 'exp-mythic-mine-train')}
                disabled={isInjecting !== null}
                className="w-full p-4 rounded-2xl border-2 border-rose-100 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 transition-all text-left flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B2147]">Unscheduled Attraction Closure</span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded">
                      High Impact
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Mark <strong>Seven Dwarfs Gemstone Mine</strong> as closed due to technical inspection.
                  </p>
                </div>
              </button>

              {/* Event 2: Queue Spike to 85m */}
              <button
                onClick={() => handleSimulate('WAIT_TIME_CHANGED', 'exp-mythic-mine-train')}
                disabled={isInjecting !== null}
                className="w-full p-4 rounded-2xl border-2 border-amber-100 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all text-left flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B2147]">Standby Queue Surge (+85 min)</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                      Material
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Simulate a sudden 45m -&gt; 85m standby surge threatening the 12:30 PM feast buffer.
                  </p>
                </div>
              </button>

              {/* Event 3: Weather Changed */}
              <button
                onClick={() => handleSimulate('WEATHER_CHANGED')}
                disabled={isInjecting !== null}
                className="w-full p-4 rounded-2xl border-2 border-cyan-100 bg-cyan-50/50 hover:bg-cyan-50 hover:border-cyan-300 transition-all text-left flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B2147]">Severe Weather / Thunderstorm</span>
                    <span className="text-[10px] bg-cyan-200 text-cyan-900 font-bold px-2 py-0.5 rounded">
                      Outdoor Hold
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Trigger rain alert: automatically pivots guest itinerary to indoor shows &amp; dark rides.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
