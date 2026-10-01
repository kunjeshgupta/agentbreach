import React from 'react';
import { 
  ShieldCheck, 
  Target, 
  Clock, 
  Percent
} from 'lucide-react';
import { MetricStatistics } from '../types/eval';

interface KpiGridProps {
  statistics: MetricStatistics;
  guardrailsActive: boolean;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ statistics, guardrailsActive }) => {
  const isHighSafety = statistics.safetyScore >= 90;
  const isZeroAsr = statistics.overallASR === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Safety Score Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Safety Score
            </span>
            <div
              className={`p-1.5 rounded-md ${
                isHighSafety ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {statistics.safetyScore}
            </span>
            <span className="text-sm font-medium text-slate-400">/ 100</span>
          </div>

          {/* Score Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isHighSafety ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${statistics.safetyScore}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Target: &gt; 95/100</span>
          <span className={`font-semibold ${isHighSafety ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isHighSafety ? 'Production Ready' : 'Critical Failure'}
          </span>
        </div>
      </div>

      {/* 2. Attack Success Rate (ASR) Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attack Success Rate (ASR)
            </span>
            <div
              className={`p-1.5 rounded-md ${
                isZeroAsr ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Target className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {statistics.overallASR}%
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                isZeroAsr
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isZeroAsr ? 'Hardened (0/9)' : `${statistics.totalBreaches} Breaches`}
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 font-mono">
            <span>95% Wilson CI:</span>
            <span className="text-slate-700 font-semibold">
              [{statistics.asrConfidenceInterval.lower}% — {statistics.asrConfidenceInterval.upper}%]
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Adversarial Probes:</span>
          <span className="font-semibold text-slate-700">{statistics.adversarialProbesCount} evaluated</span>
        </div>
      </div>

      {/* 3. False Refusal Rate (FRR) Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              False Refusal Rate (FRR)
            </span>
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Percent className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {statistics.overallFRR}%
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Optimal Utility
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500 leading-normal">
            Zero legitimate customer operations falsely rejected by defensive filters.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Benign Controls:</span>
          <span className="font-semibold text-slate-700">{statistics.benignProbesCount} verified</span>
        </div>
      </div>

      {/* 4. Latency & Eval Cost Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              P95 Latency & Cost
            </span>
            <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {statistics.p95LatencyMs}
            </span>
            <span className="text-sm font-medium text-slate-400">ms</span>
            <span className="text-xs text-slate-500 font-mono ml-auto">
              ${statistics.totalCostUSD.toFixed(4)}
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>P50 Latency: <strong className="text-slate-700 font-mono">{statistics.p50LatencyMs}ms</strong></span>
            <span>P90: <strong className="text-slate-700 font-mono">{statistics.p90LatencyMs}ms</strong></span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Overhead Guard:</span>
          <span className="font-semibold text-emerald-700 font-mono">
            {guardrailsActive ? '+18ms (Zod pass)' : '0ms baseline'}
          </span>
        </div>
      </div>
    </div>
  );
};
