import React, { useState } from 'react';
import { Layers, Server, Database, Cpu, Sparkles, ShieldCheck, ArrowRight, Check, Code, GitBranch } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'PROTOTYPE' | 'PRODUCTION_TARGET'>('PROTOTYPE');

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#0B2147] rounded-[36px] p-8 sm:p-12 text-white shadow-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D1FF]/20 text-[#00D1FF] text-xs font-bold uppercase tracking-wider border border-[#00D1FF]/30">
            <Layers className="w-3.5 h-3.5" />
            System Architecture Blueprint
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white font-serif-magic">
            6-Layer Modular Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Engineered with strict separation of concerns, repository contracts, and deterministic guardrails so the demo seamlessly maps to a production enterprise deployment.
          </p>
        </div>

        {/* Prototype vs Production Target Switcher */}
        <div className="relative z-10 bg-[#081835] p-1.5 rounded-2xl border border-white/15 flex items-center self-start md:self-auto shrink-0 shadow-inner">
          <button
            onClick={() => setViewMode('PROTOTYPE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'PROTOTYPE'
                ? 'bg-[#00D1FF] text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Current Prototype Mode
          </button>
          <button
            onClick={() => setViewMode('PRODUCTION_TARGET')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'PRODUCTION_TARGET'
                ? 'bg-[#FFD700] text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Production Target Mode
          </button>
        </div>
      </div>

      {/* 6 Structural Architecture Layers */}
      <div className="space-y-4">
        {/* Layer 1: Presentation */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
              01
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Layer 1</span>
                <h3 className="text-base font-bold text-[#0B2147]">Presentation Layer (Web Client)</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {viewMode === 'PROTOTYPE'
                  ? 'React 18 + Tailwind CSS + "Vibrant Palette" theme with single-page routing, invisible Chrome debug fields, and interactive simulation launchers.'
                  : 'Next.js App Router / React SPA deployed globally to Vercel Edge with zero cold-start edge rendering and mobile PWA support.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0">
            {viewMode === 'PROTOTYPE' ? 'Vite + React 18' : 'Vercel Edge / CDN'}
          </span>
        </div>

        {/* Layer 2: Deterministic Rules & Guardrails */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
              02
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Layer 2</span>
                <h3 className="text-base font-bold text-[#0B2147]">Deterministic Domain Services &amp; Guardrails</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Enforces business constraints (operating hours, minimum walking buffers, mandatory 12:30 PM royal dining protection, 25m wait materiality threshold) that AI cannot violate.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full shrink-0 font-bold">
            Zero-Violation Guarantee
          </span>
        </div>

        {/* Layer 3: AI Multi-Agent Orchestrator */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#00D1FF] flex items-center justify-center font-bold text-sm shrink-0 border border-cyan-200">
              03
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#00D1FF] uppercase tracking-wider">Layer 3</span>
                <h3 className="text-base font-bold text-[#0B2147]">Multi-Agent Orchestrator</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {viewMode === 'PROTOTYPE'
                  ? 'Server-side Gemini 2.5/Flash pipeline executing GuestContextAgent, TripPlanningAgent, ExperienceOptimizationAgent, RealTimeAdaptationAgent, and ActionAgent.'
                  : 'Serverless Edge Functions with LangGraph / LangChain multi-agent supervisor, semantic caching, and token budgeting.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full shrink-0 font-bold">
            Gemini 2.5 / Flash
          </span>
        </div>

        {/* Layer 4: Domain Tools & Grounding */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200">
              04
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Layer 4</span>
                <h3 className="text-base font-bold text-[#0B2147]">Domain Tools &amp; Grounding Layer</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Grounds model responses using strict TypeScript function tools (getExperienceState, searchAlternatives, calculateWalkingDistance, validateConflicts) preventing hallucinations.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0">
            Typed Function Calling
          </span>
        </div>

        {/* Layer 5: Data Repositories & Adapters */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-200">
              05
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Layer 5</span>
                <h3 className="text-base font-bold text-[#0B2147]">Repository Contract &amp; Adapter Layer</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {viewMode === 'PROTOTYPE'
                  ? 'IRepository interface implemented by in-memory MockRepository with full relational domain models, seed data, and visit telemetry.'
                  : 'SupabaseAdapter implementing IRepository using PostgreSQL with Row Level Security (RLS) policies and real-time subscriptions.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-purple-800 bg-purple-100 px-3 py-1 rounded-full shrink-0 font-bold">
            {viewMode === 'PROTOTYPE' ? 'MockRepository' : 'PostgreSQL / Supabase'}
          </span>
        </div>

        {/* Layer 6: Enterprise Infrastructure */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-300">
              06
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Layer 6</span>
                <h3 className="text-base font-bold text-[#0B2147]">Enterprise Operational Ingress &amp; IAM</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {viewMode === 'PROTOTYPE'
                  ? 'Integrated simulation triggers generating synthetic operational events (closures, queue spikes, severe weather).'
                  : 'Apache Kafka / RabbitMQ event streams from park sensor mesh, Redis queue cache, and OAuth2 / OpenID Connect guest identity.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0">
            {viewMode === 'PROTOTYPE' ? 'Simulated Hooks' : 'Kafka + Redis + IAM'}
          </span>
        </div>
      </div>
    </div>
  );
};
