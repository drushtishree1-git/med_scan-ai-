import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Filter, 
  Calendar, 
  User, 
  Building2, 
  FileCheck, 
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Database
} from 'lucide-react';
import { MedicalReport } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeletonTable } from '../common/LoadingSkeleton';

interface MedicalReportsViewProps {
  onNavigateToNewAnalysis: () => void;
}

export const MedicalReportsView: React.FC<MedicalReportsViewProps> = ({
  onNavigateToNewAnalysis,
}) => {
  const { user, allReports, addReportRecord, deleteReportRecord } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeReportModal, setActiveReportModal] = useState<MedicalReport | null>(null);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);

  // New report form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Radiology' | 'Pathology' | 'Laboratory' | 'Cardiology' | 'Discharge Summary'>('Radiology');
  const [newDepartment, setNewDepartment] = useState('Diagnostic Radiology');
  const [newPatientName, setNewPatientName] = useState(user?.name || 'Drushti Shree');
  const [newPatientId, setNewPatientId] = useState(user?.patientId || 'MRN-7840129');
  const [newSummary, setNewSummary] = useState('');
  const [newFileFormat, setNewFileFormat] = useState<'PDF' | 'DICOM' | 'DOCX'>('PDF');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['All', 'Radiology', 'Pathology', 'Laboratory', 'Cardiology', 'Discharge Summary'];

  const filteredReports = allReports.filter((report) => {
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.physicianName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    setIsSubmitting(true);
    const createdReport: MedicalReport = {
      id: `REP-${Date.now()}`,
      reportNumber: `${newCategory.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-DOC`,
      title: newTitle,
      category: newCategory,
      patientId: newPatientId || 'MRN-7840129',
      patientName: newPatientName || 'Drushti Shree',
      physicianName: user?.role === 'doctor' ? user.name : 'Dr. Drushti Shree, MD',
      date: new Date().toISOString().split('T')[0],
      status: 'Final',
      fileFormat: newFileFormat,
      fileSize: '1.8 MB',
      department: newDepartment,
      summary: newSummary,
    };

    await addReportRecord(createdReport);
    setIsSubmitting(false);
    setIsAddReportModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewSummary('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Medical Documentation & Clinical Reports
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-600" />
              <span>{allReports.length} Inserted Reports in SQLite</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized clinical reports, radiology summaries, and laboratory document persistence in SQLite.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddReportModalOpen(true)}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert New Report</span>
          </button>
        </div>
      </div>

      {/* Filter & Category Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reports by report ID, test title, physician, patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table List */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {filteredReports.length === 0 ? (
          <EmptyState
            title="No Clinical Reports Found"
            description="No medical documentation matches your filter query. Click 'Insert New Report' to save a new record to SQLite."
            actionText="Insert Report Now"
            onAction={() => setIsAddReportModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Report Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Patient / Physician</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {report.title}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {report.reportNumber} &bull; {report.department}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {report.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800 block">{report.patientName}</span>
                        <span className="text-[11px] text-slate-500 block">{report.physicianName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {report.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveReportModal(report)}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => deleteReportRecord(report.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Report from SQLite"
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
        )}
      </div>

      {/* Insert New Report Modal */}
      {isAddReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Insert Clinical Medical Report</h3>
                  <p className="text-[11px] text-slate-500">Persist new clinical report directly to SQLite database.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddReportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReportSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Report Title / Test Examination</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chest Radiograph Evaluation & Pulmonology Notes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Clinical Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-hidden"
                  >
                    <option value="Radiology">Radiology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Patient ID / MRN</label>
                  <input
                    type="text"
                    required
                    value={newPatientId}
                    onChange={(e) => setNewPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Executive Clinical Findings & Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed clinical findings, diagnostic observations, or physician notes..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving to SQLite...' : 'Save & Insert Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Report Modal */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
                    {activeReportModal.title}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Ref: {activeReportModal.reportNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Department</span>
                  <span className="font-semibold text-slate-800">{activeReportModal.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date of Record</span>
                  <span className="font-semibold text-slate-800">{activeReportModal.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                  <span className="font-semibold text-emerald-700">{activeReportModal.status} Report</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                  Executive Clinical Summary
                </h4>
                <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {activeReportModal.summary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 leading-relaxed text-xs">
                <strong>SQLite Persisted Record:</strong> This report is stored in `data/sqlite_store.db` under table `reports`.
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Format: {activeReportModal.fileFormat} ({activeReportModal.fileSize})
              </span>
              <button
                onClick={() => setActiveReportModal(null)}
                className="btn-ghost"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
