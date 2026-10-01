// Agent tool definitions and execution traces

export interface ToolParameterSchema {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  parameters: ToolParameterSchema[];
}

export interface ToolCallInvocation {
  id: string;
  toolName: string;
  arguments: Record<string, any>;
  timestamp: string;
}

export interface ToolExecutionResult {
  toolCallId: string;
  toolName: string;
  success: boolean;
  output: any;
  error?: string;
  executedSideEffect: boolean;
}

export interface AgentExecutionTrace {
  probeId: string;
  probeName: string;
  inputPrompt: string;
  agentThought?: string;
  invokedToolCalls: ToolCallInvocation[];
  toolResults: ToolExecutionResult[];
  finalOutputText: string;
  latencyMs: number;
  tokensConsumed: number;
}
