import React from 'react';
import { Recommendation, Itinerary } from '../types';
import {
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface AdaptiveRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation;
  currentItinerary: Itinerary;
  proposedItinerary: Itinerary;
  onApprove: () => void;
  onDecline: () => void;
}

export const AdaptiveRecommendationModal: React.FC<AdaptiveRecommendationModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  currentItinerary,
  proposedItinerary,
  onApprove,
  onDecline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-[36px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0B2147] text-white p-6 sm:p-8 flex items-start justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#00D1FF]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFD700] text-[#0B2147] px-2.5 py-0.5 rounded-full">
                AI Adaptation Engine
              </span>
              <span className="text-xs font-mono text-[#00D1FF]">
                Confidence: {Math.round(recommendation.confidenceScore * 100)}%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-magic text-white">
              {recommendation.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {recommendation.narrativeExplanation}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Benefit Strip */}
        <div className="bg-cyan-50 border-b border-cyan-100 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#0B2147] flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Est. Time Saved: <strong className="text-emerald-700">+{recommendation.estimatedTimeSavedMinutes} Mins</strong>
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="font-bold text-[#0B2147] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00D1FF]" />
              Reservation Impact: <strong className="text-emerald-700">100% Protected (12:30 PM Safe)</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Action requires your explicit approval</span>
        </div>

        {/* Side-by-Side Diff Section */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto max-h-[60vh]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Side-by-Side Schedule Comparison
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Current Disrupted Plan */}
            <div className="bg-slate-50 rounded-3xl p-5 border-2 border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Current Plan (Disrupted)
                </span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                  Line Spike / Closed
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {currentItinerary.items.slice(0, 5).map((item) => {
                  const isAffected = item.experienceId === recommendation.affectedExperienceId;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl flex items-center justify-between ${
                        isAffected
                          ? 'bg-rose-100/90 border border-rose-300 text-rose-900 font-bold'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-500 text-[11px]">{item.plannedStartTime}</span>
                          <span>{item.experienceName}</span>
                        </div>
                        {isAffected && (
                          <span className="text-[10px] text-rose-700 font-normal block mt-0.5">
                            ⚠ TEMPORARILY CLOSED / 85m WAIT SPIKE
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        {isAffected ? '85m' : `${item.estimatedWaitMinutes}m`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: JourneyIQ Recommended Plan */}
            <div className="bg-cyan-50/40 rounded-3xl p-5 border-2 border-[#00D1FF] space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-cyan-100 pb-2.5">
                <span className="text-xs font-bold text-[#0B2147] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#00D1FF]" />
                  Recommended Adaptive Plan
                </span>
                <span className="text-[10px] bg-[#00D1FF] text-[#0B2147] font-bold px-2 py-0.5 rounded">
                  Optimized
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {proposedItinerary.items.slice(0, 5).map((item) => {
                  const isNew = item.experienceId === recommendation.recommendedAlternativeId;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl flex items-center justify-between ${
                        isNew
                          ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-500 text-[11px]">{item.plannedStartTime}</span>
                          <span>{item.experienceName}</span>
                        </div>
                        {isNew && (
                          <span className="text-[10px] text-emerald-700 font-normal block mt-0.5">
                            ★ REPLACEMENT: 15m wait &bull; +25m saved &bull; On schedule
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-emerald-700 font-bold">
                        {item.estimatedWaitMinutes}m
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={onDecline}
            className="px-5 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors text-center"
          >
            Keep Current Plan
          </button>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={onApprove}
              className="px-7 py-3.5 rounded-2xl bg-[#0B2147] text-[#FFD700] font-bold text-xs hover:bg-[#0D2A5B] transition-all flex items-center justify-center gap-2 shadow-xl border border-amber-300/30"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00D1FF]" />
              Approve &amp; Update Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
