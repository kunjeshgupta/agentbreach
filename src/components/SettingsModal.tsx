import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Cpu, 
  Database, 
  RotateCcw, 
  Check
} from 'lucide-react';
import { resetMockBankStore, getMockBankAccounts, AccountRecord } from '../sandbox/mockBankStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  onResetData,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [resetFeedback, setResetFeedback] = useState(false);

  if (!isOpen) return null;

  const accounts = getMockBankAccounts();

  const handleReset = () => {
    resetMockBankStore();
    onResetData();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full my-8 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-200 text-slate-700 rounded-md">
              <Settings className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Evaluation & Agent Settings
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Target Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-indigo-600" />
              <span>Target Agent Model Architecture</span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Gemini 1.5 Flash (ReAct Tools)">Gemini 1.5 Flash (ReAct Tools) — Default Recommended</option>
              <option value="GPT-4o-mini (Function Calling)">GPT-4o-mini (Function Calling)</option>
              <option value="Claude 3.5 Sonnet (Tool Use)">Claude 3.5 Sonnet (Tool Use)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Evaluates parameter boundary validation and prompt injection susceptibility for this agent architecture.
            </p>
          </div>

          {/* Execution Environment */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-indigo-600" />
              <span>Execution Environment</span>
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Deterministic Security Oracle Sandbox</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Active (Offline)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Runs against the in-memory financial ledger (<code className="text-slate-700">PayVortex Inc.</code>) with zero external network calls, zero API token costs, and 100% reproducible red-team benchmark traces.
              </p>
            </div>
          </div>

          {/* Sandbox Ledger Status & Reset */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Mock Ledger Accounts State
              </label>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Ledger</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {accounts.map((acc: AccountRecord) => (
                <div key={acc.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>{acc.id}</span>
                    <span className="uppercase font-bold">{acc.role}</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1">
                    ${acc.balance.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {resetFeedback && (
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                <span>Ledger reset to pristine initial state ($2,450.00 / $8,120.00).</span>
              </p>
            )}
          </div>

          {/* Optional Gemini Live API Key */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-indigo-600" />
              <span>Optional Live Gemini API Key (Bypass Sandbox Mode)</span>
            </label>
            <input
              type="password"
              placeholder="AIzaSy... (optional, leave blank for deterministic sandbox)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400">
              Never transmitted externally. Stored only in local browser memory.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
