import React from 'react';
import { 
  X, 
  ShieldCheck
} from 'lucide-react';
import { AnalysisRecord } from '../../types';
import { ModalityBadge, StatusBadge, UrgencyBadge } from '../common/Badge';
import { AnalysisResultsDisplay } from './AnalysisResultsDisplay';

interface AnalysisDetailModalProps {
  record: AnalysisRecord | null;
  onClose: () => void;
}

export const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-3xl bg-slate-50 border border-slate-200 shadow-2xl space-y-0">
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 font-mono">
              {record.id}
            </span>
            <ModalityBadge modality={record.modality} />
            <UrgencyBadge urgency={record.urgency} />
            <StatusBadge status={record.status} />
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with AnalysisResultsDisplay */}
        <div className="p-4 sm:p-6">
          <AnalysisResultsDisplay
            record={record}
            showActions={false}
          />
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>PubMed Central Grounded &bull; Multi-Role Audit Sync</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

