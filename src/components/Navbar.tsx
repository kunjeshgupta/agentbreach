import React from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  RefreshCw, 
  Download, 
  Settings, 
  Wrench, 
  Terminal
} from 'lucide-react';

interface NavbarProps {
  isScanning: boolean;
  guardrailsActive: boolean;
  onRunScan: () => void;
  onToggleGuardrails: () => void;
  onOpenRemediation: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onOpenPlayground: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isScanning,
  guardrailsActive,
  onRunScan,
  onToggleGuardrails,
  onOpenRemediation,
  onOpenExport,
  onOpenSettings,
  onOpenPlayground,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Target Agent Context */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Shield className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">AgentBreach</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                v1.0 • Governance Suite
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Target: <span className="text-slate-700 font-semibold">PayVortex Financial Ops Assistant</span> (ReAct Tool Agent)
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Defenses Toggle Badge */}
          <button
            onClick={onToggleGuardrails}
            title={guardrailsActive ? "Active: Runtime prompt rules and validation schemas applied" : "Inactive: Vulnerable baseline agent configuration"}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
              guardrailsActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
            }`}
          >
            {guardrailsActive ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Defenses: Hardened (0% ASR)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                <span>Defenses: Unhardened Baseline</span>
              </>
            )}
          </button>

          {/* Playground Custom Probe Button */}
          <button
            onClick={onOpenPlayground}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition-colors"
            title="Test a custom probe against the agent sandbox"
          >
            <Terminal className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden sm:inline">Probe Playground</span>
          </button>

          {/* Remediation Modal Button */}
          <button
            onClick={onOpenRemediation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-300 transition-colors"
            title="View defensive guardrail patches"
          >
            <Wrench className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden sm:inline">Remediation Patches</span>
          </button>

          {/* Export Audit Report Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-sm transition-colors"
            title="Export Markdown & PDF Governance Report"
          >
            <Download className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden sm:inline">Audit Report</span>
          </button>

          {/* Run Security Scan CTA */}
          <button
            onClick={onRunScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-md shadow-sm transition-all"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Run Security Scan</span>
              </>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            title="Settings & Model Configuration"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
