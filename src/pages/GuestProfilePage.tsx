import React, { useState } from 'react';
import { Guest, GuestPreferences } from '../types';
import { User, Sparkles, Heart, Shield, Gauge, Utensils, Footprints, Flame, Check, Info } from 'lucide-react';

interface GuestProfilePageProps {
  guest: Guest;
  onUpdatePreferences: (preferences: GuestPreferences) => void;
  onNavigateNext: () => void;
}

export const GuestProfilePage: React.FC<GuestProfilePageProps> = ({
  guest,
  onUpdatePreferences,
  onNavigateNext,
}) => {
  const [preferences, setPreferences] = useState<GuestPreferences>({ ...guest.preferences });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    onUpdatePreferences(preferences);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const toggleCategory = (cat: string) => {
    const exists = preferences.favoriteCategories.includes(cat);
    const updated = exists
      ? preferences.favoriteCategories.filter((c) => c !== cat)
      : [...preferences.favoriteCategories, cat];
    setPreferences({ ...preferences, favoriteCategories: updated });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#0B2147] text-[#FFD700] flex items-center justify-center font-serif font-black text-2xl shadow-lg border-2 border-amber-300/40">
            {guest.firstName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0B2147]">
                {guest.firstName} {guest.lastName}
              </h1>
              <span className="text-[10px] uppercase font-bold bg-[#00D1FF]/20 text-[#0B2147] px-2 py-0.5 rounded-md border border-[#00D1FF]/30">
                Primary Planner
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {guest.homeRegion} &bull; Account: {guest.email} &bull; AI Personalization Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> Preferences Saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-[#0B2147] text-[#FFD700] font-bold text-xs hover:bg-[#0D2A5B] transition-colors shadow-md"
          >
            Save Profile
          </button>
          <button
            onClick={onNavigateNext}
            className="px-5 py-2.5 rounded-2xl bg-[#FFD700] text-[#0B2147] font-bold text-xs hover:bg-amber-300 transition-colors shadow-md"
          >
            Configure Party &rarr;
          </button>
        </div>
      </div>

      {/* AI Personalization Notice Card */}
      <div className="bg-gradient-to-r from-blue-900 to-[#0B2147] rounded-2xl p-5 text-white shadow-md border border-white/10 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#00D1FF] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-200 leading-relaxed">
          <strong className="text-white">How JourneyIQ Uses Your Profile:</strong> These preference signals directly calibrate the Multi-Agent Experience Optimization weights. The AI prioritizes your favorite experience types, minimizes heat fatigue during midday, and guarantees that confirmed dining reservations remain 100% protected.
        </div>
      </div>

      {/* Preferences Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Pace & Thrill Tolerances */}
        <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Gauge className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-base font-bold text-[#0B2147]">Pace, Thrill & Crowds</h3>
          </div>

          {/* Pace */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Trip Pace Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['RELAXED', 'MODERATE', 'INTENSIVE'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, pace: p })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    preferences.pace === p
                      ? 'bg-[#0B2147] text-[#FFD700] border-[#0B2147] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Thrill Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Thrill Tolerance
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['LOW', 'MODERATE', 'HIGH', 'EXTREME'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, thrillLevel: t })}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    preferences.thrillLevel === t
                      ? 'bg-[#0B2147] text-[#00D1FF] border-[#0B2147] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Walking Tolerance */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Walking Distance Tolerance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOW', 'MODERATE', 'HIGH'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, walkingTolerance: w })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    preferences.walkingTolerance === w
                      ? 'bg-[#0B2147] text-white border-[#0B2147] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Crowd Tolerance */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Crowd Sensitivity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, crowdTolerance: c })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    preferences.crowdTolerance === c
                      ? 'bg-[#0B2147] text-white border-[#0B2147] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Dining, Weather & Experience Categories */}
        <div className="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Utensils className="w-4 h-4 text-[#FFD700]" />
            <h3 className="text-base font-bold text-[#0B2147]">Dining & Environmental Guardrails</h3>
          </div>

          {/* Dining Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Dining Style Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'TABLE_SERVICE', label: 'Table Service' },
                { key: 'QUICK_SERVICE', label: 'Quick Service' },
                { key: 'CHARACTER_DINING', label: 'Character Feast' },
                { key: 'SNACK_FOCUSED', label: 'Snack Grazing' },
              ].map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, diningPreference: d.key as any })}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border text-left ${
                    preferences.diningPreference === d.key
                      ? 'bg-[#0B2147] text-[#FFD700] border-[#0B2147] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hard Constraints & Environmental Preferences */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Autonomous Safety Rules
            </label>

            <div
              onClick={() =>
                setPreferences({
                  ...preferences,
                  protectReservationsAboveAll: !preferences.protectReservationsAboveAll,
                })
              }
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                preferences.protectReservationsAboveAll
                  ? 'border-[#00D1FF] bg-cyan-50/50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#0B2147] block">Strict Reservation Protection</span>
                <span className="text-[11px] text-slate-500">
                  Enforces 15-min arrival buffer before confirmed dining & Lightning Lanes
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  preferences.protectReservationsAboveAll ? 'bg-[#00D1FF] text-white' : 'border-2 border-slate-300'
                }`}
              >
                {preferences.protectReservationsAboveAll && <Check className="w-3 h-3" />}
              </div>
            </div>

            <div
              onClick={() =>
                setPreferences({
                  ...preferences,
                  indoorPreferenceInHeatOrRain: !preferences.indoorPreferenceInHeatOrRain,
                })
              }
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                preferences.indoorPreferenceInHeatOrRain
                  ? 'border-[#00D1FF] bg-cyan-50/50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#0B2147] block">Midday Air-Conditioned Routing</span>
                <span className="text-[11px] text-slate-500">
                  Favors indoor dark rides and shows during peak afternoon heat (13:00 - 15:30)
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  preferences.indoorPreferenceInHeatOrRain ? 'bg-[#00D1FF] text-white' : 'border-2 border-slate-300'
                }`}
              >
                {preferences.indoorPreferenceInHeatOrRain && <Check className="w-3 h-3" />}
              </div>
            </div>
          </div>

          {/* Favorite Categories */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Experience Categories of Interest
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'FAMILY_ADVENTURE', label: 'Family Adventure' },
                { id: 'DARK_RIDE', label: 'Immersive Dark Rides' },
                { id: 'THRILL_RIDE', label: 'High Thrills' },
                { id: 'LIVE_SHOW', label: 'Live Theatrical Shows' },
                { id: 'CHARACTER_GREETING', label: 'Character Greetings' },
                { id: 'TABLE_SERVICE_DINING', label: 'Royal Banquets' },
              ].map((c) => {
                const isSelected = preferences.favoriteCategories.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#FFD700] text-[#0B2147] border-[#FFD700] shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
