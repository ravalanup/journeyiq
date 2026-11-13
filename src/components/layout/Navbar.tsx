import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  User,
  Users,
  Calendar,
  Sparkles,
  PlayCircle,
  Briefcase,
  Layers,
  FileCode2,
  Activity,
  BarChart3,
  Flame,
  ShieldCheck,
  ChevronDown,
  Check,
  Cpu,
  Utensils,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { UserPersona } from '../../types';

export type TabId =
  | 'home'
  | 'profile'
  | 'party'
  | 'trip'
  | 'itinerary'
  | 'live'
  | 'summary'
  | 'feedback'
  | 'business'
  | 'architecture'
  | 'production'
  | 'strategy'
  | 'cast_ops'
  | 'pm_analytics'
  | 'cloud_console';

interface PersonaInfo {
  id: UserPersona;
  name: string;
  role: string;
  badge: string;
  description: string;
  avatarBg: string;
  avatarText: string;
  defaultTab: TabId;
}

export const PERSONAS: Record<UserPersona, PersonaInfo> = {
  PARK_GUEST: {
    id: 'PARK_GUEST',
    name: 'Alex Morgan',
    role: 'Park Guest & Family Planner',
    badge: 'Park Guest',
    description: 'Vacation planning, personal preferences, AI itinerary & day-of adaptation',
    avatarBg: 'bg-[#FFD700] text-[#0B2147]',
    avatarText: 'AM',
    defaultTab: 'home',
  },
  CAST_MEMBER: {
    id: 'CAST_MEMBER',
    name: 'Officer Sarah Jenkins',
    role: 'Cast Member & Operations',
    badge: 'Cast Member',
    description: 'Guest relations, crowd dispersal, 12:30 PM dining lock & recovery passes',
    avatarBg: 'bg-emerald-500 text-white',
    avatarText: 'SJ',
    defaultTab: 'cast_ops',
  },
  PRODUCT_MANAGER: {
    id: 'PRODUCT_MANAGER',
    name: 'Maya Lin',
    role: 'Product Manager',
    badge: 'Product Manager',
    description: 'App usage metrics, feature adoption, recommendation conversion & ROI',
    avatarBg: 'bg-[#00D1FF] text-[#0B2147]',
    avatarText: 'ML',
    defaultTab: 'pm_analytics',
  },
  AI_CLOUD_ARCHITECT: {
    id: 'AI_CLOUD_ARCHITECT',
    name: 'Dr. Chen',
    role: 'AI Safety & Cloud Architect',
    badge: 'AI & Cloud Architect',
    description: 'Site health, 6-layer architecture, deployment options & trace auditing',
    avatarBg: 'bg-purple-600 text-white',
    avatarText: 'DC',
    defaultTab: 'cloud_console',
  },
};

interface NavbarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  currentPersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  visitCount: number;
  onOpenObservability: () => void;
  onOpenAnalytics: () => void;
  activeDisruptionCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentPersona,
  onSelectPersona,
  visitCount,
  onOpenObservability,
  onOpenAnalytics,
  activeDisruptionCount = 0,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activePersonaInfo = PERSONAS[currentPersona] || PERSONAS.PARK_GUEST;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchPersona = (persona: UserPersona) => {
    onSelectPersona(persona);
    onSelectTab(PERSONAS[persona].defaultTab);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-[#0B2147] text-white border-b border-white/10 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => onSelectTab(activePersonaInfo.defaultTab)}
          >
            <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center text-[#0B2147] font-serif font-black text-xl shadow-md border-2 border-amber-300">
              J
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-serif font-bold tracking-tight text-white">JourneyIQ</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#00D1FF]/20 text-[#00D1FF] rounded border border-[#00D1FF]/30">
                  Adaptive
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden md:block">Theme Park Guest Intelligence</p>
            </div>
          </div>

          {/* Persona-Filtered Primary Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1">
            {/* 1. PARK GUEST TABS */}
            {currentPersona === 'PARK_GUEST' && (
              <>
                <button
                  onClick={() => onSelectTab('home')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'home'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => onSelectTab('profile')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => onSelectTab('party')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'party'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Party</span>
                </button>

                <button
                  onClick={() => onSelectTab('trip')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'trip'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Trip Setup</span>
                </button>

                <button
                  onClick={() => onSelectTab('itinerary')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'itinerary'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00D1FF]" />
                  <span>AI Itinerary</span>
                </button>

                <button
                  onClick={() => onSelectTab('live')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors relative ${
                    activeTab === 'live'
                      ? 'bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Journey</span>
                  {activeDisruptionCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1"></span>
                  )}
                </button>

                <button
                  onClick={() => onSelectTab('summary')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'summary'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Summary</span>
                </button>

                <button
                  onClick={() => onSelectTab('feedback')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'feedback'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Feedback</span>
                </button>
              </>
            )}

            {/* 2. CAST MEMBER TABS */}
            {currentPersona === 'CAST_MEMBER' && (
              <>
                <button
                  onClick={() => onSelectTab('cast_ops')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'cast_ops'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Operations Command</span>
                </button>

                <button
                  onClick={() => onSelectTab('party')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'party'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Party Roster</span>
                </button>

                <button
                  onClick={() => onSelectTab('live')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'live'
                      ? 'bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Guest Radar</span>
                </button>
              </>
            )}

            {/* 3. PRODUCT MANAGER TABS */}
            {currentPersona === 'PRODUCT_MANAGER' && (
              <>
                <button
                  onClick={() => onSelectTab('pm_analytics')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'pm_analytics'
                      ? 'bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#00D1FF]" />
                  <span>Adoption &amp; Usage</span>
                </button>

                <button
                  onClick={() => onSelectTab('business')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'business'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>Business ROI</span>
                </button>

                <button
                  onClick={() => onSelectTab('feedback')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'feedback'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Guest Sentiment</span>
                </button>
              </>
            )}

            {/* 4. AI SAFETY & CLOUD ARCHITECT TABS */}
            {currentPersona === 'AI_CLOUD_ARCHITECT' && (
              <>
                <button
                  onClick={() => onSelectTab('cloud_console')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'cloud_console'
                      ? 'bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-[#00D1FF]" />
                  <span>Site Health &amp; Console</span>
                </button>

                <button
                  onClick={() => onSelectTab('architecture')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'architecture'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>6-Layer Architecture</span>
                </button>

                <button
                  onClick={() => onSelectTab('strategy')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'strategy'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Deployment Strategy</span>
                </button>

                <button
                  onClick={() => onSelectTab('production')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeTab === 'production'
                      ? 'bg-white/15 text-[#FFD700] border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Vercel Guide</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Tools & UPPER-RIGHT PERSONA SWITCHER DROPDOWN */}
          <div className="flex items-center gap-3">
            {/* Role-specific telemetry shortcuts */}
            {currentPersona === 'PRODUCT_MANAGER' && (
              <div
                onClick={onOpenAnalytics}
                className="bg-[#081835] px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-2 cursor-pointer hover:border-[#00D1FF]/50 transition-all shadow-inner"
                title="Click to view full analytics drawer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#00D1FF]" />
                <div className="text-left hidden sm:block">
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Sessions
                  </div>
                  <div className="text-xs font-bold text-white font-mono">{visitCount.toLocaleString()}</div>
                </div>
              </div>
            )}

            {currentPersona === 'AI_CLOUD_ARCHITECT' && (
              <button
                onClick={onOpenObservability}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[#FFD700] flex items-center gap-1.5 border border-white/15 transition-all shadow-sm"
                title="Open AI Observability Traces"
              >
                <Activity className="w-3.5 h-3.5 text-[#00D1FF]" />
                <span className="hidden sm:inline">AI Traces</span>
              </button>
            )}

            {/* UPPER-RIGHT PERSONA SELECTOR DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 bg-[#081835] hover:bg-[#0c224a] px-3.5 py-2 rounded-2xl border border-white/20 transition-all shadow-md group"
              >
                {/* User Avatar Circle */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs font-mono shadow-xs ${activePersonaInfo.avatarBg}`}
                >
                  {activePersonaInfo.avatarText}
                </div>

                {/* User Details */}
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    {activePersonaInfo.badge}
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-[130px]">
                    {activePersonaInfo.name}
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Persona Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-84 bg-[#081835] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3.5 bg-[#0B2147] border-b border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Switch User Persona
                    </span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Select a role to see their role-specific tools, views, and data.
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    {(Object.keys(PERSONAS) as UserPersona[]).map((key) => {
                      const p = PERSONAS[key];
                      const isSelected = currentPersona === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleSwitchPersona(key)}
                          className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-white/15 border border-white/20'
                              : 'hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm ${p.avatarBg}`}
                          >
                            {p.avatarText}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white truncate">{p.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#00D1FF] shrink-0" />}
                            </div>
                            <span className="text-[10px] text-amber-300 font-bold block">{p.badge}</span>
                            <p className="text-[11px] text-slate-400 leading-tight mt-1 line-clamp-2">
                              {p.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sub-bar */}
      <div className="xl:hidden flex items-center overflow-x-auto px-4 py-2 bg-[#081835] border-t border-white/10 space-x-2 text-xs no-scrollbar">
        {currentPersona === 'PARK_GUEST' && (
          <>
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'home' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onSelectTab('profile')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => onSelectTab('party')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'party' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Party
            </button>
            <button
              onClick={() => onSelectTab('itinerary')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'itinerary' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              AI Itinerary
            </button>
            <button
              onClick={() => onSelectTab('live')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'live' ? 'bg-[#00D1FF] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Live Journey
            </button>
            <button
              onClick={() => onSelectTab('summary')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'summary' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Summary
            </button>
          </>
        )}

        {currentPersona === 'CAST_MEMBER' && (
          <>
            <button
              onClick={() => onSelectTab('cast_ops')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'cast_ops' ? 'bg-emerald-400 text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Operations Command
            </button>
            <button
              onClick={() => onSelectTab('party')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'party' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Party Roster
            </button>
            <button
              onClick={() => onSelectTab('live')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'live' ? 'bg-[#00D1FF] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Guest Radar
            </button>
          </>
        )}

        {currentPersona === 'PRODUCT_MANAGER' && (
          <>
            <button
              onClick={() => onSelectTab('pm_analytics')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'pm_analytics' ? 'bg-[#00D1FF] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Adoption &amp; Usage
            </button>
            <button
              onClick={() => onSelectTab('business')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'business' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Business ROI
            </button>
            <button
              onClick={() => onSelectTab('feedback')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'feedback' ? 'bg-purple-400 text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Guest Sentiment
            </button>
          </>
        )}

        {currentPersona === 'AI_CLOUD_ARCHITECT' && (
          <>
            <button
              onClick={() => onSelectTab('cloud_console')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'cloud_console' ? 'bg-[#00D1FF] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Site Health
            </button>
            <button
              onClick={() => onSelectTab('architecture')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'architecture' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => onSelectTab('strategy')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'strategy' ? 'bg-purple-400 text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Strategy
            </button>
            <button
              onClick={() => onSelectTab('production')}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                activeTab === 'production' ? 'bg-[#FFD700] text-[#0B2147] font-bold' : 'text-slate-300'
              }`}
            >
              Vercel Guide
            </button>
          </>
        )}
      </div>
    </header>
  );
};
