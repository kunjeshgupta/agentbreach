import React, { useState } from 'react';
import { 
  Search, 
  Code, 
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { EvaluatedProbeResult } from '../types/eval';

interface ProbeResultsListProps {
  probes: EvaluatedProbeResult[];
  selectedToolFilter: string | null;
  onSelectProbeForForensics: (probe: EvaluatedProbeResult) => void;
}

type FilterVerdict = 'ALL' | 'BREACH' | 'PASS' | 'BENIGN';

export const ProbeResultsList: React.FC<ProbeResultsListProps> = ({
  probes,
  selectedToolFilter,
  onSelectProbeForForensics,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<FilterVerdict>('ALL');

  // Filter probes
  const filteredProbes = probes.filter((p) => {
    // Tool filter
    if (selectedToolFilter && p.targetTool !== selectedToolFilter) {
      return false;
    }

    // Verdict filter
    if (verdictFilter === 'BREACH' && p.verdict !== 'BREACH') return false;
    if (verdictFilter === 'PASS' && p.verdict !== 'PASS') return false;
    if (verdictFilter === 'BENIGN' && p.category !== 'BENIGN_CONTROL') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.probeName.toLowerCase().includes(q);
      const matchId = p.probeId.toLowerCase().includes(q);
      const matchTool = p.targetTool.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchPrompt = p.trace.inputPrompt.toLowerCase().includes(q);
      return matchName || matchId || matchTool || matchCategory || matchPrompt;
    }

    return true;
  });

  const breachCount = probes.filter((p) => p.verdict === 'BREACH').length;
  const passCount = probes.filter((p) => p.verdict === 'PASS').length;
  const benignCount = probes.filter((p) => p.category === 'BENIGN_CONTROL').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">
              Autonomous Red-Team Probe Evaluation Log
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
              {filteredProbes.length} / {probes.length} Probes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual probe traces, ReAct reasoning chains, and deterministic security oracle verdicts.
          </p>
        </div>

        {/* Search & Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search probes, prompts, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-60 bg-white"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center rounded-md border border-slate-300 bg-white p-0.5 text-xs font-medium">
            <button
              onClick={() => setVerdictFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                verdictFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({probes.length})
            </button>
            <button
              onClick={() => setVerdictFilter('BREACH')}
              className={`px-2.5 py-1 rounded transition-colors ${
                verdictFilter === 'BREACH'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Breaches ({breachCount})
            </button>
            <button
              onClick={() => setVerdictFilter('PASS')}
              className={`px-2.5 py-1 rounded transition-colors ${
                verdictFilter === 'PASS'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Passed ({passCount})
            </button>
            <button
              onClick={() => setVerdictFilter('BENIGN')}
              className={`px-2.5 py-1 rounded transition-colors ${
                verdictFilter === 'BENIGN'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Controls ({benignCount})
            </button>
          </div>
        </div>
      </div>

      {/* Probes List */}
      <div className="divide-y divide-slate-100">
        {filteredProbes.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No probes match the current filter or search criteria.
          </div>
        ) : (
          filteredProbes.map((probe) => {
            const isBreach = probe.verdict === 'BREACH';
            const isPass = probe.verdict === 'PASS';

            return (
              <div
                key={probe.probeId}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Metadata & Probe Details */}
                <div className="space-y-1.5 max-w-3xl">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {probe.probeId}
                    </span>

                    {/* Verdict Pill */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                        isBreach
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isPass
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {isBreach ? (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-rose-600" />
                          BREACH DETECTED
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          PASSED SECURE
                        </>
                      )}
                    </span>

                    {/* Severity Pill */}
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        probe.severity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700'
                          : probe.severity === 'HIGH'
                          ? 'bg-orange-50 text-orange-700'
                          : probe.severity === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {probe.severity}
                    </span>

                    {/* Category */}
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {probe.category.replace(/_/g, ' ')}
                    </span>

                    {/* Target Tool */}
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      <Code className="h-3 w-3" />
                      {probe.targetTool}
                    </span>

                    {/* Standard */}
                    <span className="text-[10px] text-slate-600 font-mono">
                      {probe.threatStandard}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {probe.probeName}
                  </h4>

                  {/* Breach Explanation or Success */}
                  {isBreach && probe.breachExplanation && (
                    <p className="text-xs text-rose-700 font-medium bg-rose-50/80 p-2 rounded border border-rose-200/60 leading-relaxed">
                      <strong>Exploit Result:</strong> {probe.breachExplanation}
                    </p>
                  )}

                  {/* Input Prompt Snippet */}
                  <p className="text-xs text-slate-500 italic line-clamp-1">
                    &ldquo;{probe.trace.inputPrompt}&rdquo;
                  </p>
                </div>

                {/* Right: Forensic Inspector Action */}
                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => onSelectProbeForForensics(probe)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all hover:border-slate-400"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    <span>Inspect Forensics</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
