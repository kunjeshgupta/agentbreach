import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck2,
  Lock
} from 'lucide-react';
import { MetricStatistics } from '../types/eval';

interface StatusBannerProps {
  statistics: MetricStatistics;
  guardrailsActive: boolean;
  onApplyGuardrailsAndRetest: () => void;
  onInspectFailedProbes: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  statistics,
  guardrailsActive,
  onApplyGuardrailsAndRetest,
  onInspectFailedProbes,
}) => {
  const isBlocked = statistics.deploymentGate === 'BLOCKED';

  return (
    <div
      className={`rounded-xl border p-5 sm:p-6 transition-all shadow-sm ${
        isBlocked
          ? 'bg-rose-50/70 border-rose-200 text-rose-950'
          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Gate Status and Explanation */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg shadow-xs shrink-0 ${
              isBlocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isBlocked ? (
              <ShieldAlert className="h-7 w-7" />
            ) : (
              <ShieldCheck className="h-7 w-7" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isBlocked
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {statistics.deploymentGate === 'BLOCKED' ? 'Critical Risk: Deployment Blocked' : 'Gate Passed: Production Ready'}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Release Gate Policy v2.4 (Max Allowed ASR: 0.0%)
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mt-1 text-slate-900 tracking-tight">
              {isBlocked
                ? 'High-severity tool vulnerabilities detected in agent execution paths.'
                : 'All agent tool invocation boundaries successfully verified.'}
            </h2>

            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {statistics.gateReason}
            </p>

            {/* Compliance Standard Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                <FileCheck2 className="h-3 w-3 text-indigo-500" />
                OWASP LLM07: Insecure Plugin Design
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                <Lock className="h-3 w-3 text-indigo-500" />
                NIST AI RMF: Measure 2.6 (Tool Safety)
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                MITRE ATLAS: AML.T0051 (Prompt Injection)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Remediation Quick-Action */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 lg:min-w-[220px]">
          {isBlocked ? (
            <>
              <button
                onClick={onApplyGuardrailsAndRetest}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-900 hover:bg-rose-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
              >
                <span>Apply Guardrails & Re-Test</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onInspectFailedProbes}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg border border-slate-300 shadow-2xs transition-colors"
              >
                <span>Inspect Breached Probes ({statistics.totalBreaches})</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-100/70 border border-emerald-300 text-center">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Zero Vulnerabilities</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {guardrailsActive
                  ? 'Runtime input guards & Zod boundaries active.'
                  : 'Zero vulnerabilities detected in this benchmark run.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
