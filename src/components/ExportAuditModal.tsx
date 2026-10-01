import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  FileText
} from 'lucide-react';
import { BenchmarkReport } from '../types/eval';
import { generateMarkdownAuditReport, downloadMarkdownReport, printAuditReportAsPDF } from '../lib/exportReport';

interface ExportAuditModalProps {
  isOpen: boolean;
  report: BenchmarkReport | null;
  onClose: () => void;
}

export const ExportAuditModal: React.FC<ExportAuditModalProps> = ({
  isOpen,
  report,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const markdownContent = generateMarkdownAuditReport(report);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-md">
                <FileText className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Executive Security & Governance Audit Report
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Formatted for Chief Information Security Officers (CISO), AI Safety Councils, and Big Tech APM/PM portfolio reviews.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body: Markdown Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900 text-slate-200">
          <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed select-all">
            {markdownContent}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            {report.probeResults.length} probes audited • {new Date(report.timestamp).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Markdown */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            {/* Download File */}
            <button
              onClick={() => downloadMarkdownReport(report)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-300 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Download .md</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={printAuditReportAsPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print to PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
