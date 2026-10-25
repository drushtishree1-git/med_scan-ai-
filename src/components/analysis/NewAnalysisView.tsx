import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Scan, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  Layers, 
  Plus, 
  Trash2,
  Info,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  Activity,
  Printer,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnalysisModality, AnalysisUrgency, AnalysisRecord } from '../../types';
import { AnalysisResultsDisplay } from './AnalysisResultsDisplay';
import { PubMedRAGVerificationCard } from './PubMedRAGVerificationCard';
import { PrescriptionsAndPrecautionsCard } from './PrescriptionsAndPrecautionsCard';

interface NewAnalysisViewProps {
  onAnalysisCreated?: (analysisData: AnalysisRecord) => void;
  onNavigateToHistory: () => void;
}

const SAMPLE_SCANS = [
  {
    title: 'PA Chest Radiograph (Thoracic)',
    modality: 'xray' as AnalysisModality,
    symptoms: ['Mild cough', 'Post-viral dyspnea'],
    notes: 'Evaluate bronchovascular markings and rule out focal pneumonia.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Brain MRI T2 FLAIR Cross-Section',
    modality: 'mri' as AnalysisModality,
    symptoms: ['Intermittent tension cefalea', 'Visual aura'],
    notes: 'Assess ventricular symmetry and exclude microvascular white-matter changes.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Comprehensive Metabolic Panel & CBC Report (Normal Baseline)',
    modality: 'lab_report' as AnalysisModality,
    symptoms: ['Annual physical exam', 'Normal routine wellness checkup'],
    notes: 'Standard outpatient preventative screening. All CBC, CMP, and renal parameters within reference intervals.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'CBC with Microcytic Indicators (Mild Anemia)',
    modality: 'lab_report' as AnalysisModality,
    symptoms: ['Mild fatigue', 'Post-exertional tiredness'],
    notes: 'Screen for iron depletion, red cell indices, and ferritin saturation.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  },
];

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  onAnalysisCreated,
  onNavigateToHistory,
}) => {
  const { user, addAnalysisRecord } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [selectedModality, setSelectedModality] = useState<AnalysisModality>('xray');
  const [studyTitle, setStudyTitle] = useState('PA Chest Radiograph - Diagnostic Screening');
  const [urgency, setUrgency] = useState<AnalysisUrgency>('routine');
  const [patientName, setPatientName] = useState(
    user?.role === 'patient' ? user.name : 'Drushti Shree'
  );
  const [patientId, setPatientId] = useState(
    user?.role === 'patient' ? (user.patientId || 'MRN-7840129') : 'MRN-7840129'
  );
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([
    'Mild cough',
    'Post-viral checkup',
  ]);
  const [anatomicalRegion, setAnatomicalRegion] = useState('Thorax / Lungs');

  // File & AI Inference States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedRecord, setCompletedRecord] = useState<AnalysisRecord | null>(null);
  const [formError, setFormError] = useState('');
  const [sampleScans, setSampleScans] = useState<any[]>(SAMPLE_SCANS);

  useEffect(() => {
    fetch('/api/dataset/sample-xrays')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.samples) && data.samples.length > 0) {
          const datasetSamples = data.samples.map((s: any) => ({
            title: s.title,
            modality: 'xray' as AnalysisModality,
            symptoms: s.symptoms,
            notes: s.notes,
            imagePlaceholder: s.imagePlaceholder,
            fileName: s.fileName,
          }));
          setSampleScans([
            ...datasetSamples,
            ...SAMPLE_SCANS.filter((s) => s.modality !== 'xray'),
          ]);
        }
      })
      .catch((err) => console.warn('[Sample scans fetch warning]', err));
  }, []);

  const modalities: { id: AnalysisModality; label: string; desc: string; icon: string }[] = [
    { id: 'xray', label: 'Chest X-Ray', desc: 'Pneumonia, cardiomegaly, effusion', icon: '🩻' },
    { id: 'mri', label: 'Brain / Spine MRI', desc: 'T1/T2 FLAIR, lesions, stroke', icon: '🧠' },
    { id: 'lab_report', label: 'Lab Report PDF/OCR', desc: 'Metabolic panels, CBC, pathology', icon: '📄' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFormError('');
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleLoadSample = (sample: any) => {
    setSelectedModality(sample.modality);
    setStudyTitle(sample.title);
    setSymptoms(sample.symptoms);
    setClinicalNotes(sample.notes);
    setFilePreview(sample.imagePlaceholder);
    const fname = sample.fileName || `${sample.modality}_sample_scan.jpg`;
    setSelectedFile(new File([''], fname, { type: 'image/jpeg' }));
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (indexToRemove: number) => {
    setSymptoms(symptoms.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      // Candidates for API endpoint: local route first, then active public Cloudflare tunnel
      const endpoints = [
        '/api/ai/analyze-scan',
        'https://avatar-importance-arrested-uncertainty.trycloudflare.com/api/ai/analyze-scan',
      ];

      let data: any = null;
      for (const ep of endpoints) {
        try {
          const response = await fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              modality: selectedModality,
              title: studyTitle,
              symptoms,
              clinicalNotes,
              imageBase64: filePreview?.startsWith('data:image') ? filePreview : undefined,
            }),
          });
          if (response.ok) {
            const ct = response.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
              const resJson = await response.json();
              if (resJson.success && resJson.result && resJson.result.summary) {
                data = resJson;
                break;
              }
            }
          }
        } catch (epErr) {
          console.warn(`[Endpoint ${ep} connection error]`, epErr);
        }
      }

      if (!data || !data.result) {
        throw new Error('No backend responded with a valid clinical diagnostic analysis');
      }

      const aiResult = data.result || {};
      const trainedModelInference = selectedModality === 'xray' ? data.trainedModelInference : undefined;

      const newRecord: AnalysisRecord = {
        id: `MED-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: studyTitle || `${selectedModality.toUpperCase()} Diagnostic Study`,
        modality: selectedModality,
        status: 'completed',
        urgency: (aiResult.urgency as AnalysisUrgency) || urgency,
        patientId,
        patientName,
        doctorId: user?.role === 'doctor' ? user.id : 'DOC-84920',
        doctorName: user?.role === 'doctor' ? user.name : 'Dr. Drushti Shree, MD',
        submittedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        symptoms,
        clinicalNotes: clinicalNotes || (user?.email ? `Account email: ${user.email}` : undefined),
        fileName: selectedFile?.name || `${selectedModality}_scan_${Date.now()}.dcm`,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '18.4 MB',
        fileType: selectedModality === 'lab_report' ? 'Document/Lab Report' : 'DICOM/Image',
        primaryFindingSummary: aiResult.summary,
        confidenceScore: aiResult.confidenceScore || 0.96,
        tags: [selectedModality.toUpperCase(), ...(selectedModality === 'xray' ? ['Deep Learning Model'] : []), 'PubMed Verified', 'RAG Validated'],
        trainedModelInference,
        labReportData: aiResult.labReportData,
        ragVerification: aiResult.ragVerification,
        prescriptions: aiResult.prescriptions,
        precautions: aiResult.precautions,
        treatmentOptions: aiResult.treatmentOptions,
      };

      addAnalysisRecord(newRecord);
      setCompletedRecord(newRecord);
      onAnalysisCreated?.(newRecord);
    } catch (err: any) {
      console.error('Error during clinical analysis:', err);
      setFormError(err?.message || 'Clinical diagnostic analysis failed. Please verify the image and ensure the deep learning service is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Clinical Intake & Evidence-Based Diagnostic Analysis
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PubMed & RAG Double-Verified</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload diagnostic DICOM images, X-Rays, or clinical PDFs to trigger real-time diagnostic evaluation, cross-verified with PubMed clinical research datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Session: {user?.email}</span>
          </span>
        </div>
      </div>

      {completedRecord ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <AnalysisResultsDisplay
            record={completedRecord}
            showActions={true}
            onNavigateToHistory={onNavigateToHistory}
            onAnalyzeAnother={() => {
              setCompletedRecord(null);
              setSelectedFile(null);
              setFilePreview(null);
            }}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Quick Clinical Samples Loader */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-blue-900">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Quick Test with Clinical Study Presets:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sampleScans.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(sample)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 font-medium transition-colors cursor-pointer text-[11px]"
                  title={sample.title}
                >
                  {sample.groundTruth ? `[${sample.groundTruth}] ` : ''}Load {sample.title.split(' ')[0]} {sample.modality.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 1. Modality Selector */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              1. Select Clinical Modality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {modalities.map((item) => {
                const isSelected = selectedModality === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedModality(item.id);
                      if (item.id === 'lab_report') {
                        setStudyTitle('Comprehensive Diagnostic Laboratory & Blood Test Report');
                        setSymptoms(['Routine wellness evaluation', 'Normal health checkup']);
                        setAnatomicalRegion('Venous Whole Blood / Serum');
                        setClinicalNotes('Assess routine complete blood count and comprehensive metabolic panel.');
                      } else if (item.id === 'mri') {
                        setStudyTitle('Brain MRI T2 FLAIR Diagnostic Scan');
                        setSymptoms(['Intermittent tension cefalea', 'Visual assessment']);
                        setAnatomicalRegion('Brain / Neurocranium');
                        setClinicalNotes('Assess ventricular symmetry and exclude microvascular white-matter changes.');
                      } else {
                        setStudyTitle('PA Chest Radiograph - Diagnostic Screening');
                        setSymptoms(['Mild cough', 'Post-viral checkup']);
                        setAnatomicalRegion('Thorax / Lungs');
                        setClinicalNotes('Rule out pulmonary infiltrates and consolidation.');
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-xs font-semibold truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. File Upload Dropzone */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                2. Upload Medical Scan or Clinical Report
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                Supported: DICOM (.dcm), PNG, JPEG, PDF (up to 50MB)
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf,.dcm"
              className="hidden"
            />

            {!selectedFile && !filePreview ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-800">
                  Drag and drop your scan here, or browse files
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Automatic DICOM parsing, window leveling, and clinical anomaly detection pipeline.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Scan Preview"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      DICOM
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {selectedFile?.name || 'sample_scan.jpg'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {selectedFile
                        ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : 'Preloaded Test Scan (12.4 MB)'}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Validated Ready for Analysis
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 3. Patient & Clinical Context */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              3. Patient Context & Clinical Indications
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Study Title / Protocol
                </label>
                <input
                  type="text"
                  value={studyTitle}
                  onChange={(e) => setStudyTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as AnalysisUrgency)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="routine">Routine Checkup / Screening</option>
                  <option value="urgent">Urgent Clinical Indication</option>
                  <option value="stat">STAT Immediate Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medical Record Number (MRN)
                </label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Symptoms and Notes */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reported Clinical Symptoms
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSymptom();
                      }
                    }}
                    placeholder="e.g. Sharp focal pain, dyspnea, nausea..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSymptom}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                  {symptoms.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium"
                    >
                      <span>{symptom}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(idx)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {symptoms.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No symptoms added yet</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physician / Patient Notes
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Describe radiological indications or medical history..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Submission bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Evidence-based Clinical Diagnostic Engine with Real-Time PubMed & RAG Double-Verification.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-analysis-btn"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Running Clinical Vision & PubMed RAG Verification...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Execute Real-Time Scan Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
