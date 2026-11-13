import React from 'react';
import { Briefcase, TrendingUp, Users, ShieldCheck, DollarSign, Sparkles, Award, HeartHandshake, Layers } from 'lucide-react';

export const BusinessValuePage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#0B2147] rounded-[36px] p-8 sm:p-12 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold uppercase tracking-wider border border-[#FFD700]/30">
            <Briefcase className="w-3.5 h-3.5" />
            Executive Business Value &amp; ROI Case
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white font-serif-magic">
            Unlocking Park Capacity &amp; Guest Lifetime Value
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            JourneyIQ provides theme park operators with an intelligent demand-smoothing engine that increases in-park merchandise & dining dwell times while eliminating guest friction caused by attraction downtime.
          </p>
        </div>
      </div>

      {/* 4 Core Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Guest Satisfaction & NPS */}
        <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FFD700] flex items-center justify-center font-bold border border-amber-200">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pillar 01</span>
              <h3 className="text-base font-bold text-[#0B2147]">Guest Experience &amp; NPS Lift</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminates the &quot;ruined vacation&quot; anxiety caused by unexpected ride closures. Proactive explanations and seamless one-tap alternatives keep families feeling cared for rather than abandoned in long queues.
          </p>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Modeled NPS Impact:</span>
            <span className="font-bold text-emerald-600 font-mono">+18 Point Net Lift</span>
          </div>
        </div>

        {/* Pillar 2: Operational Flow & Capacity Smoothing */}
        <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#00D1FF] flex items-center justify-center font-bold border border-cyan-200">
              <TrendingUp className="w-6 h-6 text-[#00D1FF]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#00D1FF] uppercase tracking-wider">Pillar 02</span>
              <h3 className="text-base font-bold text-[#0B2147]">Demand Redistribution &amp; Capacity</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When marquee attractions surge beyond target thresholds, JourneyIQ gently steers flexible parties toward under-utilized secondary attractions and shows, balancing the park&apos;s physical load in real-time.
          </p>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Queue Peak Smoothing:</span>
            <span className="font-bold text-emerald-600 font-mono">-22% Bottleneck Spikes</span>
          </div>
        </div>

        {/* Pillar 3: Ancillary Revenue & Dwell Times */}
        <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Pillar 03</span>
              <h3 className="text-base font-bold text-[#0B2147]">Per-Capita In-Park Spend</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Time saved from standing in stagnant 90-minute lines translates directly into relaxed dining, boutique retail visits, and premium snack experiences across all themed lands.
          </p>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Per-Capita F&amp;B Lift:</span>
            <span className="font-bold text-emerald-600 font-mono">+12.4% Secondary Spend</span>
          </div>
        </div>

        {/* Pillar 4: Guest Trust & Repeat Loyalty */}
        <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-200">
              <HeartHandshake className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Pillar 04</span>
              <h3 className="text-base font-bold text-[#0B2147]">Guest Agency &amp; Trust</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike rigid black-box schedulers that mandate where guests must go, JourneyIQ serves as a trusted advisor with human-in-the-loop approvals, building immense brand loyalty.
          </p>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Guest Recommendation Acceptance:</span>
            <span className="font-bold text-[#0B2147] font-mono">94% Approval Rate</span>
          </div>
        </div>
      </div>

      {/* Synthetic Metric Notice Banner */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>
          <strong>Note:</strong> All ROI metrics displayed in this section are synthetic illustrative models based on canonical resort operational benchmarks.
        </span>
        <span className="font-mono text-[10px] text-slate-400">JourneyIQ v2.5 Economic Model</span>
      </div>
    </div>
  );
};
