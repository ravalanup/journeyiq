import React, { useState } from 'react';
import { FileCode2, CheckCircle2, Copy, Check, Database, Server, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export const ProductionGuidePage: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sqlSchemaSnippet = `-- JourneyIQ PostgreSQL / Supabase Production Schema
CREATE TABLE guests (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  home_region TEXT,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lead_guest_id TEXT REFERENCES guests(id),
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE itineraries (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  guest_id TEXT REFERENCES guests(id),
  version INT NOT NULL DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  summary_rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own itineraries"
  ON itineraries FOR SELECT
  USING (auth.uid() = guest_id);`;

  const vercelJsonSnippet = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key",
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#0B2147] rounded-[36px] p-8 sm:p-12 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#00D1FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D1FF]/20 text-[#00D1FF] text-xs font-bold uppercase tracking-wider border border-[#00D1FF]/30">
            <FileCode2 className="w-3.5 h-3.5" />
            Production Migration Blueprint
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white font-serif-magic">
            From Demo to Production on Vercel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Step-by-step technical guide for transitioning JourneyIQ from this standalone prototype into a high-scale serverless production deployment.
          </p>
        </div>
      </div>

      {/* 6-Stage Migration Roadmap */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 space-y-6">
        <h3 className="text-lg font-bold text-[#0B2147] border-b border-slate-100 pb-3">
          6-Stage Production Migration Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Stage 01</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Schema Ready
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B2147]">PostgreSQL / Supabase Database</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Execute SQL migration schema, enable Row Level Security (RLS), and switch active repository from `MockRepository` to `SupabaseAdapter`.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00D1FF] uppercase tracking-wider">Stage 02</span>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded">
                API Standard
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B2147]">Live Operational Telemetry Ingress</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect external Theme Park Queue APIs and IoT turnstile beacons via webhook endpoints to feed the RealTimeAdaptationAgent.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Stage 03</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                Edge Ready
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B2147]">Vercel Edge Functions Deployment</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configure Vercel build output and environment secrets for `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Stage 04</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                Real-Time
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B2147]">WebSockets / Server-Sent Events (SSE)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Replace client polling with real-time push alerts so guests receive instant push notifications when wait times surge or rides close.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Stage 05</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Governance
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B2147]">Multi-Agent Governance &amp; Fallbacks</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic rules engine acts as the unbreakable fallback if latency spikes or model rate limits occur, guaranteeing 100% uptime.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Stage 06</span>
              <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                Telemetry
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#0B2147]">OpenTelemetry &amp; Audit Logging</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Forward structured decision records to Datadog / Google Cloud Trace without exposing private thought chains or guest PII.
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SQL Schema */}
        <div className="bg-[#081835] rounded-[32px] p-6 text-white border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00D1FF] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              1. PostgreSQL / Supabase Schema
            </span>
            <button
              onClick={() => copyToClipboard(sqlSchemaSnippet, 'sql')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1 text-slate-300"
            >
              {copiedId === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'sql' ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="text-[11px] font-mono bg-black/40 p-4 rounded-2xl overflow-x-auto text-cyan-300 border border-white/5 leading-relaxed max-h-64">
            {sqlSchemaSnippet}
          </pre>
        </div>

        {/* Vercel Configuration */}
        <div className="bg-[#081835] rounded-[32px] p-6 text-white border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              2. Vercel Configuration (vercel.json)
            </span>
            <button
              onClick={() => copyToClipboard(vercelJsonSnippet, 'vercel')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1 text-slate-300"
            >
              {copiedId === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'vercel' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="text-[11px] font-mono bg-black/40 p-4 rounded-2xl overflow-x-auto text-amber-300 border border-white/5 leading-relaxed max-h-64">
            {vercelJsonSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
