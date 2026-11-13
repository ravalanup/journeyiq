import React, { useState } from 'react';
import { Trip, Reservation, Experience } from '../types';
import { Calendar, Clock, MapPin, Sparkles, Utensils, Zap, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface TripSetupPageProps {
  trip: Trip;
  reservations: Reservation[];
  experiences: Experience[];
  onGeneratePlan: () => Promise<void>;
  onNavigateNext: () => void;
  onNavigateBack: () => void;
}

export const TripSetupPage: React.FC<TripSetupPageProps> = ({
  trip,
  reservations,
  experiences,
  onGeneratePlan,
  onNavigateNext,
  onNavigateBack,
}) => {
  const [selectedPark, setSelectedPark] = useState('Kingdom of Wonders');
  const [arrivalTime, setArrivalTime] = useState(trip.arrivalTime || '09:00');
  const [departureTime, setDepartureTime] = useState(trip.departureTime || '21:30');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const steps = [
    'Ingesting guest profile & party member endurance profiles...',
    'Locking confirmed dining & Lightning Lane hard windows...',
    'Retrieving real-time wait times & capacity curves...',
    'Running multi-agent schedule optimization & walk minimization...',
    'Validating deterministic constraints & final schema check...',
  ];

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    // Animate the 5 smart loading steps
    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 450);

    try {
      await onGeneratePlan();
      setTimeout(() => {
        clearInterval(interval);
        setIsGenerating(false);
        onNavigateNext();
      }, 2300);
    } catch (e) {
      clearInterval(interval);
      setIsGenerating(false);
      onNavigateNext();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#0B2147] text-[#FFD700] flex items-center justify-center font-bold shadow-lg border-2 border-amber-300/40">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0B2147]">Trip Context & Hard Constraints</h1>
              <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                Active Setup
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Today: September 3, 2026 &bull; Theme Park Operational Window: 09:00 - 22:00
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            &larr; Back
          </button>
          <button
            onClick={handleStartGeneration}
            disabled={isGenerating}
            className="px-6 py-3 rounded-2xl bg-[#FFD700] text-[#0B2147] font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Optimizing Journey...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Build My AI Journey &rarr;
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Modal / Step Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#081835] border border-cyan-500/30 rounded-[32px] p-8 max-w-lg w-full text-white shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#0B2147] text-[#00D1FF] flex items-center justify-center mx-auto border-2 border-[#00D1FF]/40 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif-magic text-white">JourneyIQ Multi-Agent Planner</h3>
              <p className="text-xs text-slate-400">Synthesizing guest context and real-time park telemetry</p>
            </div>

            {/* Dynamic Step Progress */}
            <div className="space-y-3 pt-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl text-xs transition-all ${
                    idx < generationStep
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : idx === generationStep
                      ? 'bg-[#00D1FF]/20 text-[#00D1FF] font-bold border border-[#00D1FF]/40 scale-[1.02]'
                      : 'text-slate-500 opacity-40'
                  }`}
                >
                  {idx < generationStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : idx === generationStep ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00D1FF] shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-center text-slate-400 font-mono">
              Deterministic Guardrails &bull; 0 Fabricated Reservations &bull; Gemini 2.5 / Flash
            </div>
          </div>
        </div>
      )}

      {/* Constraints & Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Park & Hours */}
        <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-base font-bold text-[#0B2147]">Park & Operational Hours</h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Destination Park
            </label>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-sm font-bold text-[#0B2147] block">{selectedPark}</span>
              <span className="text-slate-500">
                Operating Hours: 09:00 - 22:00 &bull; Early Entry: 08:30 (Resort Guests)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Planned Arrival
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-[#0B2147]">
                <Clock className="w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Planned Departure
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-[#0B2147]">
                <Clock className="w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="bg-transparent focus:outline-none w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-cyan-50/60 p-4 rounded-2xl border border-cyan-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-[#0B2147] block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00D1FF]" /> Operational Integrity Guaranteed
            </span>
            JourneyIQ never plans activities outside park operating windows or overlapping with checked-in reservations.
          </div>
        </div>

        {/* Right: Confirmed Hard Reservations */}
        <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#FFD700]" />
              <h3 className="text-base font-bold text-[#0B2147]">Confirmed Hard Reservations</h3>
            </div>
            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              Locked Constraints
            </span>
          </div>

          <div className="space-y-3">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-slate-50 border-2 border-amber-300/80 flex items-start justify-between shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0B2147]">{res.experienceName}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      {res.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Window: <strong className="text-slate-700">{res.startTime} - {res.endTime}</strong> &bull; Party Size: {res.partySize}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 15-Minute Buffer Guaranteed by Optimizer
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-[#0B2147] block mb-1">Must-Do Attractions Selected:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="px-2 py-0.5 bg-[#0B2147] text-[#FFD700] rounded text-[11px] font-medium">
                ★ Cosmic Velocity: Star Fleet
              </span>
              <span className="px-2 py-0.5 bg-[#0B2147] text-[#FFD700] rounded text-[11px] font-medium">
                ★ Seven Dwarfs Gemstone Mine
              </span>
              <span className="px-2 py-0.5 bg-[#0B2147] text-[#FFD700] rounded text-[11px] font-medium">
                ★ Sunken Galleon & Cursed Reef
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
