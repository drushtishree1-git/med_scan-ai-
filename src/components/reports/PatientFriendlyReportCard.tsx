import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  ListChecks, 
  Sparkles, 
  Stethoscope, 
  User, 
  Copy, 
  Check, 
  Printer, 
  Info, 
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { PatientFriendlySummary } from '../../types';
import { generatePatientFriendlySummary } from '../../services/patientReportTranslator';

interface PatientFriendlyReportCardProps {
  clinicalText: string;
  categoryOrModality?: string;
  reportTitle?: string;
  patientName?: string;
  reportDate?: string;
  customPatientSummary?: PatientFriendlySummary;
  initialMode?: 'patient' | 'doctor';
}

export const PatientFriendlyReportCard: React.FC<PatientFriendlyReportCardProps> = ({
  clinicalText,
  categoryOrModality = 'Radiology',
  reportTitle = 'Medical Diagnostic Report',
  patientName,
  reportDate,
  customPatientSummary,
  initialMode = 'patient'
}) => {
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>(initialMode);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedQuestion, setCopiedQuestion] = useState<number | null>(null);
  const [selectedJargon, setSelectedJargon] = useState<{ term: string; explanation: string } | null>(null);

  const summary: PatientFriendlySummary = customPatientSummary || 
    generatePatientFriendlySummary(clinicalText, categoryOrModality, reportTitle);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = `${summary.statusHeading}. In plain words: ${summary.plainEnglishExplanation}. Key takeaways: ${summary.keyTakeaways.join('. ')}. Recommended next steps: ${summary.actionSteps.join('. ')}.`;
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyQuestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(index);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  const trafficColors = {
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      dot: 'bg-emerald-500'
    },
    yellow: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
      dot: 'bg-amber-500'
    },
    red: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-900',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
      dot: 'bg-rose-500'
    }
  }[summary.trafficLightStatus];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden transition-all">
      {/* Top Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Patient Understanding & Clinical Dual-View
            </h4>
            <p className="text-[11px] text-slate-500">
              Clear plain-English translation tailored for patients, with full physician data intact
            </p>
          </div>
        </div>

        {/* Dual Mode Switch Toggle */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/70 text-xs font-semibold">
          <button
            onClick={() => setViewMode('patient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'patient'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Patient-Friendly View</span>
          </button>
          <button
            onClick={() => setViewMode('doctor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'doctor'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-slate-700" />
            <span>Doctor / Specialist View</span>
          </button>
        </div>
      </div>

      {/* Patient Friendly Content */}
      {viewMode === 'patient' && (
        <div className="p-4 sm:p-6 space-y-5">
          {/* Traffic Light Banner */}
          <div className={`p-4 rounded-xl border ${trafficColors.bg} ${trafficColors.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs`}>
            <div className="flex items-center gap-3">
              {trafficColors.icon}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${trafficColors.badge}`}>
                    {summary.trafficLightStatus === 'green' ? '🟢 Normal / All Clear' : summary.trafficLightStatus === 'yellow' ? '🟡 Needs Monitoring' : '🔴 Review With Doctor'}
                  </span>
                  {patientName && (
                    <span className="text-xs font-medium text-slate-600">
                      Patient: {patientName}
                    </span>
                  )}
                </div>
                <h3 className={`text-sm sm:text-base font-bold mt-1 ${trafficColors.text}`}>
                  {summary.statusHeading}
                </h3>
              </div>
            </div>

            {/* Read Aloud Audio Button */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                isSpeaking 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span>Stop Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>🔊 Read Aloud in Plain English</span>
                </>
              )}
            </button>
          </div>

          {/* Plain English Translation */}
          <div className="p-4 sm:p-5 rounded-xl bg-blue-50/40 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>In Plain English: What Your Test Results Mean</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {summary.plainEnglishExplanation}
            </p>
          </div>

          {/* Key Takeaways & Action Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Takeaways */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                <ListChecks className="w-4 h-4 text-blue-600" />
                <span>3 Important Takeaways</span>
              </div>
              <ul className="space-y-2">
                {summary.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Steps for You */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recommended Steps For You</span>
              </div>
              <ul className="space-y-2">
                {summary.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions to Ask Your Doctor */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Questions To Ask Your Doctor At Your Next Visit</span>
              </div>
              <span className="text-[10px] text-amber-700 font-medium">Click to copy question</span>
            </div>

            <div className="space-y-2">
              {summary.questionsForDoctor.map((q, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleCopyQuestion(q, idx)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-200/60 hover:border-amber-400 cursor-pointer transition-all group text-xs text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <span className="group-hover:text-amber-900 font-medium">"{q}"</span>
                  </div>
                  <button className="p-1 text-slate-400 group-hover:text-amber-700">
                    {copiedQuestion === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Medical Jargon Buster */}
          {summary.jargonGlossary && summary.jargonGlossary.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Medical Jargon Buster (Click any term to understand)</span>
                </div>
                <span className="text-[10px] text-slate-400">Simplified terms from this report</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {summary.jargonGlossary.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedJargon(selectedJargon?.term === item.term ? null : item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedJargon?.term === item.term
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span>{item.term}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>

              {selectedJargon && (
                <div className="p-3 bg-white rounded-lg border border-blue-200 text-xs text-slate-700 shadow-xs animate-in fade-in">
                  <strong className="text-blue-900">{selectedJargon.term}:</strong> {selectedJargon.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Doctor / Specialist Technical View */}
      {viewMode === 'doctor' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300">
                Official Clinical Finding Record (Physician Review Format)
              </span>
            </div>
            {reportDate && (
              <span className="text-[11px] text-slate-400 font-mono">
                Date: {reportDate}
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
            {clinicalText}
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              This technical document contains standardized radiological, anatomical, and pathological nomenclature compliant with ACR/WHO clinical guidelines.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
