import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  History, 
  FileText, 
  UserCircle, 
  Users, 
  ShieldCheck, 
  X,
  Stethoscope,
  HeartPulse,
  Server,
  MapPin,
  Globe,
  Headphones,
  Box,
  Sparkles,
  Bot,
  Database,
  ShieldAlert,
  Languages
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpen,
  onClose,
}) => {
  const { user, userAnalyses, sqlStatus } = useAuth();
  const { t, currentLanguageInfo } = useLanguage();

  const navigationItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      roles: ['doctor', 'patient', 'admin'],
    },
    {
      id: 'precautions',
      label: t('emergency_precautions'),
      icon: Bot,
      roles: ['doctor', 'patient', 'admin'],
      badge: '24/7 AI',
      isEmergency: true,
    },
    {
      id: 'database',
      label: 'Database Studio',
      icon: Database,
      roles: ['doctor', 'patient', 'admin'],
      badge: 'SQLite SQL',
    },
    {
      id: 'new-analysis',
      label: t('scan_intake'),
      icon: Scan,
      roles: ['doctor', 'patient'],
      highlight: true,
    },
    {
      id: 'history',
      label: t('analysis_archive'),
      icon: History,
      roles: ['doctor', 'patient', 'admin'],
      badge: userAnalyses.length.toString(),
    },
    {
      id: 'viewer3d',
      label: t('anatomy_viewer'),
      icon: Box,
      roles: ['doctor', 'patient', 'admin'],
    },
    {
      id: 'facilities',
      label: t('hospitals_near_me'),
      icon: MapPin,
      roles: ['doctor', 'patient', 'admin'],
    },
    {
      id: 'research',
      label: t('clinical_research'),
      icon: Globe,
      roles: ['doctor', 'admin'],
    },
    {
      id: 'soundtherapy',
      label: t('sound_therapy'),
      icon: Headphones,
      roles: ['doctor', 'patient', 'admin'],
    },
    {
      id: 'reports',
      label: t('reports'),
      icon: FileText,
      roles: ['doctor', 'patient', 'admin'],
    },
    {
      id: 'admin-users',
      label: t('user_management'),
      icon: Users,
      roles: ['admin'],
    },
    {
      id: 'profile',
      label: t('medical_profile'),
      icon: UserCircle,
      roles: ['doctor', 'patient', 'admin'],
    },
  ];

  const visibleItems = navigationItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-[72px] items-center justify-between px-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shrink-0">
              <span className="text-sm font-bold">M</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-slate-800 tracking-tight">MediScan AI</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Summary in Sidebar */}
        <div className="p-3 mx-4 my-3 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200/70 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
              {user?.role === 'doctor' ? (
                <Stethoscope className="w-4 h-4" />
              ) : user?.role === 'patient' ? (
                <HeartPulse className="w-4 h-4 text-emerald-600" />
              ) : (
                <Server className="w-4 h-4 text-purple-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-medium text-slate-500 capitalize">
                  {user?.role} Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>

          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => {
                  setCurrentView(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.highlight && !isActive && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                )}

                {item.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Language Switcher in Sidebar */}
        <div className="px-4 py-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Languages className="w-3 h-3 text-blue-600" />
              <span>{t('language_switcher')}</span>
            </span>
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
              {currentLanguageInfo.flag} {currentLanguageInfo.nativeName}
            </span>
          </div>
          <LanguageSelector variant="compact" className="w-full" />
        </div>

        {/* Compliance Footer */}
        <div className="p-3 m-4 rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-800">{t('rag_verified')}</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
            Realtime session tracking &bull; PubMed Central &bull; Double-Verified Rx & Precautions.
          </p>
        </div>
      </aside>
    </>
  );
};
