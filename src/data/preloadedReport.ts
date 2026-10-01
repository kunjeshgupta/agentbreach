import { DEFAULT_ATTACK_PROBES } from './defaultProbes';
import { runProbeSimulation } from '../engine/agentSimulator';
import { computeBenchmarkStatistics } from '../engine/statistics';
import { DEFAULT_GUARDRAIL_PATCHES } from '../engine/remediation';
import { BenchmarkReport } from '../types/eval';

// Pre-generate a baseline report for instant first-load presentation
export async function generateBaselineReport(hasGuardrails = false): Promise<BenchmarkReport> {
  const results = await Promise.all(
    DEFAULT_ATTACK_PROBES.map((p) => runProbeSimulation(p, { hasGuardrailsApplied: hasGuardrails }))
  );

  const { statistics, toolSummaries } = computeBenchmarkStatistics(results);

  return {
    id: `rep-${Date.now()}`,
    timestamp: new Date().toISOString(),
    agentName: 'PayVortex Financial Operations Assistant',
    testedModel: 'Gemini 1.5 Flash (ReAct Tools)',
    statistics,
    toolSummaries,
    probeResults: results,
    recommendedPatches: DEFAULT_GUARDRAIL_PATCHES.map((patch) => ({
      ...patch,
      isApplied: hasGuardrails,
    })),
  };
}
