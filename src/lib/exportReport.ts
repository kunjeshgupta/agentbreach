import { BenchmarkReport } from '../types/eval';

/**
 * Generates an executive Markdown audit report mapped to OWASP LLM07 and NIST AI RMF
 */
export function generateMarkdownAuditReport(report: BenchmarkReport): string {
  const { statistics, toolSummaries, probeResults, recommendedPatches } = report;

  const toolTable = toolSummaries
    .map(
      (t) =>
        `| \`${t.toolName}\` | **${t.riskLevel}** | ${t.totalProbes} | ${t.breachesCount} | **${t.attackSuccessRate}%** | ${t.status === 'CRITICAL' ? '🚨 CRITICAL' : t.status === 'WARNING' ? '⚠️ WARNING' : '✅ SECURE'} | ${t.primaryFailureMode} |`
    )
    .join('\n');

  const breachList = probeResults
    .filter((r) => r.verdict === 'BREACH')
    .map(
      (r, idx) =>
        `### ${idx + 1}. [${r.severity}] ${r.probeName} (\`${r.probeId}\`)
* **Target Tool:** \`${r.targetTool}\`
* **Threat Standard:** ${r.threatStandard}
* **Breach Diagnosis:** ${r.breachExplanation}
* **Simulated Prompt:**
> "${r.trace.inputPrompt}"
* **Tool Invocation Detected:**
\`\`\`json
${JSON.stringify(r.trace.invokedToolCalls, null, 2)}
\`\`\`
`
    )
    .join('\n---\n\n');

  const patchList = recommendedPatches
    .map(
      (p) =>
        `### Patch: ${p.title} (\`${p.targetTool}\`)
${p.description}

**System Prompt Hardening Rule:**
\`\`\`text
${p.hardenedSystemPromptRule}
\`\`\`

**Deterministic Parameter Validation Schema:**
\`\`\`typescript
${p.parameterValidationCode}
\`\`\`
`
    )
    .join('\n\n');

  return `# AGENTBREACH SECURITY AUDIT & GOVERNANCE REPORT
**Target Agent:** ${report.agentName}  
**Evaluated Model:** ${report.testedModel}  
**Audit Timestamp:** ${new Date(report.timestamp).toUTCString()}  
**Compliance Framework:** OWASP Top 10 for LLMs (2025/2026) & NIST AI RMF 1.0  

---

## 1. Executive Deployment Gatekeeper
**Status:** **${statistics.deploymentGate === 'PASSED' ? '✅ PASSED — PRODUCTION READY' : '🚨 CRITICAL RISK — DEPLOYMENT BLOCKED'}**  
**Gatekeeper Reason:** ${statistics.gateReason}

### Key Evaluation Telemetry:
* **Overall Security Score:** **${statistics.safetyScore} / 100**
* **Attack Success Rate (ASR):** **${statistics.overallASR}%** (95% Wilson Confidence Interval: \`[${statistics.asrConfidenceInterval.lower}% — ${statistics.asrConfidenceInterval.upper}%]\`)
* **False Refusal Rate (FRR):** **${statistics.overallFRR}%** (Helpfulness / Utility Score)
* **P95 Execution Latency:** **${statistics.p95LatencyMs} ms** (P50: ${statistics.p50LatencyMs} ms)
* **Estimated Eval Cost:** **$${statistics.totalCostUSD} USD** (${statistics.totalProbes} probes executed)

---

## 2. OWASP LLM07 Agent Tool Vulnerability Matrix

| Tool Name | Risk Level | Probes | Breaches | ASR (%) | Status | Primary Vulnerability Mode |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${toolTable}

---

## 3. Forensic Breach Inspection & Exploit Traces

${breachList || '*No security breaches detected during this benchmark run.*'}

---

## 4. Remediation & Defensive Guardrail Directives

${patchList}

---
*Report generated autonomously by AgentBreach Governance Suite. Confidential & Proprietary.*
`;
}

/**
 * Triggers a browser print dialog with print-optimized styles for instant PDF export
 */
export function printAuditReportAsPDF(): void {
  window.print();
}

/**
 * Triggers direct file download of the Markdown audit report
 */
export function downloadMarkdownReport(report: BenchmarkReport): void {
  const content = generateMarkdownAuditReport(report);
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AgentBreach_Security_Audit_${report.agentName.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
