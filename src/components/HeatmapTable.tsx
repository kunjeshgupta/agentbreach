import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle, 
  Wrench,
  Code2
} from 'lucide-react';
import { ToolVulnerabilitySummary } from '../types/eval';

interface HeatmapTableProps {
  toolSummaries: ToolVulnerabilitySummary[];
  selectedToolFilter: string | null;
  onSelectToolFilter: (toolName: string | null) => void;
  onOpenRemediation: (toolName?: string) => void;
}

export const HeatmapTable: React.FC<HeatmapTableProps> = ({
  toolSummaries,
  selectedToolFilter,
  onSelectToolFilter,
  onOpenRemediation,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">
              OWASP LLM07 Tool Vulnerability Matrix
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
              5 Exposed Tools
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic security evaluation of agent function calls, parameter validation bounds, and side-effects.
          </p>
        </div>

        {selectedToolFilter && (
          <button
            onClick={() => onSelectToolFilter(null)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline self-start sm:self-auto"
          >
            Clear tool filter ({selectedToolFilter})
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Tool Identifier</th>
              <th className="py-3 px-4">Risk Tier</th>
              <th className="py-3 px-4 text-center">Probes Tested</th>
              <th className="py-3 px-4 text-center">Breaches</th>
              <th className="py-3 px-4">Attack Success Rate (ASR)</th>
              <th className="py-3 px-4">Governance Status</th>
              <th className="py-3 px-4">Primary Vulnerability Mode</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {toolSummaries.map((tool) => {
              const isSelected = selectedToolFilter === tool.toolName;
              const isCritical = tool.status === 'CRITICAL';
              const isWarning = tool.status === 'WARNING';
              const isSecure = tool.status === 'SECURE';

              return (
                <tr
                  key={tool.toolName}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  {/* Tool Identifier */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-slate-400" />
                      <span>{tool.toolName}</span>
                    </div>
                  </td>

                  {/* Risk Tier */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        tool.riskLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : tool.riskLevel === 'HIGH'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : tool.riskLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {tool.riskLevel}
                    </span>
                  </td>

                  {/* Probes Tested */}
                  <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                    {tool.totalProbes}
                  </td>

                  {/* Breaches Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-mono font-bold ${
                        tool.breachesCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {tool.breachesCount}
                    </span>
                  </td>

                  {/* ASR Visual Bar */}
                  <td className="py-3.5 px-4 min-w-[160px]">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            tool.attackSuccessRate > 50
                              ? 'bg-rose-600'
                              : tool.attackSuccessRate > 0
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(tool.attackSuccessRate, 4)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-800 w-12 text-right">
                        {tool.attackSuccessRate}%
                      </span>
                    </div>
                  </td>

                  {/* Governance Status */}
                  <td className="py-3.5 px-4">
                    {isCritical && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertOctagon className="h-3.5 w-3.5" />
                        CRITICAL
                      </span>
                    )}
                    {isWarning && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        WARNING
                      </span>
                    )}
                    {isSecure && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle className="h-3.5 w-3.5" />
                        SECURE
                      </span>
                    )}
                  </td>

                  {/* Primary Failure Mode */}
                  <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate" title={tool.primaryFailureMode}>
                    {tool.primaryFailureMode}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectToolFilter(isSelected ? null : tool.toolName)}
                        className={`text-xs px-2.5 py-1 rounded transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Filter probe test results to this tool"
                      >
                        {isSelected ? 'Filtered' : 'Filter'}
                      </button>
                      {tool.breachesCount > 0 && (
                        <button
                          onClick={() => onOpenRemediation(tool.toolName)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold p-1"
                          title="View remediation patch for this tool"
                        >
                          <Wrench className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
