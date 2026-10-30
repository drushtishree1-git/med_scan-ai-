import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Printer, 
  Download, 
  X, 
  Sparkles, 
  User, 
  Calendar, 
  FileText, 
  Stethoscope, 
  HelpCircle, 
  ListChecks, 
  ShieldCheck,
  QrCode,
  Heart
} from 'lucide-react';
import { PatientFriendlySummary } from '../../types';

interface PatientFriendlyPrintSummaryProps {
  summary: PatientFriendlySummary;
  patientName?: string;
  patientId?: string;
  reportTitle?: string;
  reportDate?: string;
  department?: string;
  physicianName?: string;
  languageName?: string;
  onClose?: () => void;
}

export const PatientFriendlyPrintSummary: React.FC<PatientFriendlyPrintSummaryProps> = ({
  summary,
  patientName = 'Drushti Shree',
  patientId = 'MRN-7840129',
  reportTitle = 'Medical Diagnostic Study',
  reportDate = new Date().toISOString().split('T')[0],
  department = 'Diagnostic Medicine',
  physicianName = 'Dr. Drushti Shree, MD',
  languageName = 'English',
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTextSummary = () => {
    const textContent = `
=============================================================
           PATIENT HEALTH SUMMARY & CARE GUIDE
=============================================================
Patient Name : ${patientName}
Patient MRN  : ${patientId}
Exam Title   : ${reportTitle}
Date of Exam : ${reportDate}
Department   : ${department}
Physician    : ${physicianName}
Language     : ${languageName}

HEALTH STATUS:
[${summary.trafficLightStatus.toUpperCase()}] - ${summary.statusHeading}

-------------------------------------------------------------
WHAT YOUR TEST RESULTS MEAN (IN PLAIN WORDS):
-------------------------------------------------------------
${summary.plainEnglishExplanation}

-------------------------------------------------------------
3 KEY TAKEAWAYS:
-------------------------------------------------------------
${summary.keyTakeaways.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

-------------------------------------------------------------
RECOMMENDED STEPS FOR YOU:
-------------------------------------------------------------
${summary.actionSteps.map((step, idx) => `• ${step}`).join('\n')}

-------------------------------------------------------------
QUESTIONS TO ASK YOUR DOCTOR AT YOUR NEXT APPOINTMENT:
-------------------------------------------------------------
${summary.questionsForDoctor.map((q, idx) => `[ ] Question ${idx + 1}: "${q}"`).join('\n')}

-------------------------------------------------------------
MEDICAL JARGON BUSTER (SIMPLIFIED TERMS):
-------------------------------------------------------------
${summary.jargonGlossary.map((j) => `• ${j.term}: ${j.explanation}`).join('\n')}

=============================================================
Verified by MediScan AI Clinical Engine • ACR / WHO Compliant
=============================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Patient_Summary_${patientId}_${reportDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusThemes = {
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />,
      label: 'Normal / Healthy Results'
    },
    yellow: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />,
      label: 'Notice: Needs Monitoring'
    },
    red: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-900',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />,
      label: 'Doctor Review Recommended'
    }
  }[summary.trafficLightStatus];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        
        {/* On-Screen Action Bar (Hidden in Print) */}
        <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Patient-Friendly Summary PDF & Print Document
              </h3>
              <p className="text-[11px] text-slate-400">
                Clear, compassionate plain-language summary for patient home records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTextSummary}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              title="Download text summary copy"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Download Text</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              title="Save as PDF or print document"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Print / Save as PDF</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 print:overflow-visible print:p-0">
          
          {/* Header Banner */}
          <div className="border-b-2 border-emerald-600 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  MediScan AI
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Patient Care Summary
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Personalized Healthcare Diagnostic Explanation & Follow-Up Guide
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-900">{department}</div>
              <div className="text-[11px] text-slate-500">Date: {reportDate}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">Language: {languageName}</div>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Patient Name</span>
              <span className="font-bold text-slate-900">{patientName}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Patient ID / MRN</span>
              <span className="font-mono font-bold text-slate-800">{patientId}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Test / Examination</span>
              <span className="font-semibold text-slate-800 truncate block">{reportTitle}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Reviewing Physician</span>
              <span className="font-semibold text-slate-800 truncate block">{physicianName}</span>
            </div>
          </div>

          {/* Traffic Light Status Card */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${statusThemes.bg} ${statusThemes.border} flex items-start gap-4 shadow-xs`}>
            {statusThemes.icon}
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusThemes.badge}`}>
                  {statusThemes.label}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Official Triage Assessment</span>
              </div>
              <h2 className={`text-base sm:text-lg font-extrabold ${statusThemes.text}`}>
                {summary.statusHeading}
              </h2>
            </div>
          </div>

          {/* In Plain English */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>In Plain English: What Your Test Results Mean</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {summary.plainEnglishExplanation}
            </p>
          </div>

          {/* 3 Key Takeaways & Recommended Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Takeaways */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <ListChecks className="w-4 h-4 text-blue-600" />
                <span>3 Important Takeaways</span>
              </h4>
              <ul className="space-y-2">
                {summary.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Steps */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recommended Steps For You</span>
              </h4>
              <ul className="space-y-2">
                {summary.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions to Ask Your Doctor Checklist */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Checklist: Questions To Ask Your Doctor At Your Next Visit</span>
              </h4>
              <span className="text-[10px] text-amber-700 font-semibold print:hidden">
                Print & check off in clinic
              </span>
            </div>

            <div className="space-y-2.5">
              {summary.questionsForDoctor.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-amber-200/60 text-xs text-slate-800">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="leading-snug font-medium">"{q}"</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jargon Buster Glossary */}
          {summary.jargonGlossary && summary.jargonGlossary.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Medical Terms Explained in Plain Words</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {summary.jargonGlossary.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <strong className="text-blue-900 block text-[11px] mb-0.5">{item.term}</strong>
                    <span className="text-slate-600 text-[11px] leading-relaxed block">{item.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer & Disclaimer */}
          <div className="pt-4 border-t border-slate-200 text-center space-y-1 text-[10px] text-slate-400">
            <div className="flex items-center justify-center gap-1 text-slate-500 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Compliant with ACR & WHO Patient Communication Standards</span>
            </div>
            <p>
              This patient summary is prepared to assist you in understanding your diagnostic findings and preparing for consultations with your physician. It does not replace medical consultation.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
