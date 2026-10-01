import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  FileText, 
  Code2, 
  Cpu
} from 'lucide-react';
import { EvaluatedProbeResult } from '../types/eval';

interface TraceInspectorModalProps {
  probe: EvaluatedProbeResult | null;
  onClose: () => void;
  onOpenRemediation: (toolName: string) => void;
}

export const TraceInspectorModal: React.FC<TraceInspectorModalProps> = ({
  probe,
  onClose,
  onOpenRemediation,
}) => {
  if (!probe) return null;

  const isBreach = probe.verdict === 'BREACH';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                {probe.probeId}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isBreach
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {isBreach ? 'BREACH CONFIRMED' : 'PASSED SECURE'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Standard: <strong className="text-slate-700">{probe.threatStandard}</strong>
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1.5">
              {probe.probeName}
            </h3>
            <p className="text-xs text-slate-500">
              Target Tool: <code className="text-indigo-600 font-semibold">{probe.targetTool}</code> • Category: {probe.category.replace(/_/g, ' ')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Breach Explanation Alert */}
          {isBreach && probe.breachExplanation && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold mb-1 text-rose-800">
                <ShieldAlert className="h-4 w-4" />
                <span>Security Oracle Breach Diagnosis</span>
              </div>
              <p className="leading-relaxed">{probe.breachExplanation}</p>
            </div>
          )}

          {/* 1. Input Prompt */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <FileText className="h-3.5 w-3.5" />
              <span>Evaluated User / Injected Prompt Payload</span>
            </div>
            <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed whitespace-pre-wrap">
              {probe.trace.inputPrompt}
            </div>
          </div>

          {/* 2. ReAct Agent Reasoning / Thought Chain */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <Cpu className="h-3.5 w-3.5" />
              <span>Agent Internal Reasoning & Chain-of-Thought</span>
            </div>
            <div className="p-3.5 bg-amber-50/50 border border-amber-200/70 rounded-lg text-xs text-amber-950 font-mono leading-relaxed">
              {probe.trace.agentThought || 'No explicit thought recorded.'}
            </div>
          </div>

          {/* 3. Invoked Tool Calls & Parameters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Code2 className="h-3.5 w-3.5" />
                <span>Tool Invocations & Arguments Triggered</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {probe.trace.invokedToolCalls.length} tool call(s)
              </span>
            </div>

            {probe.trace.invokedToolCalls.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 italic">
                Agent refused or did not invoke any tools.
              </div>
            ) : (
              <div className="space-y-3">
                {probe.trace.invokedToolCalls.map((call) => (
                  <div key={call.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-indigo-700">{call.toolName}()</span>
                      <span className="text-slate-400">{call.id}</span>
                    </div>
                    <pre className="text-[11px] bg-white p-2.5 rounded border border-slate-200 text-slate-800 overflow-x-auto font-mono">
                      {JSON.stringify(call.arguments, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Agent Final User-Facing Output */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <Terminal className="h-3.5 w-3.5" />
              <span>Final Agent Response to User</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
              {probe.trace.finalOutputText}
            </div>
          </div>

          {/* 5. Execution Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
              <span className="font-mono font-bold text-slate-800">{probe.trace.latencyMs} ms</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Side Effects</span>
              <span className="font-mono font-bold text-slate-800">
                {probe.trace.toolResults.filter((r) => r.executedSideEffect).length} state writes
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Severity</span>
              <span className="font-mono font-bold text-slate-800">{probe.severity}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Standard</span>
              <span className="font-mono font-bold text-slate-800">{probe.threatStandard.split(':')[0]}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {isBreach ? (
            <button
              onClick={() => {
                onClose();
                onOpenRemediation(probe.targetTool);
              }}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline"
            >
              View Recommended Guardrail Patch for &apos;{probe.targetTool}&apos; &rarr;
            </button>
          ) : (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Execution complies with security policy
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
