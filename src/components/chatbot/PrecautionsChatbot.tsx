import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  Flame, 
  HeartPulse, 
  Brain, 
  Magnet, 
  Syringe, 
  Wind, 
  Bandage, 
  Smile, 
  Clock, 
  RefreshCw, 
  History,
  Info,
  ChevronRight,
  Database,
  Volume2,
  VolumeX,
  Languages,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { EmergencyTriageResponse, PrecautionChatRecord } from '../../types';

interface PrecautionsChatbotProps {
  initialCategory?: string;
  isFloatingModal?: boolean;
  onClose?: () => void;
}

const QUICK_PRECAUTIONS_TOPICS = [
  {
    id: 'chest_pain',
    title: 'Severe Chest Pain / Angina',
    icon: HeartPulse,
    color: 'rose',
    prompt: 'What immediate precautions should I take for sudden crushing chest pain and left arm tightness?',
  },
  {
    id: 'stroke_fast',
    title: 'Suspected Stroke (FAST Protocol)',
    icon: Brain,
    color: 'amber',
    prompt: 'How to test and what immediate precautions for facial drooping and slurred speech?',
  },
  {
    id: 'mri_metal',
    title: 'MRI Metal & Implant Safety',
    icon: Magnet,
    color: 'blue',
    prompt: 'What are the critical pre-scan safety precautions and metal implant rules for MRI screening?',
  },
  {
    id: 'contrast_allergy',
    title: 'Contrast Dye Reaction',
    icon: Syringe,
    color: 'purple',
    prompt: 'What immediate precautions should be taken if hives or itching occur after IV contrast dye injection?',
  },
  {
    id: 'dyspnea',
    title: 'Acute Shortness of Breath',
    icon: Wind,
    color: 'cyan',
    prompt: 'What immediate first-aid positioning and precautions for severe wheezing and difficulty breathing?',
  },
  {
    id: 'trauma_bleeding',
    title: 'Severe Bleeding & Trauma',
    icon: Bandage,
    color: 'rose',
    prompt: 'What are the immediate clinical precautions and pressure protocols for heavy hemorrhage and trauma?',
  },
];

export const PrecautionsChatbot: React.FC<PrecautionsChatbotProps> = ({
  initialCategory,
  isFloatingModal = false,
  onClose,
}) => {
  const { user, chatHistory, addChatRecord, refreshSqlStatus } = useAuth();
  const { language, currentLanguageInfo, t, speakText, stopSpeaking, isSpeaking, translateClinicalText } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'General Emergency Precautions');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<EmergencyTriageResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [pastRecords, setPastRecords] = useState<PrecautionChatRecord[]>([]);
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Handle dynamic translation of current response
  const handleTranslateResponse = async () => {
    if (!currentResponse) return;
    setIsTranslating(true);
    try {
      const fullTextToTranslate = `${currentResponse.summary}. Immediate steps: ${currentResponse.immediateSteps.join('. ')}`;
      const result = await translateClinicalText(fullTextToTranslate, language);
      setTranslatedSummary(result);
    } catch (e) {
      console.warn('Translate response failed:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Load chat history from database
  const loadChatHistory = async () => {
    try {
      const res = await fetch('/api/db/collections/chat_history');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setPastRecords(data.data);
        }
      }
    } catch (e) {
      console.warn('Chat history load error:', e);
      setPastRecords(chatHistory);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  const handleAskPrecaution = async (questionText: string, category = activeCategory) => {
    if (!questionText.trim()) return;
    setIsLoading(true);
    setCurrentResponse(null);

    try {
      const res = await fetch('/api/ai/precautions-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText.trim(),
          category,
          userEmail: user?.email || 'drushtishree1@gmail.com',
          userRole: user?.role || 'patient',
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setCurrentResponse(data.result);
        if (data.savedRecord) {
          addChatRecord(data.savedRecord);
          setPastRecords((prev) => [data.savedRecord, ...prev]);
        }
        await refreshSqlStatus();
      }
    } catch (e: any) {
      console.error('Error asking precautions chatbot:', e);
      setCurrentResponse({
        triageLevel: 'urgent',
        category,
        summary: 'Stay calm and notify medical staff immediately.',
        immediateSteps: [
          'Position patient safely in high Fowler\'s or resting position',
          'Check airway, breathing, and pulse',
          'Call emergency room dispatch without delay',
        ],
        avoidActions: ['Do not give oral fluids if patient is unconscious'],
        fullDetailedAnswer: 'Standard emergency precautions apply. Seek immediate professional clinical evaluation.',
        redFlagWarnings: ['Loss of consciousness', 'Severe acute chest pressure'],
        recommendedEmergencyContacts: ['911', '108', '112'],
      });
    } finally {
      setIsLoading(false);
      setInputQuery('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskPrecaution(inputQuery);
  };

  return (
    <div className={`space-y-6 ${isFloatingModal ? 'p-6' : ''}`}>
      {/* Top 3D Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/70 to-slate-900 border border-rose-500/30 text-white shadow-xl relative overflow-hidden preserve-3d">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-[0_4px_20px_rgba(225,29,72,0.4)] border border-rose-400/40 flex-shrink-0">
              <ShieldAlert className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Immediate Precautions & Emergency AI Chatbot
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  24/7 RAPID TRIAGE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
                Instant life-saving directives, pre/post-scan safety rules, and emergency first-aid protocols grounded in PubMed clinical literature with automatic audit sync in SQLite database.
              </p>
            </div>
          </div>

          {/* Emergency Hotline Dial Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:108"
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 108 / 112 (India)</span>
            </a>
            <a
              href="tel:911"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>Call 911 (US/CA)</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Precautions Triage</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); loadChatHistory(); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Triage History ({pastRecords.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left Column: Quick Triage Topic Cards */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Select Urgent Precaution Category
            </div>
            <div className="space-y-2">
              {QUICK_PRECAUTIONS_TOPICS.map((topic) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(topic.title);
                      handleAskPrecaution(topic.prompt, topic.title);
                    }}
                    className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                          {topic.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Tap for rapid protocol &rarr;
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>

            {/* General Diagnostic Safety Note */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" /> Clinical Guidance Notice
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                This system provides real-time precautionary directives and first-aid recommendations. If life-threatening trauma or arrest occurs, contact emergency medical dispatch immediately.
              </p>
            </div>
          </div>

          {/* Right Column: Chatbot Conversation & Structured Triage Directive */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Input Question Bar */}
            <form onSubmit={handleFormSubmit} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Ask Immediate Precautions / First Aid Guidance</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Auto-saved in Database
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="e.g. Patient having sudden severe chest pain, what immediate precautions should we take?"
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="absolute right-2 top-2 p-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>

            {/* Active AI Precautions Result Display */}
            {isLoading ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
                <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
                <div className="text-sm font-bold text-slate-800">Generating Rapid Clinical Precautions Protocol...</div>
                <div className="text-xs text-slate-400">Consulting emergency triage knowledgebase and recording in database store</div>
              </div>
            ) : currentResponse ? (
              <div className="rounded-3xl bg-white border border-slate-200 shadow-md overflow-hidden preserve-3d animate-in fade-in">
                {/* Triage Level Banner */}
                <div className={`p-4 text-white flex items-center justify-between ${
                  currentResponse.triageLevel === 'critical'
                    ? 'bg-gradient-to-r from-rose-600 to-red-700'
                    : currentResponse.triageLevel === 'urgent'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 animate-bounce" />
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider">
                        Triage Assessment: {currentResponse.triageLevel.toUpperCase()}
                      </div>
                      <div className="text-[11px] opacity-90">{currentResponse.category}</div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-black/30 border border-white/20">
                    STATUS: {currentResponse.triageLevel === 'critical' ? 'ACT IMMEDIATELY' : 'FOLLOW PROTOCOL'}
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  {/* Language Audio Readout & Live Translator Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50/80 border border-blue-200/70 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (isSpeaking) {
                            stopSpeaking();
                          } else {
                            const speechContent = translatedSummary || `${currentResponse.summary}. Steps: ${currentResponse.immediateSteps.join('. ')}`;
                            speakText(speechContent);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                            <span>{t('stop_audio')}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen ({currentLanguageInfo.nativeName})</span>
                          </>
                        )}
                      </button>

                      {language !== 'en' && (
                        <button
                          onClick={handleTranslateResponse}
                          disabled={isTranslating}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isTranslating ? 'Translating...' : `${t('translate_button')} ${currentLanguageInfo.nativeName}`}</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <span>{currentLanguageInfo.flag}</span>
                      <span>Voice: {currentLanguageInfo.speechCode}</span>
                    </span>
                  </div>

                  {/* Dynamic Translated Summary Box (if requested) */}
                  {translatedSummary && (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-900 text-[11px] uppercase tracking-wider">
                        <Globe className="w-3.5 h-3.5 text-amber-600" />
                        <span>Translated to {currentLanguageInfo.name} ({currentLanguageInfo.nativeName})</span>
                      </div>
                      <p className="leading-relaxed font-medium whitespace-pre-line">{translatedSummary}</p>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 leading-relaxed">
                    {currentResponse.summary}
                  </div>

                  {/* Immediate Steps Numbered List */}
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Immediate Action Items (What to Do Right Now)
                    </h4>
                    <div className="space-y-2">
                      {currentResponse.immediateSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3 text-xs text-slate-800"
                        >
                          <span className="flex h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What NOT to do */}
                  {currentResponse.avoidActions && currentResponse.avoidActions.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        Critical Pitfalls to AVOID
                      </h4>
                      <div className="space-y-1.5">
                        {currentResponse.avoidActions.map((avoid, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900"
                          >
                            <span className="text-rose-600 font-bold">&times;</span>
                            <span className="font-medium">{avoid}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Red Flag Warnings */}
                  {currentResponse.redFlagWarnings && currentResponse.redFlagWarnings.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Emergency Red Flag Symptoms (Call Ambulance If Observed):
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-amber-800 font-medium">
                        {currentResponse.redFlagWarnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Full Detailed Explanation */}
                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
                    <div className="font-bold text-slate-800">Detailed Clinical Protocol Notes:</div>
                    <div className="whitespace-pre-line text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {currentResponse.fullDetailedAnswer}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
                <Bot className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Active Triage Query</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Select any of the urgent precaution topics on the left or type your own symptoms / safety question above.
                </p>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* TAB 2: Saved Triage History */
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Precautions Triage History</h3>
              <p className="text-xs text-slate-500">
                All triage inquiries are persisted in the <code className="font-mono text-emerald-700">chat_history</code> collection.
              </p>
            </div>
            <button
              onClick={loadChatHistory}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh History</span>
            </button>
          </div>

          <div className="space-y-3">
            {pastRecords.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
                No past precaution queries recorded in database yet.
              </div>
            ) : (
              pastRecords.map((item, idx) => (
                <div
                  key={item.id || item._id || idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {item.category || 'General Precautions'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900">
                    Q: {item.question}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
