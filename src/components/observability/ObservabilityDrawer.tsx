import React from 'react';
import { AIDecisionRecord } from '../../types';
import { X, Activity, ShieldCheck, Cpu, Terminal, Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface ObservabilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  decisionRecords: AIDecisionRecord[];
}

export const ObservabilityDrawer: React.FC<ObservabilityDrawerProps> = ({
  isOpen,
  onClose,
  decisionRecords,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-[#081835] text-slate-100 h-full shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 bg-[#0B2147] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D1FF]/20 text-[#00D1FF] flex items-center justify-center border border-[#00D1FF]/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                JourneyIQ AI Observability
                <span className="text-[10px] uppercase font-bold bg-[#FFD700] text-[#0B2147] px-2 py-0.5 rounded-full">
                  Telemetry Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Safe workflow telemetry, agent execution logs, and deterministic verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Governance Notice */}
          <div className="bg-white/5 border border-cyan-500/30 rounded-2xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00D1FF] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Strict AI Governance & Zero CoT Leakage</span>
              This observability dashboard captures structured workflow metadata, schema validation states, tool execution telemetry, and latency metrics without exposing private model deliberation or user PII.
            </div>
          </div>

          {/* Model & Agent Architecture Card */}
          <div className="bg-[#0B2147] rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#FFD700]" />
                Active Multi-Agent Topology
              </span>
              <span className="text-xs font-mono text-[#00D1FF]">Gemini 2.5 / Flash + Guardrails</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">Agent 1</div>
                <div className="font-bold text-white">GuestContext</div>
                <div className="text-[10px] text-emerald-400">● Preferences Ready</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">Agent 2</div>
                <div className="font-bold text-white">TripPlanning</div>
                <div className="text-[10px] text-emerald-400">● Constraint Gated</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">Agent 3</div>
                <div className="font-bold text-white">Optimization</div>
                <div className="text-[10px] text-emerald-400">● Wait Benefit Rank</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">Agent 4</div>
                <div className="font-bold text-white">Adaptation</div>
                <div className="text-[10px] text-[#00D1FF]">● Materiality Radar</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">Agent 5</div>
                <div className="font-bold text-white">ActionAgent</div>
                <div className="text-[10px] text-[#FFD700]">● Guest-Approved Only</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">Guardrail</div>
                <div className="font-bold text-white">Deterministic Rules</div>
                <div className="text-[10px] text-emerald-400">● 100% Locked Dining</div>
              </div>
            </div>
          </div>

          {/* Decision Records Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#00D1FF]" />
              Recent AI Decision Audit Trail
            </h4>

            {decisionRecords.length === 0 ? (
              <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-400 text-xs">
                No real-time adaptation events triggered yet. Trigger a simulated disruption on the Live Journey screen to observe live agent telemetry.
              </div>
            ) : (
              decisionRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-[#0B2147]/80 rounded-2xl p-4 border border-white/10 space-y-3 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{record.workflow}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Validated Schema
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">Trigger: {record.trigger}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#00D1FF] font-mono">{record.latencyMs}ms</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-black/30 p-3 rounded-xl font-sans border border-white/5">
                    {record.decisionSummary}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-[#FFD700]" />
                      <span>{record.model}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#00D1FF]" />
                      <span>Confidence: {Math.round(record.confidence * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Guest Approval: {record.guestDecision || 'CONFIRMED'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1">
                    {record.toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-400 border border-white/5"
                      >
                        tool::{tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#081835] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Telemetry Protocol: OpenTelemetry v1.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FFD700] text-[#0B2147] font-bold rounded-xl hover:bg-amber-300 transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
