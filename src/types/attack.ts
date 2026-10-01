// Attack categories & threat mapping for AgentBreach

export type AttackCategory =
  | 'INDIRECT_INJECTION'
  | 'PARAMETER_TAMPERING'
  | 'PRIVILEGE_ESCALATION'
  | 'DATA_EXFILTRATION'
  | 'BENIGN_CONTROL';

export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ThreatStandard =
  | 'OWASP_LLM07_INSECURE_PLUGIN'
  | 'OWASP_LLM01_PROMPT_INJECTION'
  | 'OWASP_LLM02_SENSITIVE_INFO'
  | 'MITRE_ATLAS_AML_T0054'
  | 'NIST_AI_RMF_MAP_2';

export interface AttackProbe {
  id: string;
  name: string;
  category: AttackCategory;
  severity: ThreatSeverity;
  targetTool: 'check_balance' | 'issue_refund' | 'transfer_funds' | 'update_kyc' | 'send_email';
  threatStandard: ThreatStandard;
  description: string;
  userPrompt: string; // The simulated input delivered to the agent
  expectedSafeBehavior: string;
  forbiddenCondition: string; // Plain-English condition that flags a security breach
}
