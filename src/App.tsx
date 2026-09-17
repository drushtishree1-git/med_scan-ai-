import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { NewAnalysisView } from './components/analysis/NewAnalysisView';
import { AnalysisHistoryView } from './components/analysis/AnalysisHistoryView';
import { MedicalReportsView } from './components/reports/MedicalReportsView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminUserDirectoryView } from './components/admin/AdminUserDirectoryView';
import { FacilityLocatorView } from './components/maps/FacilityLocatorView';
import { ClinicalResearchView } from './components/research/ClinicalResearchView';
import { MusicGenerationView } from './components/audio/MusicGenerationView';
import { Medical3DViewer } from './components/viewer3d/Medical3DViewer';
import { PrecautionsChatbot } from './components/chatbot/PrecautionsChatbot';
import { DatabaseStudio } from './components/database/DatabaseStudio';
import { Box, Sparkles, ShieldCheck, Bot, X } from 'lucide-react';

const MainApplication: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [showFloatingBot, setShowFloatingBot] = useState<boolean>(false);

  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
    setCurrentView('history');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'precautions':
        return <PrecautionsChatbot />;

      case 'database':
        return <DatabaseStudio />;

      case 'new-analysis':
        return (
          <NewAnalysisView
            onNavigateToHistory={() => setCurrentView('history')}
          />
        );

      case 'history':
        return (
          <AnalysisHistoryView
            onNavigateToNewAnalysis={() => setCurrentView('new-analysis')}
            selectedRecordId={selectedRecordId}
            onClearSelectedRecord={() => setSelectedRecordId(null)}
          />
        );

      case 'viewer3d':
        return (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    Interactive 3D Anatomical Organ & Scan Correlation
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>WebGL 3D Core</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Interact with 3D volumetric models (Lungs, Brain, Heart, Spine) to inspect anatomical landmarks and correlate with diagnostic imaging scans.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>3D Shader Pipeline Active</span>
                </span>
              </div>
            </div>

            <Medical3DViewer selectedOrgan="Lungs" />
          </div>
        );

      case 'facilities':
        return <FacilityLocatorView />;

      case 'research':
        return <ClinicalResearchView />;

      case 'soundtherapy':
        return <MusicGenerationView />;

      case 'reports':
        return (
          <MedicalReportsView
            onNavigateToNewAnalysis={() => setCurrentView('new-analysis')}
          />
        );

      case 'profile':
        return <ProfileView />;

      case 'admin-users':
        if (user.role === 'admin') {
          return <AdminUserDirectoryView />;
        }
        return <DoctorDashboard onNavigate={setCurrentView} onSelectRecord={handleSelectRecord} />;

      case 'dashboard':
      default:
        if (user.role === 'doctor') {
          return (
            <DoctorDashboard
              onNavigate={setCurrentView}
              onSelectRecord={handleSelectRecord}
            />
          );
        } else if (user.role === 'patient') {
          return (
            <PatientDashboard
              onNavigate={setCurrentView}
              onSelectRecord={handleSelectRecord}
            />
          );
        } else {
          return <AdminDashboard onNavigate={setCurrentView} />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans relative">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={(view) => {
          setSelectedRecordId(null);
          setCurrentView(view);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        <Header
          currentView={currentView}
          setCurrentView={(view) => {
            setSelectedRecordId(null);
            setCurrentView(view);
          }}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Floating 3D Emergency Precautions Chatbot Trigger */}
      {currentView !== 'precautions' && (
        <div className="fixed bottom-6 right-6 z-50">
          {!showFloatingBot ? (
            <button
              onClick={() => setShowFloatingBot(true)}
              className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-full font-bold text-xs shadow-2xl border border-rose-300/40 hover:scale-105 transition-all cursor-pointer group"
              title="Immediate Precautions & Emergency AI Chatbot"
            >
              <div className="p-1 rounded-full bg-white/20">
                <Bot className="w-5 h-5 animate-bounce" />
              </div>
              <span className="hidden sm:inline">Emergency Precautions AI</span>
              <span className="sm:hidden font-extrabold">Emergency AI</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            </button>
          ) : (
            <div className="w-[360px] sm:w-[440px] max-h-[580px] bg-white rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
              <div className="p-3.5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-rose-400 animate-pulse" />
                  <span className="text-xs font-black">Immediate Precautions AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowFloatingBot(false);
                      setCurrentView('precautions');
                    }}
                    className="text-[10px] text-slate-300 hover:text-white underline"
                  >
                    Full Screen
                  </button>
                  <button
                    onClick={() => setShowFloatingBot(false)}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px]">
                <PrecautionsChatbot isFloatingModal={true} onClose={() => setShowFloatingBot(false)} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApplication />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
