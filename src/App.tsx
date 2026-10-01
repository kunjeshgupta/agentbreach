import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatusBanner } from './components/StatusBanner';
import { KpiGrid } from './components/KpiGrid';
import { HeatmapTable } from './components/HeatmapTable';
import { ProbeResultsList } from './components/ProbeResultsList';
import { TraceInspectorModal } from './components/TraceInspectorModal';
import { RemediationModal } from './components/RemediationModal';
import { ExportAuditModal } from './components/ExportAuditModal';
import { SettingsModal } from './components/SettingsModal';
import { InteractivePlaygroundModal } from './components/InteractivePlaygroundModal';
import { BenchmarkReport, EvaluatedProbeResult } from './types/eval';
import { generateBaselineReport } from './data/preloadedReport';
import { DEFAULT_ATTACK_PROBES } from './data/defaultProbes';
import { runProbeSimulation } from './engine/agentSimulator';
import { computeBenchmarkStatistics } from './engine/statistics';
import { DEFAULT_GUARDRAIL_PATCHES } from './engine/remediation';

export const App: React.FC = () => {
  const [report, setReport] = useState<BenchmarkReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [guardrailsActive, setGuardrailsActive] = useState(false);
  const [selectedToolFilter, setSelectedToolFilter] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('Gemini 1.5 Flash (ReAct Tools)');

  // Modals state
  const [forensicProbe, setForensicProbe] = useState<EvaluatedProbeResult | null>(null);
  const [isRemediationOpen, setIsRemediationOpen] = useState(false);
  const [highlightToolInRemediation, setHighlightToolInRemediation] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  // Initialize with baseline report on mount
  useEffect(() => {
    generateBaselineReport(false).then((initial) => {
      setReport(initial);
    });
  }, []);

  // Run full benchmark evaluation
  const executeBenchmarkRun = async (guarded: boolean) => {
    setIsScanning(true);

    // Realistic scanning animation delay
    await new Promise((r) => setTimeout(r, 600));

    const results = await Promise.all(
      DEFAULT_ATTACK_PROBES.map((probe) =>
        runProbeSimulation(probe, {
          hasGuardrailsApplied: guarded,
          modelName: selectedModel,
        })
      )
    );

    const { statistics, toolSummaries } = computeBenchmarkStatistics(results);

    setReport({
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: 'PayVortex Financial Operations Assistant',
      testedModel: selectedModel,
      statistics,
      toolSummaries,
      probeResults: results,
      recommendedPatches: DEFAULT_GUARDRAIL_PATCHES.map((patch) => ({
        ...patch,
        isApplied: guarded,
      })),
    });

    setIsScanning(false);
  };

  const handleRunScan = () => {
    executeBenchmarkRun(guardrailsActive);
  };

  const handleToggleGuardrails = () => {
    const nextState = !guardrailsActive;
    setGuardrailsActive(nextState);
    executeBenchmarkRun(nextState);
  };

  const handleApplyGuardrailsAndRetest = () => {
    setGuardrailsActive(true);
    setIsRemediationOpen(false);
    executeBenchmarkRun(true);
  };

  const handleOpenRemediationForTool = (toolName?: string) => {
    setHighlightToolInRemediation(toolName || null);
    setIsRemediationOpen(true);
  };

  const handleAddCustomProbeResult = (customProbeResult: EvaluatedProbeResult) => {
    if (!report) return;
    const updatedResults = [customProbeResult, ...report.probeResults];
    const { statistics, toolSummaries } = computeBenchmarkStatistics(updatedResults);

    setReport({
      ...report,
      statistics,
      toolSummaries,
      probeResults: updatedResults,
    });
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
          <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span>Initializing AgentBreach Evaluation Framework...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        isScanning={isScanning}
        guardrailsActive={guardrailsActive}
        onRunScan={handleRunScan}
        onToggleGuardrails={handleToggleGuardrails}
        onOpenRemediation={() => handleOpenRemediationForTool()}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPlayground={() => setIsPlaygroundOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status / Gatekeeper Banner */}
        <StatusBanner
          statistics={report.statistics}
          guardrailsActive={guardrailsActive}
          onApplyGuardrailsAndRetest={handleApplyGuardrailsAndRetest}
          onInspectFailedProbes={() => {
            const firstBreach = report.probeResults.find((p) => p.verdict === 'BREACH');
            if (firstBreach) setForensicProbe(firstBreach);
          }}
        />

        {/* 4 Key Executive KPIs */}
        <KpiGrid
          statistics={report.statistics}
          guardrailsActive={guardrailsActive}
        />

        {/* Tool Vulnerability Matrix */}
        <HeatmapTable
          toolSummaries={report.toolSummaries}
          selectedToolFilter={selectedToolFilter}
          onSelectToolFilter={setSelectedToolFilter}
          onOpenRemediation={handleOpenRemediationForTool}
        />

        {/* Probes Results Test Suite */}
        <ProbeResultsList
          probes={report.probeResults}
          selectedToolFilter={selectedToolFilter}
          onSelectProbeForForensics={setForensicProbe}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>AgentBreach</strong> — Autonomous Agent Tool-Call Security & Governance Suite
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>OWASP LLM07 Compatible</span>
            <span>•</span>
            <span>NIST AI RMF 1.0</span>
            <span>•</span>
            <span>MITRE ATLAS</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TraceInspectorModal
        probe={forensicProbe}
        onClose={() => setForensicProbe(null)}
        onOpenRemediation={(tool) => handleOpenRemediationForTool(tool)}
      />

      <RemediationModal
        isOpen={isRemediationOpen}
        patches={report.recommendedPatches}
        guardrailsActive={guardrailsActive}
        isScanning={isScanning}
        highlightTool={highlightToolInRemediation}
        onClose={() => setIsRemediationOpen(false)}
        onApplyAndRetest={handleApplyGuardrailsAndRetest}
      />

      <ExportAuditModal
        isOpen={isExportOpen}
        report={report}
        onClose={() => setIsExportOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={() => executeBenchmarkRun(guardrailsActive)}
      />

      <InteractivePlaygroundModal
        isOpen={isPlaygroundOpen}
        guardrailsActive={guardrailsActive}
        onClose={() => setIsPlaygroundOpen(false)}
        onAddCustomProbeResult={handleAddCustomProbeResult}
      />
    </div>
  );
};

export default App;
