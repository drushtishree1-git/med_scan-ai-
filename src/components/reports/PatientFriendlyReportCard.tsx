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
  ArrowRight,
  Globe,
  Download,
  Languages
} from 'lucide-react';
import { PatientFriendlySummary } from '../../types';
import { 
  generatePatientFriendlySummary, 
  SupportedReportLanguage 
} from '../../services/patientReportTranslator';
import { PatientFriendlyPrintSummary } from './PatientFriendlyPrintSummary';

interface PatientFriendlyReportCardProps {
  clinicalText: string;
  categoryOrModality?: string;
  reportTitle?: string;
  patientName?: string;
  patientId?: string;
  reportDate?: string;
  department?: string;
  physicianName?: string;
  customPatientSummary?: PatientFriendlySummary;
  initialMode?: 'patient' | 'doctor';
}

const LANGUAGE_OPTIONS: { code: SupportedReportLanguage; name: string; nativeName: string; flag: string; speechCode: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechCode: 'kn-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechCode: 'te-IN' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA' },
];

export const PatientFriendlyReportCard: React.FC<PatientFriendlyReportCardProps> = ({
  clinicalText,
  categoryOrModality = 'Radiology',
  reportTitle = 'Medical Diagnostic Report',
  patientName = 'Drushti Shree',
  patientId = 'MRN-7840129',
  reportDate = new Date().toISOString().split('T')[0],
  department = 'Diagnostic Radiology',
  physicianName = 'Dr. Drushti Shree, MD',
  customPatientSummary,
  initialMode = 'patient'
}) => {
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>(initialMode);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedReportLanguage>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedQuestion, setCopiedQuestion] = useState<number | null>(null);
  const [selectedJargon, setSelectedJargon] = useState<{ term: string; explanation: string } | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Generate localized summary based on selected language
  const summary: PatientFriendlySummary = (selectedLanguage === 'en' && customPatientSummary)
    ? customPatientSummary
    : generatePatientFriendlySummary(clinicalText, categoryOrModality, reportTitle, selectedLanguage);

  // Speech cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentLangObj = LANGUAGE_OPTIONS.find(l => l.code === selectedLanguage) || LANGUAGE_OPTIONS[0];

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

    const textToRead = `${summary.statusHeading}. ${summary.plainEnglishExplanation}. ${summary.keyTakeaways.join('. ')}. ${summary.actionSteps.join('. ')}.`;
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.lang = currentLangObj.speechCode;

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
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden transition-all">
        {/* Top Switcher Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between p-3.5 sm:p-4 bg-slate-50/90 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Patient Understanding & Multi-Language Care Hub
                </h4>
                <span className="px-2 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                  Simplified
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Clear plain-language breakdown in 9 languages, downloadable summary, and doctor questions
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            {/* Language Switcher Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value as SupportedReportLanguage);
                  if (isSpeaking) window.speechSynthesis.cancel();
                }}
                className="text-xs font-semibold text-slate-700 bg-transparent border-none focus:outline-hidden cursor-pointer"
                aria-label="Select report language"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Download & Print PDF Button */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Download or print patient-friendly 1-page PDF summary"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Patient PDF</span>
            </button>

            {/* Dual Mode Switch Toggle */}
            <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/70 text-xs font-semibold">
              <button
                onClick={() => setViewMode('patient')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'patient'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3 h-3 text-blue-600" />
                <span>Patient</span>
              </button>
              <button
                onClick={() => setViewMode('doctor')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'doctor'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3 h-3 text-slate-700" />
                <span>Doctor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Patient Friendly Content */}
        {viewMode === 'patient' && (
          <div className="p-4 sm:p-6 space-y-5">
            {/* Traffic Light Banner */}
            <div className={`p-4 rounded-2xl border ${trafficColors.bg} ${trafficColors.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs`}>
              <div className="flex items-center gap-3">
                {trafficColors.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${trafficColors.badge}`}>
                      {summary.trafficLightStatus === 'green' 
                        ? '🟢 Normal / All Clear' 
                        : summary.trafficLightStatus === 'yellow' 
                          ? '🟡 Needs Monitoring' 
                          : '🔴 Doctor Review'}
                    </span>
                    {patientName && (
                      <span className="text-xs font-medium text-slate-600">
                        Patient: {patientName} &bull; {currentLangObj.flag} {currentLangObj.nativeName}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold mt-1 ${trafficColors.text}`}>
                    {summary.statusHeading}
                  </h3>
                </div>
              </div>

              {/* Read Aloud Audio Button with active language */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleToggleSpeech}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
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
                      <span>🔊 Listen in {currentLangObj.nativeName}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Plain English Translation */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>In Plain Words: What Your Test Results Mean</span>
                </div>
                <span className="text-[10px] text-blue-700 font-medium">
                  Translated into {currentLangObj.name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {summary.plainEnglishExplanation}
              </p>
            </div>

            {/* Key Takeaways & Action Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Key Takeaways */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
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
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
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
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200/60 hover:border-amber-400 cursor-pointer transition-all group text-xs text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        Q{idx + 1}
                      </span>
                      <span className="group-hover:text-amber-900 font-medium">"{q}"</span>
                    </div>
                    <button className="p-1 text-slate-400 group-hover:text-amber-700 cursor-pointer">
                      {copiedQuestion === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Medical Jargon Buster */}
            {summary.jargonGlossary && summary.jargonGlossary.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
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
                  <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-slate-700 shadow-xs animate-in fade-in">
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
            <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 flex items-center justify-between">
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

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {clinicalText}
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                This technical document contains standardized radiological, anatomical, and pathological nomenclature compliant with ACR/WHO clinical guidelines.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Patient Friendly Print & PDF Summary Modal */}
      {isPrintModalOpen && (
        <PatientFriendlyPrintSummary
          summary={summary}
          patientName={patientName}
          patientId={patientId}
          reportTitle={reportTitle}
          reportDate={reportDate}
          department={department}
          physicianName={physicianName}
          languageName={`${currentLangObj.name} (${currentLangObj.nativeName})`}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </>
  );
};
