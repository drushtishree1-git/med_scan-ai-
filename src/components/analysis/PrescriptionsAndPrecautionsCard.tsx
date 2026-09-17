import React, { useState } from 'react';
import { 
  Pill, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Activity, 
  CheckCircle2, 
  HeartHandshake, 
  Sparkles,
  Printer,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Stethoscope,
  Info
} from 'lucide-react';
import { ClinicalPrescriptionItem, ClinicalPrecautions, TreatmentAndManagementOptions } from '../../types';

interface PrescriptionsAndPrecautionsCardProps {
  prescriptions?: ClinicalPrescriptionItem[];
  precautions?: ClinicalPrecautions;
  treatmentOptions?: TreatmentAndManagementOptions;
  patientName?: string;
  patientId?: string;
  doctorName?: string;
  caseId?: string;
  scanTitle?: string;
}

export const PrescriptionsAndPrecautionsCard: React.FC<PrescriptionsAndPrecautionsCardProps> = ({
  prescriptions = [],
  precautions,
  treatmentOptions,
  patientName = 'Patient Record',
  patientId = 'MRN-7840129',
  doctorName = 'Dr. Sarah Jenkins, MD',
  caseId = 'MED-2025-0891',
  scanTitle = 'Diagnostic Study',
}) => {
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'precautions' | 'treatmentOptions'>('prescriptions');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm space-y-0">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Clinical Prescription (Rx), Precautions & Treatment Options
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Physician Supervised
              </span>
            </div>
            <p className="text-xs text-blue-200/80 mt-0.5">
              Verified clinical action plan for {patientName} ({patientId}) &bull; Attending: {doctorName}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
          title="Print official prescription summary"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF Rx</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'prescriptions'
              ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-4 h-4 text-blue-600" />
          <span>Clinical Prescriptions ({prescriptions.length} Meds)</span>
        </button>

        <button
          onClick={() => setActiveTab('precautions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'precautions'
              ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Precautions & Safety Directives</span>
        </button>

        <button
          onClick={() => setActiveTab('treatmentOptions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'treatmentOptions'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4 text-indigo-600" />
          <span>All Other Treatment & Management Options</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 sm:p-6 bg-white space-y-6">
        {/* 1. PRESCRIPTIONS TAB */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Evidence-Based Pharmaceutical Regimen (Rx)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Compliant with FDA / WHO Standard Formularies
              </span>
            </div>

            {prescriptions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {prescriptions.map((rx, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/20 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider ${
                            rx.rxType === 'Primary Rx'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : rx.rxType === 'Supportive Rx'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {rx.rxType || 'Standard Rx'}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {rx.route || 'Oral'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {rx.medication}
                        </h4>
                        <div className="text-xs text-slate-500 font-medium italic">
                          Generic: {rx.genericName}
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 shrink-0">
                        <Pill className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Dosage & Strength</div>
                        <div className="font-bold text-slate-800 mt-0.5">{rx.dosage}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Frequency & Duration</div>
                        <div className="font-bold text-slate-800 mt-0.5">{rx.frequency} &bull; {rx.duration}</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <strong className="text-slate-800 font-semibold">Therapeutic Indication: </strong>
                      {rx.indication}
                    </div>

                    {rx.pharmacistNotes && (
                      <div className="text-[11px] text-blue-900 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200/80">
                        <strong className="font-semibold text-blue-950">Pharmacist Guidance: </strong>
                        {rx.pharmacistNotes}
                      </div>
                    )}

                    {rx.contraindications && rx.contraindications.length > 0 && (
                      <div className="text-[11px] text-rose-700 bg-rose-50/80 p-2 rounded-xl border border-rose-200 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Contraindications / Warnings: </strong>
                          {rx.contraindications.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                No acute pharmaceutical intervention required for this diagnostic study. Continue preventive wellness protocol.
              </div>
            )}
          </div>
        )}

        {/* 2. PRECAUTIONS TAB */}
        {activeTab === 'precautions' && precautions && (
          <div className="space-y-5">
            {/* Red Flag Emergency Symptoms */}
            {precautions.redFlagEmergencySymptoms && precautions.redFlagEmergencySymptoms.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-rose-800 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Red-Flag Emergency Symptoms — Seek Immediate Medical Attention</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {precautions.redFlagEmergencySymptoms.map((sym, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-200 text-rose-900 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immediate Directives & Lifestyle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Immediate Clinical Directives</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {precautions.immediateDirectives?.map((dir, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{dir}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Lifestyle & Activity Restrictions</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {precautions.lifestyleAndActivity?.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dietary & Critical Contraindications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-teal-600" />
                  <span>Dietary & Hydration Protocol</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {precautions.dietaryAndHydration?.map((diet, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{diet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2.5">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Critical Contraindications (What To Avoid)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-900">
                  {precautions.criticalContraindications?.map((contra, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-amber-600 font-bold">✕</span>
                      <span>{contra}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. TREATMENT & MANAGEMENT OPTIONS TAB */}
        {activeTab === 'treatmentOptions' && treatmentOptions && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Conservative & Outpatient Therapies</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {treatmentOptions.conservativeTherapy?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Interventional & Surgical Pathways</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {treatmentOptions.interventionalOrSurgical?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-indigo-600" />
                  <span>Adjunct Therapies & Rehabilitation</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {treatmentOptions.adjunctRehabilitation?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Follow-Up Imaging & Monitoring Timeline</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {treatmentOptions.followUpImagingTimeline?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
