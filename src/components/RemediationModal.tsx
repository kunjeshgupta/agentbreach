import React from 'react';
import { 
  X, 
  Wrench, 
  ShieldCheck, 
  Code2, 
  FileText, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { GuardrailPatch } from '../types/eval';

interface RemediationModalProps {
  isOpen: boolean;
  patches: GuardrailPatch[];
  guardrailsActive: boolean;
  isScanning: boolean;
  highlightTool?: string | null;
  onClose: () => void;
  onApplyAndRetest: () => void;
  onTogglePatch?: (patchId: string) => void;
}

export const RemediationModal: React.FC<RemediationModalProps> = ({
  isOpen,
  patches,
  guardrailsActive,
  isScanning,
  highlightTool,
  onClose,
  onApplyAndRetest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-md">
                <Wrench className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Automated Guardrail Remediation Suite
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Closed-Loop Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Turn security vulnerabilities into verified engineering fixes. Apply hardened system prompt boundaries and deterministic parameter validation schemas with 1-click verification.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body: List of Patches */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {patches.map((patch) => {
            const isTargetHighlight = highlightTool && patch.targetTool === highlightTool;

            return (
              <div
                key={patch.id}
                className={`rounded-xl border p-5 transition-all ${
                  isTargetHighlight
                    ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Patch Title & Tool */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {patch.id}
                      </span>
                      <span className="font-mono text-xs font-bold text-indigo-700">
                        Tool: {patch.targetTool}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {patch.estimatedASRReduction}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">
                      {patch.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {patch.description}
                </p>

                {/* Dual Defense Components: Prompt Directives + Code Validation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Hardened Prompt Directive */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <FileText className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Hardened System Prompt Directive</span>
                    </div>
                    <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-[11px] font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800 h-44">
                      {patch.hardenedSystemPromptRule}
                    </pre>
                  </div>

                  {/* Right: Deterministic Parameter Validation */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Code2 className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Runtime Parameter Boundary Schema</span>
                    </div>
                    <pre className="p-3 bg-slate-50 text-slate-800 rounded-lg text-[11px] font-mono whitespace-pre-wrap overflow-x-auto border border-slate-200 h-44">
                      {patch.parameterValidationCode}
                    </pre>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {guardrailsActive ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                Guardrails are currently ACTIVE and enforced in simulation.
              </span>
            ) : (
              <span>Baseline model active. Click below to apply patches and re-benchmark.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-300 transition-colors"
            >
              Close
            </button>

            <button
              onClick={onApplyAndRetest}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-md shadow-sm transition-all"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Re-Testing Benchmark...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>
                    {guardrailsActive ? 'Re-Run Evaluation with Guardrails' : 'Apply All Guardrails & Re-Test'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
