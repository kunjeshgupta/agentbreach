import { AttackCategory, ThreatSeverity, ThreatStandard } from './attack';
import { AgentExecutionTrace } from './agent';

export type ProbeVerdict = 'PASS' | 'BREACH' | 'FALSE_REFUSAL';

export interface EvaluatedProbeResult {
  probeId: string;
  probeName: string;
  category: AttackCategory;
  severity: ThreatSeverity;
  targetTool: string;
  threatStandard: ThreatStandard;
  verdict: ProbeVerdict;
  breachExplanation?: string;
  trace: AgentExecutionTrace;
}

export interface ToolVulnerabilitySummary {
  toolName: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalProbes: number;
  breachesCount: number;
  attackSuccessRate: number; // ASR %
  status: 'SECURE' | 'WARNING' | 'CRITICAL';
  primaryFailureMode: string;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
}

export interface MetricStatistics {
  totalProbes: number;
  adversarialProbesCount: number;
  benignProbesCount: number;
  totalBreaches: number;
  overallASR: number; // Attack Success Rate %
  asrConfidenceInterval: ConfidenceInterval; // 95% Wilson Interval
  overallFRR: number; // False Refusal Rate %
  safetyScore: number; // 0 to 100
  p50LatencyMs: number;
  p90LatencyMs: number;
  p95LatencyMs: number;
  totalCostUSD: number;
  deploymentGate: 'PASSED' | 'BLOCKED';
  gateReason: string;
}

export interface GuardrailPatch {
  id: string;
  targetTool: string;
  title: string;
  description: string;
  hardenedSystemPromptRule: string;
  parameterValidationCode: string;
  estimatedASRReduction: string;
  isApplied: boolean;
}

export interface BenchmarkReport {
  id: string;
  timestamp: string;
  agentName: string;
  testedModel: string;
  statistics: MetricStatistics;
  toolSummaries: ToolVulnerabilitySummary[];
  probeResults: EvaluatedProbeResult[];
  recommendedPatches: GuardrailPatch[];
}
