import React, { useState } from 'react';
import { ClarifyingStrategy } from '../../types';
import { Sparkles, Server, Database, Eye, Cpu, Check, Layers } from 'lucide-react';

interface ClarifyingStrategyWidgetProps {
  strategy: ClarifyingStrategy;
  onStrategyChange: (newStrategy: ClarifyingStrategy) => void;
}

export const ClarifyingStrategyWidget: React.FC<ClarifyingStrategyWidgetProps> = ({
  strategy,
  onStrategyChange,
}) => {
  return (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-xl border border-slate-100 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0B2147] text-[#FFD700] flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B2147] flex items-center gap-2">
              Architecture & Strategy Selection
            </h2>
            <p className="text-xs text-slate-500">
              Select your target production configuration and live demo operating modes
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Ready for Vercel & Cloud Deployment
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Deployment Strategy */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Server className="w-3.5 h-3.5 text-[#00D1FF]" />
            <span>1. Deployment Target</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => onStrategyChange({ ...strategy, deployment: 'SERVERLESS_VERCEL' })}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                strategy.deployment === 'SERVERLESS_VERCEL'
                  ? 'border-[#00D1FF] bg-cyan-50/60 shadow-sm'
                  : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div>
                <span className="text-sm font-bold text-[#0B2147] block">Vercel Serverless / Edge</span>
                <span className="text-[11px] text-slate-500">Zero cold-start edge API routes</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  strategy.deployment === 'SERVERLESS_VERCEL'
                    ? 'bg-[#00D1FF] text-white border-2 border-white'
                    : 'border-2 border-slate-300'
                }`}
              >
                {strategy.deployment === 'SERVERLESS_VERCEL' && <Check className="w-3 h-3" />}
              </div>
            </button>

            <button
              onClick={() => onStrategyChange({ ...strategy, deployment: 'CONTAINERIZED_CLOUD_RUN' })}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                strategy.deployment === 'CONTAINERIZED_CLOUD_RUN'
                  ? 'border-[#00D1FF] bg-cyan-50/60 shadow-sm'
                  : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div>
                <span className="text-sm font-bold text-[#0B2147] block">Containerized Cloud Run / Node</span>
                <span className="text-[11px] text-slate-500">Scalable full-stack microservices</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  strategy.deployment === 'CONTAINERIZED_CLOUD_RUN'
                    ? 'bg-[#00D1FF] text-white border-2 border-white'
                    : 'border-2 border-slate-300'
                }`}
              >
                {strategy.deployment === 'CONTAINERIZED_CLOUD_RUN' && <Check className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </div>

        {/* 2. Persistence Layer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Database className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>2. Persistence Layer</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => onStrategyChange({ ...strategy, persistence: 'RELATIONAL_POSTGRES' })}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                strategy.persistence === 'RELATIONAL_POSTGRES'
                  ? 'border-[#00D1FF] bg-cyan-50/60 shadow-sm'
                  : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div>
                <span className="text-sm font-bold text-[#0B2147] block">Supabase / PostgreSQL</span>
                <span className="text-[11px] text-slate-500">Relational schema with RLS security</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  strategy.persistence === 'RELATIONAL_POSTGRES'
                    ? 'bg-[#00D1FF] text-white border-2 border-white'
                    : 'border-2 border-slate-300'
                }`}
              >
                {strategy.persistence === 'RELATIONAL_POSTGRES' && <Check className="w-3 h-3" />}
              </div>
            </button>

            <button
              onClick={() => onStrategyChange({ ...strategy, persistence: 'NOSQL_FLEXIBLE' })}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                strategy.persistence === 'NOSQL_FLEXIBLE'
                  ? 'border-[#00D1FF] bg-cyan-50/60 shadow-sm'
                  : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div>
                <span className="text-sm font-bold text-[#0B2147] block">In-Memory / Synthetic Mock</span>
                <span className="text-[11px] text-slate-500">Fast in-memory relational sandbox</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  strategy.persistence === 'NOSQL_FLEXIBLE'
                    ? 'bg-[#00D1FF] text-white border-2 border-white'
                    : 'border-2 border-slate-300'
                }`}
              >
                {strategy.persistence === 'NOSQL_FLEXIBLE' && <Check className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </div>

        {/* 3. Analytic Visibility */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-emerald-500" />
            <span>3. Analytics & Telemetry</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => onStrategyChange({ ...strategy, visibility: 'FULL_EVENTS' })}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                strategy.visibility === 'FULL_EVENTS'
                  ? 'border-[#00D1FF] bg-cyan-50/60 shadow-sm'
                  : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div>
                <span className="text-sm font-bold text-[#0B2147] block">Full Event Telemetry</span>
                <span className="text-[11px] text-slate-500">Tracks visits, clicks & hidden Chrome tags</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  strategy.visibility === 'FULL_EVENTS'
                    ? 'bg-[#00D1FF] text-white border-2 border-white'
                    : 'border-2 border-slate-300'
                }`}
              >
                {strategy.visibility === 'FULL_EVENTS' && <Check className="w-3 h-3" />}
              </div>
            </button>

            <button
              onClick={() => onStrategyChange({ ...strategy, visibility: 'AGGREGATED_PULSE' })}
              className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                strategy.visibility === 'AGGREGATED_PULSE'
                  ? 'border-[#00D1FF] bg-cyan-50/60 shadow-sm'
                  : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div>
                <span className="text-sm font-bold text-[#0B2147] block">Aggregated Pulse Mode</span>
                <span className="text-[11px] text-slate-500">Summary statistics only</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  strategy.visibility === 'AGGREGATED_PULSE'
                    ? 'bg-[#00D1FF] text-white border-2 border-white'
                    : 'border-2 border-slate-300'
                }`}
              >
                {strategy.visibility === 'AGGREGATED_PULSE' && <Check className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
