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
  Database,
  Sparkles,
  Volume2,
  HelpCircle,
  Stethoscope,
  Printer
} from 'lucide-react';
import { MedicalReport } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeletonTable } from '../common/LoadingSkeleton';
import { PatientFriendlyReportCard } from './PatientFriendlyReportCard';
import { PatientFriendlyPrintSummary } from './PatientFriendlyPrintSummary';
import { generatePatientFriendlySummary } from '../../services/patientReportTranslator';

interface MedicalReportsViewProps {
  onNavigateToNewAnalysis: () => void;
}

const DEFAULT_SAMPLE_REPORTS: MedicalReport[] = [
  {
    id: 'REP-78401',
    reportNumber: 'RAD-90812-CXR',
    title: 'PA Chest Radiograph Diagnostic Evaluation',
    category: 'Radiology',
    patientId: 'MRN-7840129',
    patientName: 'Drushti Shree',
    physicianName: 'Dr. Sarah Lin, MD (Radiology)',
    date: '2026-10-28',
    status: 'Final',
    fileFormat: 'DICOM',
    fileSize: '18.4 MB',
    department: 'Diagnostic Radiology',
    summary: 'PA and lateral chest radiograph demonstrates focal dense alveolar consolidation in the right lower lobe basal segment with air bronchograms, consistent with acute community-acquired lobar pneumonia. Left lung clear. Heart size normal.',
    patientFriendlySummary: generatePatientFriendlySummary(
      'Focal dense alveolar consolidation in the right lower lobe with air bronchograms, consistent with acute lobar pneumonia.',
      'Radiology',
      'PA Chest Radiograph Evaluation'
    )
  },
  {
    id: 'REP-78402',
    reportNumber: 'NEU-45210-MRI',
    title: 'Brain MRI T1/T2 FLAIR Multi-Planar Study',
    category: 'Radiology',
    patientId: 'MRN-7840129',
    patientName: 'Drushti Shree',
    physicianName: 'Dr. Michael Chen, MD (Neuroradiology)',
    date: '2026-10-27',
    status: 'Final',
    fileFormat: 'DICOM',
    fileSize: '24.2 MB',
    department: 'Neuroradiology Division',
    summary: 'Multi-planar T1, T2, and FLAIR acquisitions demonstrate preserved bilateral hemispheric structural symmetry. Ventricular system, basal cisterns, and cortical sulci appear intact with normal caliber. No focal mass effect, midline shift, or intracranial hemorrhage.',
    patientFriendlySummary: generatePatientFriendlySummary(
      'Preserved bilateral hemispheric structural symmetry. Normal ventricular caliber without focal mass effect or midline shift.',
      'Radiology',
      'Brain MRI Multi-Planar Study'
    )
  },
  {
    id: 'REP-78403',
    reportNumber: 'LAB-33918-CBC',
    title: 'Complete Blood Count (CBC) with Differential',
    category: 'Laboratory',
    patientId: 'MRN-7840129',
    patientName: 'Drushti Shree',
    physicianName: 'Dr. Emily Watson, MD (Hematopathology)',
    date: '2026-10-26',
    status: 'Final',
    fileFormat: 'PDF',
    fileSize: '1.2 MB',
    department: 'Clinical Pathology Laboratories',
    summary: 'CBC shows mild microcytic hypochromic red blood cell indices. Hemoglobin 11.2 g/dL (reference 12.0-15.5 g/dL), Hematocrit 33.8%, MCV 74.2 fL (low), and RDW elevated at 16.2%. Findings suggest early iron-deficiency microcytic erythropoiesis.',
    patientFriendlySummary: generatePatientFriendlySummary(
      'Mild microcytic hypochromic red blood cell indices with Hemoglobin 11.2 g/dL and elevated RDW suggesting iron deficiency.',
      'Laboratory',
      'Complete Blood Count (CBC)'
    )
  }
];

export const MedicalReportsView: React.FC<MedicalReportsViewProps> = ({
  onNavigateToNewAnalysis,
}) => {
  const { user, allReports, addReportRecord, deleteReportRecord } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeReportModal, setActiveReportModal] = useState<MedicalReport | null>(null);
  const [modalMode, setModalMode] = useState<'patient' | 'doctor'>('patient');
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [printReportTarget, setPrintReportTarget] = useState<MedicalReport | null>(null);

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

  const reportsList = allReports.length > 0 ? allReports : DEFAULT_SAMPLE_REPORTS;

  const filteredReports = reportsList.filter((report) => {
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
    const patientFriendlySummary = generatePatientFriendlySummary(
      newSummary,
      newCategory,
      newTitle
    );

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
      patientFriendlySummary,
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
              Medical Documentation & Patient-Friendly Reports
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-600" />
              <span>{reportsList.length} Inserted Records in SQLite</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Easily understandable plain-English summaries, audio readers, and doctor question guides alongside official clinical data.
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
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by title, MRN, patient name, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No medical reports match the search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Report Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Patient & Doctor</th>
                  <th className="py-3 px-4">Patient Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => {
                  const summaryData = report.patientFriendlySummary || 
                    generatePatientFriendlySummary(report.summary, report.category, report.title);
                  const isGreen = summaryData.trafficLightStatus === 'green';
                  const isYellow = summaryData.trafficLightStatus === 'yellow';

                  return (
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
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border inline-flex items-center gap-1 ${
                          isGreen 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : isYellow 
                              ? 'bg-amber-50 text-amber-800 border-amber-200' 
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isGreen ? 'bg-emerald-500' : isYellow ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                          {isGreen ? 'Normal / Clear' : isYellow ? 'Needs Monitoring' : 'Doctor Review'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {report.date}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setActiveReportModal(report);
                              setModalMode('patient');
                            }}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Open patient-friendly plain English translation with audio reader"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Plain English</span>
                          </button>
                          <button
                            onClick={() => setPrintReportTarget(report)}
                            className="px-2 py-1 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Download or Print 1-page Patient PDF Summary"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-600" />
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveReportModal(report);
                              setModalMode('doctor');
                            }}
                            className="px-2 py-1 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Doctor / Technical View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Doctor</span>
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
                  );
                })}
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

      {/* View Detail Report Modal with Dual-View Patient-Friendly Card */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
                    {activeReportModal.title}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Ref: {activeReportModal.reportNumber} &bull; {activeReportModal.department}
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

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Patient Friendly Interactive Card */}
              <PatientFriendlyReportCard
                clinicalText={activeReportModal.summary}
                categoryOrModality={activeReportModal.category}
                reportTitle={activeReportModal.title}
                patientName={activeReportModal.patientName}
                patientId={activeReportModal.patientId}
                reportDate={activeReportModal.date}
                department={activeReportModal.department}
                physicianName={activeReportModal.physicianName}
                customPatientSummary={activeReportModal.patientFriendlySummary}
                initialMode={modalMode}
              />

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 leading-relaxed text-xs flex items-center justify-between">
                <div>
                  <strong>SQLite Persisted Record:</strong> Stored in `data/sqlite_store.db` under table `reports`.
                </div>
                <span className="text-[11px] text-blue-700 font-mono">
                  Format: {activeReportModal.fileFormat} ({activeReportModal.fileSize})
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                Patient ID: {activeReportModal.patientId} &bull; Physician: {activeReportModal.physicianName}
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

      {/* Standalone Quick Print Patient Friendly PDF Modal */}
      {printReportTarget && (
        <PatientFriendlyPrintSummary
          summary={printReportTarget.patientFriendlySummary || generatePatientFriendlySummary(printReportTarget.summary, printReportTarget.category, printReportTarget.title)}
          patientName={printReportTarget.patientName}
          patientId={printReportTarget.patientId}
          reportTitle={printReportTarget.title}
          reportDate={printReportTarget.date}
          department={printReportTarget.department}
          physicianName={printReportTarget.physicianName}
          onClose={() => setPrintReportTarget(null)}
        />
      )}
    </div>
  );
};
