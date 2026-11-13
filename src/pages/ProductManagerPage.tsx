import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Sparkles,
  CheckCircle2,
  DollarSign,
  HeartHandshake,
  Star,
  Activity,
  ArrowUpRight,
  MousePointerClick,
  Filter,
} from 'lucide-react';
import { BusinessValuePage } from './BusinessValuePage';

interface ProductManagerPageProps {
  visitCount: number;
  featureClicks: Record<string, number>;
  acceptanceRatePct?: number;
}

export const ProductManagerPage: React.FC<ProductManagerPageProps> = ({
  visitCount,
  featureClicks,
  acceptanceRatePct = 94,
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'ROI' | 'FEEDBACK'>('METRICS');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#0B2147] rounded-[36px] p-8 sm:p-10 text-white shadow-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D1FF]/20 text-[#00D1FF] text-xs font-bold uppercase tracking-wider border border-[#00D1FF]/30">
            <BarChart3 className="w-3.5 h-3.5" />
            Product Management &amp; Analytics Console
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white font-serif-magic">
            App Usage, Adoption &amp; ROI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time telemetry on guest engagement, AI adaptation acceptance, wait-time reductions, and guest sentiment.
          </p>
        </div>

        {/* View switcher pills */}
        <div className="bg-[#081835] p-1.5 rounded-2xl border border-white/15 flex items-center self-start md:self-auto shrink-0 shadow-inner">
          <button
            onClick={() => setActiveTab('METRICS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'METRICS'
                ? 'bg-[#00D1FF] text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Adoption &amp; Usage
          </button>
          <button
            onClick={() => setActiveTab('ROI')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ROI'
                ? 'bg-[#FFD700] text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Business ROI
          </button>
          <button
            onClick={() => setActiveTab('FEEDBACK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'FEEDBACK'
                ? 'bg-purple-400 text-[#0B2147] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Guest Sentiment
          </button>
        </div>
      </div>

      {activeTab === 'ROI' ? (
        <BusinessValuePage />
      ) : activeTab === 'FEEDBACK' ? (
        <div className="space-y-6">
          {/* NPS Summary Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Net Promoter Score</span>
              <div className="text-4xl font-bold text-[#0B2147] my-2 font-mono">+74 NPS</div>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18 vs Static Schedules
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Satisfaction</span>
              <div className="text-4xl font-bold text-[#0B2147] my-2 font-mono">4.9 / 5.0</div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Dining Protection Rating</span>
              <div className="text-4xl font-bold text-[#0B2147] my-2 font-mono">100%</div>
              <span className="text-xs text-slate-600">Zero missed reservations reported</span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Stress Reduction</span>
              <div className="text-4xl font-bold text-emerald-700 my-2 font-mono">-68%</div>
              <span className="text-xs text-slate-600">Guest-reported family friction</span>
            </div>
          </div>

          {/* Top Sentiment Tags & Recent Feedback Stream */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-lg font-bold text-[#0B2147]">Top Guest Sentiment Themes</h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-slate-100 text-slate-800 font-bold rounded-2xl text-xs flex items-center gap-2">
                Protected our Cinderella reservation <span className="bg-white px-2 py-0.5 rounded-full text-slate-600">92%</span>
              </span>
              <span className="px-4 py-2 bg-slate-100 text-slate-800 font-bold rounded-2xl text-xs flex items-center gap-2">
                Saved tons of line time <span className="bg-white px-2 py-0.5 rounded-full text-slate-600">89%</span>
              </span>
              <span className="px-4 py-2 bg-slate-100 text-slate-800 font-bold rounded-2xl text-xs flex items-center gap-2">
                Kids stayed energized <span className="bg-white px-2 py-0.5 rounded-full text-slate-600">86%</span>
              </span>
              <span className="px-4 py-2 bg-slate-100 text-slate-800 font-bold rounded-2xl text-xs flex items-center gap-2">
                Loved real-time swap explanations <span className="bg-white px-2 py-0.5 rounded-full text-slate-600">84%</span>
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#0B2147] pt-4">Recent Verified Guest Submissions</h3>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B2147]">Alex Morgan &amp; Family (Party of 4)</span>
                  <span className="text-xs text-slate-400">Today at 2:45 PM</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &quot;The automatic swap when Gemstone Mine closed was unbelievable. We never felt rushed and the kids stayed happy all day! Protected our royal lunch perfectly.&quot;
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0B2147]">David &amp; Elena Chen (Party of 2)</span>
                  <span className="text-xs text-slate-400">Yesterday at 5:10 PM</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &quot;Rain adaptation kicked in instantly and shifted us to Enchanted Tiki Room right before the downpour started. Unmatched situational intelligence.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total App Visits */}
            <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% DoD
                </span>
              </div>
              <div className="text-3xl font-bold text-[#0B2147] font-mono mt-2">
                {visitCount.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-600">Total Application Sessions</div>
              <p className="text-[11px] text-slate-400">Tracked via telemetry &amp; DOM debug tag</p>
            </div>

            {/* Recommendation Acceptance Rate */}
            <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Target: &gt;85%
                </span>
              </div>
              <div className="text-3xl font-bold text-[#0B2147] font-mono mt-2">
                {acceptanceRatePct}%
              </div>
              <div className="text-xs font-semibold text-slate-600">Adaptive Acceptance Rate</div>
              <p className="text-[11px] text-slate-400">140 approved out of 148 proposed</p>
            </div>

            {/* Time Saved Per Party */}
            <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 font-mono">+42.5m</span>
              </div>
              <div className="text-3xl font-bold text-[#0B2147] font-mono mt-2">
                42.5 min
              </div>
              <div className="text-xs font-semibold text-slate-600">Avg Wait Time Saved / Party</div>
              <p className="text-[11px] text-slate-400">Reinvested into dining &amp; merchandise</p>
            </div>

            {/* Dining Reservation Integrity */}
            <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                  Guaranteed
                </span>
              </div>
              <div className="text-3xl font-bold text-[#0B2147] font-mono mt-2">
                100%
              </div>
              <div className="text-xs font-semibold text-slate-600">Dining Preservation Rate</div>
              <p className="text-[11px] text-slate-400">Zero no-shows caused by ride delays</p>
            </div>
          </div>

          {/* Feature Engagement & Conversion Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Funnel */}
            <div className="lg:col-span-7 bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-5">
              <h3 className="text-base font-bold text-[#0B2147] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00D1FF]" />
                Guest Journey Conversion Funnel
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B2147] mb-1">
                    <span>1. Guest Profile &amp; Party Created</span>
                    <span>100% (1,240 parties)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-[#0B2147] h-3 rounded-full w-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B2147] mb-1">
                    <span>2. AI Itinerary Synthesized</span>
                    <span>93% (1,153 parties)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-[#00D1FF] h-3 rounded-full w-[93%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B2147] mb-1">
                    <span>3. In-Park Live Radar Active</span>
                    <span>88% (1,091 parties)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full w-[88%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B2147] mb-1">
                    <span>4. Proactive Disruption Encountered</span>
                    <span>24% (298 parties)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-amber-400 h-3 rounded-full w-[24%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B2147] mb-1">
                    <span>5. Alternative Swapped &amp; Accepted</span>
                    <span>94% of disrupted (280 parties)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full w-[94%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Click Heatmap breakdown */}
            <div className="lg:col-span-5 bg-white rounded-[32px] p-7 shadow-xl border border-slate-100 space-y-5">
              <h3 className="text-base font-bold text-[#0B2147] flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-amber-500" />
                Live Feature Click Heatmap
              </h3>

              <div className="space-y-3">
                {Object.entries(featureClicks).map(([key, count]) => (
                  <div
                    key={key}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono font-bold text-[#0B2147] bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                      {count} clicks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
