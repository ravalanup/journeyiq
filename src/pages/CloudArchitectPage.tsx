import React, { useState } from 'react';
import {
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
  FileCode2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Terminal,
  Clock,
  Zap,
} from 'lucide-react';
import { ArchitecturePage } from './ArchitecturePage';
import { ProductionGuidePage } from './ProductionGuidePage';
import { ClarifyingStrategyWidget } from '../components/clarifying/ClarifyingStrategyWidget';
import { AIDecisionRecord, ClarifyingStrategy } from '../types';

interface CloudArchitectPageProps {
  decisionRecords: AIDecisionRecord[];
  strategy: ClarifyingStrategy;
  onStrategyChange: (newStrategy: ClarifyingStrategy) => void;
  onOpenObservabilityDrawer?: () => void;
}

export const CloudArchitectPage: React.FC<CloudArchitectPageProps> = ({
  decisionRecords,
  strategy,
  onStrategyChange,
  onOpenObservabilityDrawer,
}) => {
  const [subTab, setSubTab] = useState<'HEALTH' | 'ARCHITECTURE' | 'STRATEGY' | 'OBSERVABILITY' | 'MIGRATION'>('HEALTH');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#0B2147] rounded-[36px] p-8 sm:p-10 text-white shadow-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D1FF]/20 text-[#00D1FF] text-xs font-bold uppercase tracking-wider border border-[#00D1FF]/30">
            <Cpu className="w-3.5 h-3.5" />
            AI Safety &amp; Cloud Architect Console
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white font-serif-magic">
            Infrastructure &amp; AI Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Site health monitoring, 6-layer decoupled architecture, Vercel/Cloud Run deployment strategy, and safe AI agent telemetry.
          </p>
        </div>

        {/* Console Sub-Navigation Tabs */}
        <div className="bg-[#081835] p-1.5 rounded-2xl border border-white/15 flex flex-wrap items-center self-start md:self-auto shrink-0 shadow-inner gap-1">
          <button
            onClick={() => setSubTab('HEALTH')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'HEALTH'
                ? 'bg-[#00D1FF] text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Site Health
          </button>
          <button
            onClick={() => setSubTab('ARCHITECTURE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'ARCHITECTURE'
                ? 'bg-[#FFD700] text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setSubTab('STRATEGY')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'STRATEGY'
                ? 'bg-purple-400 text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Strategy
          </button>
          <button
            onClick={() => setSubTab('OBSERVABILITY')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'OBSERVABILITY'
                ? 'bg-emerald-400 text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Observability
          </button>
          <button
            onClick={() => setSubTab('MIGRATION')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'MIGRATION'
                ? 'bg-amber-400 text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vercel Guide
          </button>
        </div>
      </div>

      {/* Sub-tab views */}
      {subTab === 'HEALTH' && (
        <div className="space-y-8">
          {/* 4 Health Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edge API Status</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 font-mono">100% Operational</div>
              <p className="text-xs text-slate-500">Global Vercel Edge &amp; Cloud Run ingress</p>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">API Latency</span>
                <span className="text-xs text-slate-400 font-mono">p95</span>
              </div>
              <div className="text-2xl font-bold text-[#0B2147] font-mono">380 ms</div>
              <p className="text-xs text-slate-500">p50: 180ms • Cache hit: 62%</p>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gemini Engine</span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>
              <div className="text-2xl font-bold text-cyan-600 font-mono">Gemini 2.5/Flash</div>
              <p className="text-xs text-slate-500">Strict deterministic safety filter active</p>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Error Rate</span>
                <span className="text-xs text-emerald-600 font-bold">Passing</span>
              </div>
              <div className="text-2xl font-bold text-[#0B2147] font-mono">0.00%</div>
              <p className="text-xs text-slate-500">Zero unhandled exceptions logged</p>
            </div>
          </div>

          {/* Architecture Guardrail & Site Health Details */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B2147]">AI Safety Guardrail &amp; Deterministic Invariants</h3>
                <p className="text-xs text-slate-500">Hard rules evaluated independently of model generation</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Unbreakable Verification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Guardrail 1</div>
                <h4 className="text-sm font-bold text-[#0B2147]">Mandatory Dining Protection</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The model cannot propose any itinerary where an attraction finish time is less than 15 minutes prior to a confirmed table-service reservation window.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Guardrail 2</div>
                <h4 className="text-sm font-bold text-[#0B2147]">Physical Walking Physics</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Walking transitions are validated against real geospatial distance matrices. Instant teleportation across lands is mathematically rejected.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">Guardrail 3</div>
                <h4 className="text-sm font-bold text-[#0B2147]">Materiality Threshold</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Standby wait time fluctuations under 25 minutes do not trigger guest interruptions, preventing alert fatigue and maintaining a calm experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'ARCHITECTURE' && <ArchitecturePage />}

      {subTab === 'STRATEGY' && (
        <ClarifyingStrategyWidget strategy={strategy} onStrategyChange={onStrategyChange} />
      )}

      {subTab === 'OBSERVABILITY' && (
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B2147] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#00D1FF]" />
                Live AI Decision Records &amp; Agent Traces
              </h3>
              <p className="text-xs text-slate-500">
                Structured decision records with tool calls, confidence scores, and strict CoT redactions.
              </p>
            </div>
            {onOpenObservabilityDrawer && (
              <button
                onClick={onOpenObservabilityDrawer}
                className="px-4 py-2 rounded-xl bg-[#0B2147] text-white text-xs font-bold hover:bg-[#0D2A5B] transition-colors flex items-center gap-2 self-start sm:self-auto"
              >
                <Terminal className="w-3.5 h-3.5 text-[#FFD700]" />
                Open Slideout Drawer
              </button>
            )}
          </div>

          <div className="space-y-4">
            {decisionRecords.map((record) => (
              <div
                key={record.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-[#0B2147] text-white px-2.5 py-1 rounded-lg">
                      {record.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{record.workflow}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-slate-500">{record.model}</span>
                    <span className="font-mono text-emerald-600 font-bold">{record.latencyMs}ms</span>
                    <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 font-bold rounded">
                      {(record.confidence * 100).toFixed(0)}% Conf
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {record.decisionSummary}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tools:</span>
                  {record.toolsUsed.map((tool) => (
                    <span
                      key={tool}
                      className="text-[11px] font-mono bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg"
                    >
                      {tool}()
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'MIGRATION' && <ProductionGuidePage />}
    </div>
  );
};
