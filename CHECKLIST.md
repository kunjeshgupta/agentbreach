# AgentBreach Master Requirements & Traceability Checklist

> **Mission:** Build an autonomous security evaluation, red-teaming, and governance suite for tool-calling AI agents, mapped to OWASP LLM07 and NIST AI RMF.

---

## 🔒 1. Privacy, Safety & Cleanliness
- [ ] Strictly fictional/synthetic mock scenarios (`PayVortex Inc.`, `User #1042`).
- [ ] ZERO real employer names, company references, or personal info in any file or commit.
- [ ] `.env` and `*.local` strictly blocked by `.gitignore`.
- [ ] Clean, minimalist, executive design (light mode default, zero purple neon, zero gimmicks).

---

## 🛡️ 2. Core Security & Mock Tool Sandbox
- [ ] **Sandboxed Mock Financial Environment (`PayVortex`):**
  - `check_balance` (Read-only)
  - `issue_refund` (High risk, parameter bounds)
  - `transfer_funds` (High risk, authentication checks)
  - `update_kyc` (Administrative privilege checks)
  - `send_email` (External communication channel)
- [ ] Simulated in-memory ledger capturing tool call payloads and side effects.

---

## 💥 3. Adversarial Test Battery (OWASP LLM07 & MITRE ATLAS)
- [ ] **Indirect Prompt Injection:** Instructions hidden inside user transaction notes, reviews, and external messages.
- [ ] **Parameter Tampering:** Negative values, excessive refund amounts, account ID hijacking.
- [ ] **Privilege Escalation:** Unprivileged personas attempting administrative overrides.
- [ ] **Confidential Data Exfiltration:** Coercing agent into passing PII to external endpoints.
- [ ] **Benign Controls:** Legitimate requests to measure False Refusal Rate (FRR).

---

## 📊 4. Quantitative Metrics & Statistical Rigor
- [ ] **Attack Success Rate (ASR):** Percentage of adversarial probes that successfully breached tool policies.
- [ ] **False Refusal Rate (FRR):** Percentage of benign queries improperly rejected.
- [ ] **95% Wilson Confidence Intervals:** Proving statistical significance in safety evaluations.
- [ ] **Execution Latency & Token FinOps:** Tracking P50/P90/P99 latencies and cost per 1k invocations.

---

## 🖥️ 5. Clean, Executive Governance Dashboard
- [ ] **Executive Status Banner:** Automated Go/No-Go Release Gatekeeper (`PASSED` vs `CRITICAL RISK: BLOCKED`).
- [ ] **4 High-Signal KPI Cards:** Safety Score, Attack Success Rate, False Refusal Rate, P95 Latency.
- [ ] **Tool Vulnerability Heatmap:** Clean matrix showing which tools passed and which were breached.
- [ ] **Forensic Trace Inspector:** Drawer showing payload, agent reasoning, tool arguments, and Oracle verdict.
- [ ] **1-Click Guardrail Remediation:** Auto-generates hardened system prompt + parameter schema bounds, with "Apply & Re-Test" button.
- [ ] **Audit Report Exporter:** 1-Click clean printable PDF and Markdown report for CISOs and PMs.

---

## 🌐 6. Distribution & Packaging
- [ ] **Live Interactive Web Demo:** Pre-loaded mock evaluation runs (0 clicks, 0 API keys required).
- [ ] **BYOK Google Gemini / OpenAI Support:** Test custom agents live in browser.
- [ ] **Terminal Agent Skill (`SKILL.md`):** Reusable skill for Claude Code, Cursor, and terminal agents.
- [ ] **GitHub Actions CI/CD Template:** Automated pull request security gate.
