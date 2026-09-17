import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus, 
  Eye, 
  RefreshCw, 
  ChevronRight,
  Box,
  Layers,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnalysisModality, AnalysisRecord, AnalysisStatus } from '../../types';
import { ModalityBadge, StatusBadge, UrgencyBadge } from '../common/Badge';
import { AnalysisDetailModal } from './AnalysisDetailModal';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeletonTable } from '../common/LoadingSkeleton';
import { Medical3DViewer } from '../viewer3d/Medical3DViewer';

interface AnalysisHistoryViewProps {
  onNavigateToNewAnalysis: () => void;
  selectedRecordId?: string | null;
  onClearSelectedRecord?: () => void;
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({
  onNavigateToNewAnalysis,
  selectedRecordId,
  onClearSelectedRecord,
}) => {
  const { userAnalyses, allAnalyses, user, deleteAnalysisRecord } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | '3d'>('table');
  const [inspectRecord, setInspectRecord] = useState<AnalysisRecord | null>(() => {
    if (selectedRecordId) {
      return (user?.role === 'admin' ? allAnalyses : userAnalyses).find((r) => r.id === selectedRecordId) || null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const activeRecords = user?.role === 'admin' ? allAnalyses : userAnalyses;

  const modalities: { id: string; label: string }[] = [
    { id: 'all', label: 'All Modalities' },
    { id: 'xray', label: 'Chest X-Ray' },
    { id: 'mri', label: 'Brain MRI' },
    { id: 'lab_report', label: 'Lab Reports' },
  ];

  const filteredRecords = activeRecords.filter((record) => {
    const matchesModality = selectedModality === 'all' || record.modality === selectedModality;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.tags && record.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesModality && matchesStatus && matchesSearch;
  });

  const triggerSimulatedRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Real-Time Diagnostic History Archive
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md">
              {filteredRecords.length} Records ({user?.email})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Realtime repository of diagnostic studies, AI inferences, and radiology reviews tied to your account.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerSimulatedRefresh}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNavigateToNewAnalysis}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by study title, patient name, MRN, record ID, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View Mode & Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="reviewed">Doctor Reviewed</option>
              <option value="flagged">Flagged</option>
              <option value="queued">Queued</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                  viewMode === '3d' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="3D Anatomy View"
              >
                <Box className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">3D Model</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modality Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {modalities.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModality(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedModality === m.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Visualizer Mode */}
      {viewMode === '3d' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Interactive 3D Anatomical Organ & Scan Correlation
              </h3>
              <p className="text-xs text-slate-500">
                Rotate, slice, and inspect 3D volumetric models corresponding to archive scans.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              WebGL 3D Core Active
            </span>
          </div>

          <Medical3DViewer selectedOrgan="Lungs" />
        </div>
      )}

      {/* Content Rendering: Loading / Empty / Data */}
      {isLoading ? (
        <LoadingSkeletonTable rows={5} />
      ) : filteredRecords.length === 0 && viewMode !== '3d' ? (
        <EmptyState
          title="No Diagnostic Studies Found"
          description="There are no records matching your search query. Upload a diagnostic scan to start real-time tracking for this account."
          actionText="Execute New Scan"
          onAction={onNavigateToNewAnalysis}
          secondaryActionText="Reset Filters"
          onSecondaryAction={() => {
            setSearchQuery('');
            setSelectedModality('all');
            setSelectedStatus('all');
          }}
        />
      ) : viewMode === 'table' ? (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Case / ID</th>
                  <th className="py-3 px-4">Modality</th>
                  <th className="py-3 px-4">Patient & MRN</th>
                  <th className="py-3 px-4">Status & Urgency</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => setInspectRecord(record)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {record.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{record.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <ModalityBadge modality={record.modality} />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{record.patientName}</div>
                      <div className="text-[11px] text-slate-500">{record.patientId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={record.status} />
                        <UrgencyBadge urgency={record.urgency} />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(record.submittedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectRecord(record);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAnalysisRecord(record.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => setInspectRecord(record)}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    {record.id}
                  </span>
                  <UrgencyBadge urgency={record.urgency} />
                </div>

                <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors">
                  {record.title}
                </h3>

                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  <ModalityBadge modality={record.modality} />
                  <StatusBadge status={record.status} />
                </div>

                {record.primaryFindingSummary && (
                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {record.primaryFindingSummary}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Patient: <strong className="text-slate-700 font-medium">{record.patientName}</strong></span>
                <span className="font-semibold text-blue-600 flex items-center gap-1">
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Analysis Detail Modal */}
      <AnalysisDetailModal
        record={inspectRecord}
        onClose={() => {
          setInspectRecord(null);
          if (onClearSelectedRecord) onClearSelectedRecord();
        }}
      />
    </div>
  );
};
