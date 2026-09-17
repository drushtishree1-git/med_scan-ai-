import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  User as UserIcon, 
  LogOut, 
  Sparkles, 
  Shield, 
  Stethoscope, 
  UserCheck, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, ClinicalNotification } from '../../types';
import { RAGStatusIndicator } from './RAGStatusIndicator';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onToggleSidebar,
}) => {
  const { user, logout, switchRole } = useAuth();
  const { t } = useLanguage();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<ClinicalNotification[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: user?.role === 'doctor' ? t('dashboard') + ' • ' + 'Clinical Workstation' : user?.role === 'admin' ? t('dashboard') + ' • ' + 'Administrative Operations' : t('stay_healthy') + ' • ' + t('dashboard'),
      subtitle: user?.role === 'doctor' ? 'Diagnostic triage, active queues & image evaluations' : user?.role === 'admin' ? 'System telemetry, inference metrics & governance' : t('hero_desc'),
    },
    'new-analysis': {
      title: t('scan_intake'),
      subtitle: 'Upload medical imaging (Chest X-Ray, Brain MRI) or laboratory documentation for AI screening',
    },
    history: {
      title: t('analysis_archive'),
      subtitle: 'Comprehensive repository of previous imaging studies, findings, and status logs',
    },
    reports: {
      title: t('reports'),
      subtitle: 'Standardized clinical reports, discharge notes, and structured OCR extractions',
    },
    profile: {
      title: t('medical_profile'),
      subtitle: 'Manage clinical license information, security preferences, and patient record data',
    },
    'admin-users': {
      title: t('user_management'),
      subtitle: 'Directory of registered physicians, hospital staff, and authenticated patients',
    },
    precautions: {
      title: t('emergency_precautions'),
      subtitle: 'Instant clinical triage and emergency first-aid protocols',
    },
    facilities: {
      title: t('hospitals_near_me'),
      subtitle: 'Ramanagara 562159 verified hospitals, free care & trauma centers',
    },
  };

  const currentInfo = viewTitles[currentView] || {
    title: 'MediScan AI',
    subtitle: 'Clinical Diagnostic Intelligence Platform',
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8 gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          id="mobile-sidebar-toggle-btn"
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {currentInfo.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Secure HIPAA Ready
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-500 truncate max-w-xs xl:max-w-md mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Middle: Horizontal Quick Nav (matching the clean top menu in the mockup) */}
      <nav className="hidden 2xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            currentView === 'dashboard' ? 'text-blue-700 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setCurrentView('new-analysis')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            currentView === 'new-analysis' ? 'text-blue-700 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          AI Scan Analysis
        </button>
        <button
          onClick={() => setCurrentView('research')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            currentView === 'research' ? 'text-blue-700 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          PubMed RAG
        </button>
        <button
          onClick={() => setCurrentView('history')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            currentView === 'history' ? 'text-blue-700 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Records Archive
        </button>
        <button
          onClick={() => setCurrentView('precautions')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            currentView === 'precautions' ? 'text-rose-700 bg-rose-50 font-bold' : 'hover:text-rose-600 hover:bg-slate-50'
          }`}
        >
          Precautions Bot
        </button>
        <button
          onClick={() => setCurrentView('viewer3d')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            currentView === 'viewer3d' ? 'text-indigo-700 bg-indigo-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          3D Anatomy
        </button>
        <button
          onClick={() => setCurrentView('soundtherapy')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            currentView === 'soundtherapy' ? 'text-indigo-700 bg-indigo-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Sound Therapy
        </button>
        <button
          onClick={() => setCurrentView('facilities')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            currentView === 'facilities' ? 'text-blue-700 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          ER Facilities
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Multi-Language Selector */}
        <LanguageSelector variant="compact" />

        {/* RAG and PubMed Reachability & Data Reliability Indicator */}
        <RAGStatusIndicator />

        {/* Quick Role Switcher for seamless Phase 1 evaluation */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            id="role-switch-dropdown-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Switch user role for testing"
          >
            {user?.role === 'doctor' && <Stethoscope className="w-3.5 h-3.5 text-blue-600" />}
            {user?.role === 'patient' && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
            {user?.role === 'admin' && <Shield className="w-3.5 h-3.5 text-amber-600" />}
            <span className="capitalize font-medium text-slate-700 hidden xs:inline">
              Role: <span className="font-semibold text-blue-600">{user?.role}</span>
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2.5 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Role View
              </div>
              <button
                onClick={() => {
                  switchRole('doctor');
                  setShowRoleDropdown(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                  user?.role === 'doctor'
                    ? 'bg-blue-50 text-blue-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="p-1 rounded bg-blue-100 text-blue-700">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Doctor (Physician)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Triage, queue & reviews</div>
                </div>
              </button>

              <button
                onClick={() => {
                  switchRole('patient');
                  setShowRoleDropdown(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                  user?.role === 'patient'
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="p-1 rounded bg-emerald-100 text-emerald-700">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Patient</div>
                  <div className="text-[10px] text-slate-400 font-normal">Scans, records & health</div>
                </div>
              </button>

              <button
                onClick={() => {
                  switchRole('admin');
                  setShowRoleDropdown(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                  user?.role === 'admin'
                    ? 'bg-amber-50 text-amber-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="p-1 rounded bg-amber-100 text-amber-700">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>System Admin</div>
                  <div className="text-[10px] text-slate-400 font-normal">Uptime, models & users</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleDropdown(false);
              setShowProfileMenu(false);
            }}
            id="notifications-toggle-btn"
            className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Clinical Alerts</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold text-blue-700 bg-blue-100 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark read
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                      !n.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'critical' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {n.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowRoleDropdown(false);
              setShowNotifications(false);
            }}
            id="user-profile-menu-btn"
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-semibold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                {user?.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize font-medium">{user?.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentView('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  <span>Clinical Profile</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('history');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                >
                  <Sparkles className="w-4 h-4 text-slate-500" />
                  <span>My Analyses</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
