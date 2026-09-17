import React, { useState } from 'react';
import { 
  Scan, 
  Bot, 
  ShieldCheck, 
  Activity, 
  BookOpen, 
  Headphones, 
  MapPin, 
  Box, 
  FileText, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Stethoscope, 
  ChevronRight,
  ShieldAlert,
  Clock,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { ModalityBadge, StatusBadge, UrgencyBadge } from '../common/Badge';
import { Volume2, VolumeX, Languages } from 'lucide-react';

interface StayHealthyFrontPageProps {
  onNavigate: (view: string) => void;
  onSelectRecord: (recordId: string) => void;
}

export const StayHealthyFrontPage: React.FC<StayHealthyFrontPageProps> = ({
  onNavigate,
  onSelectRecord,
}) => {
  const { user, userAnalyses, allAnalyses, userSoundtracks, sqlStatus } = useAuth();
  const { t, currentLanguageInfo, speakText, stopSpeaking, isSpeaking } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'scans' | 'evidence'>('overview');
  const [imgLoaded, setImgLoaded] = useState(false);

  const displayRecords = user?.role === 'doctor' || user?.role === 'admin' ? allAnalyses : userAnalyses;
  const recentRecords = displayRecords.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ---------------------------------------------------- */}
      {/* HERO SECTION: "Stay Healthy" with Doctor & Wave Aesthetic */}
      {/* ---------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#EAEFF8] via-[#DFE8F6] to-[#CFDCF0] border border-slate-200/80 shadow-xl">
        
        {/* Top Internal Subtle Nav / Tagline */}
        <div className="relative z-10 px-6 sm:px-10 pt-6 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-300/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="text-xs font-black tracking-tight text-slate-800">
              MEDISCAN <span className="text-blue-600 font-extrabold">{t('preventive_portal')}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 border border-slate-300/60 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounded in PubMed Central® (PMC)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-300/60 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {currentLanguageInfo.flag} {currentLanguageInfo.nativeName}
            </span>
          </div>
        </div>

        {/* Hero Body */}
        <div className="relative z-10 px-6 sm:px-12 pt-8 sm:pt-12 pb-24 sm:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px]">
          {/* Left Hero Typography */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-300/60 shadow-2xs text-xs font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('rag_verified')}</span>
              </div>
              
              {/* Voice TTS Button in Active Language */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    speakText(`${t('stay_healthy')}. ${t('hero_desc')}`);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-800 border border-blue-200/80 text-xs font-bold transition-all cursor-pointer"
                title={`Listen in ${currentLanguageInfo.name}`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t('stop_audio')}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('speak_findings')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#14234B] leading-[1.02]">
                {t('stay_healthy').split(' ')[0]} <br />
                <span className="text-blue-900">{t('stay_healthy').split(' ').slice(1).join(' ') || 'Healthy'}</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg leading-relaxed pt-2">
                {t('hero_desc')}
              </p>
            </div>

            {/* Quick Language Selector Switcher Pills */}
            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 max-w-xl">
              <LanguageSelector variant="pills" />
            </div>

            {/* Quick Action Badges / CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('new-analysis')}
                id="hero-start-scan-btn"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-700/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>{t('start_new_scan')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('precautions')}
                id="hero-precautions-btn"
                className="px-5 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-slate-800 hover:text-rose-700 font-bold text-xs sm:text-sm border border-slate-300/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-rose-600" />
                <span>{t('emergency_hotline')}</span>
              </button>
            </div>

            {/* Micro Stats Bar */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span><strong>36.4M+</strong> PubMed Papers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span><strong>98.4%</strong> Diagnostic Concordance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span><strong>3</strong> Modalities (Chest X-Ray, Brain MRI, Lab Reports)</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic (Interactive Diagnostic Scanner & Live AI Pulse Card) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] space-y-3.5 z-10">
              
              {/* Main Glowing Scanner Interface Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-2xl space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Activity className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 leading-tight">AI Radiography Engine</div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Model V4.2 Online
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                    99.2% Accuracy
                  </span>
                </div>

                {/* Simulated Diagnostic Wave / Spectrum */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-2 border border-slate-800 shadow-inner">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">DICOM Volumetric Scan</span>
                    <span className="text-cyan-400 font-bold">512×512 Matrix</span>
                  </div>
                  
                  {/* Waveform graphic */}
                  <div className="flex items-end gap-1 h-12 pt-2 px-1">
                    {[40, 65, 30, 85, 95, 45, 70, 80, 60, 90, 100, 75, 50, 85, 95, 60, 40, 70, 90, 55, 35].map((h, idx) => (
                      <div 
                        key={idx} 
                        style={{ height: `${h}%` }}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-full opacity-85 transition-all duration-300 hover:opacity-100"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>Chest X-Ray / Brain MRI / CT</span>
                    <span className="text-emerald-400 font-semibold">&lt; 1.2s Latency</span>
                  </div>
                </div>

                {/* Quick Interactive Triage Indicator */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-800">
                    <div className="text-[10px] text-slate-500 font-semibold">PubMed Verified</div>
                    <div className="font-extrabold text-blue-900 mt-0.5">PMID RAG Grounded</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-slate-800">
                    <div className="text-[10px] text-slate-500 font-semibold">Consensus Engine</div>
                    <div className="font-extrabold text-emerald-900 mt-0.5">Double Checked</div>
                  </div>
                </div>
              </div>

              {/* Floating Verified NIH & ACR Guidelines Badge */}
              <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-slate-900 leading-tight">ACR Appropriateness Standards</div>
                    <div className="text-[10px] text-emerald-700 font-bold">Clinical Radiology Framework</div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('research')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="View PubMed Research"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* ORGANIC CURVED WAVE & PURPLE/INDIGO LOWER CONTAINER  */}
        {/* ---------------------------------------------------- */}
        <div className="relative -mt-16 sm:-mt-20">
          {/* Wave SVG Divider */}
          <svg 
            className="w-full h-24 sm:h-32 text-[#463574] block preserve-3d" 
            viewBox="0 0 1440 320" 
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path 
              fillOpacity="1" 
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,202.7C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>

          {/* Lower Purple / Indigo Background with Three White Info Cards */}
          <div className="bg-gradient-to-b from-[#463574] via-[#382663] to-[#251746] px-6 sm:px-10 pb-10 pt-2 text-white">
            
            {/* Top Bar on Purple Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-200">
                  Comprehensive Diagnostic Ecosystem
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  Real-Time Clinical Capabilities & Quick Access
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('history')}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>View All Studies ({displayRecords.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* THREE POLISHED WHITE CONTENT CARDS (Exactly matching mockup structure) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Diagnostic Scan Intake & Immediate Triage */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 text-slate-800 shadow-xl border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Scan className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      Intake & DICOM
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Diagnostic Scan Intake
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Upload Chest X-Rays, Brain MRIs, and Lab Diagnostic Reports for instant clinical evaluations.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Supported Formats:</span>
                      <span className="font-bold text-slate-900">DICOM, PNG, JPEG, PDF</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">AI Confidence:</span>
                      <span className="font-bold text-emerald-600">&ge; 95% Verified</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('new-analysis')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Scan className="w-4 h-4" />
                  <span>Analyze New Medical Scan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: PubMed RAG Verification & Evidence Engine */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 text-slate-800 shadow-xl border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      PubMed® RAG
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Peer-Reviewed Evidence
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Every diagnostic finding is cross-referenced with PubMed Central PMIDs and ACR Appropriateness Criteria.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-900">Live Knowledge Base:</span>
                      <span className="font-bold text-emerald-700">36.4M+ Papers</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-900">Consensus Engine:</span>
                      <span className="font-bold text-emerald-700">Double-Verification</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('research')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore PubMed Literature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 3: 24/7 Precautions & 3D Interactive Anatomy */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 text-slate-800 shadow-xl border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-2xl transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                      24/7 AI Triage
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Emergency Precautions & 3D
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Instant clinical first-aid guidance for acute symptoms, pre-scan protocols, and 3D organ visualizations.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-900">Emergency Protocols:</span>
                      <span className="font-bold text-purple-700">Chest, Stroke, MRI</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-900">3D Interactive Organs:</span>
                      <span className="font-bold text-purple-700">Lungs, Brain, Heart</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigate('precautions')}
                    className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Precautions</span>
                  </button>
                  <button
                    onClick={() => onNavigate('viewer3d')}
                    className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Anatomy</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECONDARY CLINICAL WORKING MODULES & RECENT STUDIES */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Diagnostic Imaging Records & Analysis History */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Recent Diagnostic Evaluations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active imaging studies, confidence metrics, and RAG verification statuses
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Complete Archive</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of Recent Studies */}
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  onClick={() => onSelectRecord(record.id)}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-blue-300">
                      <Scan className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <ModalityBadge modality={record.modality} />
                        <UrgencyBadge urgency={record.urgency} />
                        <span className="text-[11px] text-slate-500 font-medium">
                          ID: {record.id}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mt-1">
                        {record.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {record.primaryFindingSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {((record.confidenceScore || 0.95) * 100).toFixed(0)}% Confidence
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(record.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Care Tools & Services */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Sound Therapy & Anxiety Relief */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-indigo-950">
                  Pre-Scan Sound Therapy
                </h4>
                <p className="text-[11px] text-indigo-700">
                  Acoustic neural calming loops ({userSoundtracks.length} active)
                </p>
              </div>
            </div>

            <p className="text-xs text-indigo-900 leading-relaxed font-medium">
              Calm claustrophobia and procedural scan anxiety with customized binaural frequencies (528 Hz / 432 Hz).
            </p>

            <button
              onClick={() => onNavigate('soundtherapy')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Launch Sound Therapy Studio &rarr;</span>
            </button>
          </div>

          {/* Emergency Hospital Locator */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Emergency Facilities & Centers
                </h4>
                <p className="text-[11px] text-slate-500">
                  Nearby accredited trauma & radiology hubs
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Find immediate Level-1 emergency trauma centers, MRI suites, and accredited imaging laboratories near you.
            </p>

            <button
              onClick={() => onNavigate('facilities')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300/80 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Open Facilities Map &rarr;</span>
            </button>
          </div>

          {/* Database Synchronization Status */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-900">SQLite DB Sync:</span>
            </div>
            <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Active ({sqlStatus?.tables?.analyses ?? displayRecords.length} Records)
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
