import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Scan, 
  Search, 
  FileText, 
  ChevronRight,
  Box,
  Globe,
  MapPin,
  Sparkles,
  Database,
  ShieldAlert,
  ShieldCheck,
  Bot,
  Layers,
  Zap,
  ArrowUpRight,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../common/StatCard';
import { ModalityBadge, StatusBadge, UrgencyBadge } from '../common/Badge';
import { Medical3DViewer } from '../viewer3d/Medical3DViewer';
import { StayHealthyFrontPage } from '../home/StayHealthyFrontPage';

interface DoctorDashboardProps {
  onNavigate: (view: string) => void;
  onSelectRecord: (recordId: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onNavigate,
  onSelectRecord,
}) => {
  const { user, allAnalyses, sqlStatus } = useAuth();
  const [viewMode, setViewMode] = useState<'frontpage' | 'workstation'>('frontpage');
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [show3DPreview, setShow3DPreview] = useState(true);
  const [active3DOrgan, setActive3DOrgan] = useState<'Lungs' | 'Brain' | 'Heart' | 'Spine'>('Lungs');

  const records = allAnalyses;
  const flaggedCount = records.filter((r) => r.status === 'flagged' || r.urgency === 'urgent' || r.urgency === 'critical').length;
  const queuedCount = records.filter((r) => r.status === 'queued').length;
  const completedCount = records.filter((r) => r.status === 'completed' || r.status === 'reviewed').length;

  const filteredRecords = records.filter((record) => {
    const matchesFilter = selectedUrgencyFilter === 'all' || record.urgency === selectedUrgencyFilter;
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top View Selector Pill */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('frontpage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'frontpage'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Stay Healthy Front Page</span>
          </button>

          <button
            onClick={() => setViewMode('workstation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'workstation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Physician Workstation Queue ({records.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Physician: {user?.name}</span>
        </div>
      </div>

      {viewMode === 'frontpage' ? (
        <StayHealthyFrontPage 
          onNavigate={onNavigate} 
          onSelectRecord={onSelectRecord} 
        />
      ) : (
        <div className="space-y-6">
          {/* 3D Dynamic Diagnostic Hero Header */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-blue-500/30 shadow-2xl relative overflow-hidden preserve-3d">
            {/* Glow backdrop circles */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none pulse-glow" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
                    3D DIAGNOSTIC WORKSTATION
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-emerald-400" />
                    SQLite DB: {sqlStatus?.tables?.analyses ?? 2} Scans Synced
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Physician Diagnostic Center
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl font-normal leading-relaxed">
                  Attending Clinician: <strong className="text-white font-semibold">{user?.name}</strong> &bull; {user?.specialization || 'Diagnostic Radiology'} &bull; License: {user?.licenseNumber || 'MD-84920-CA'} &bull; <span className="text-cyan-300">{user?.email}</span>
                </p>
              </div>

              {/* 3D Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onNavigate('new-analysis')}
                  id="doctor-start-scan-btn"
                  className="btn-primary-3d text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                  <span>Upload New DICOM Scan</span>
                </button>

                <button
                  onClick={() => onNavigate('precautions')}
                  className="px-4 py-2.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Bot className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span>Emergency Precautions AI</span>
                </button>

                <button
                  onClick={() => onNavigate('database')}
                  className="px-4 py-2.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Database Studio</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60">
                <div className="text-[10px] font-semibold text-slate-400">Urgent Triage Required</div>
                <div className="text-base font-black text-rose-400 mt-0.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  {flaggedCount} Cases
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60">
                <div className="text-[10px] font-semibold text-slate-400">Inference Pipeline</div>
                <div className="text-base font-black text-amber-300 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {queuedCount} Queued
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60">
                <div className="text-[10px] font-semibold text-slate-400">Evaluated & Archived</div>
                <div className="text-base font-black text-emerald-300 mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {completedCount} Studies
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60">
                <div className="text-[10px] font-semibold text-slate-400">PubMed Evidence Base</div>
                <div className="text-base font-black text-blue-300 mt-0.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                  36.4M+ Papers
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, study title, or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Urgency:</span>
              {(['all', 'critical', 'urgent', 'routine'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedUrgencyFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                    selectedUrgencyFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Active Clinical Queue Table */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Diagnostic Cases Review Queue ({filteredRecords.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Select any diagnostic case to inspect AI segmentation overlays, confidence scores, and PubMed citations.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  onClick={() => onSelectRecord(record.id)}
                  className="p-5 hover:bg-blue-50/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 border border-slate-200 flex items-center justify-center text-blue-700 shrink-0 font-black text-xs group-hover:border-blue-400 group-hover:shadow-md transition-all">
                      {record.modality.slice(0, 3).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {record.title}
                        </span>
                        <ModalityBadge modality={record.modality} />
                        <UrgencyBadge urgency={record.urgency} />
                        <StatusBadge status={record.status} />
                      </div>

                      <p className="text-xs text-slate-500">
                        Patient: <strong>{record.patientName}</strong> &bull; ID: {record.patientId} &bull; Submitted: {new Date(record.submittedAt).toLocaleDateString()}
                      </p>

                      {record.primaryFindingSummary && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal group-hover:bg-white group-hover:border-blue-100 transition-colors">
                          <span className="font-bold text-slate-900">AI Diagnostic Impression: </span>
                          {record.primaryFindingSummary}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(record.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span>Open Full Analysis</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}

              {filteredRecords.length === 0 && (
                <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                  <Scan className="w-8 h-8 text-slate-300 mx-auto" />
                  <div>No clinical studies matched your current search query or filter.</div>
                  <button
                    onClick={() => onNavigate('new-analysis')}
                    className="mt-2 text-blue-600 font-bold hover:underline"
                  >
                    Upload and evaluate a new medical scan &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
