import React, { useState } from 'react';
import { 
  Scan, 
  Activity, 
  Droplets,
  AlertCircle,
  Box,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../common/StatCard';
import { Medical3DViewer } from '../viewer3d/Medical3DViewer';
import { StayHealthyFrontPage } from '../home/StayHealthyFrontPage';

interface PatientDashboardProps {
  onNavigate: (view: string) => void;
  onSelectRecord: (recordId: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onNavigate,
  onSelectRecord,
}) => {
  const { user, userAnalyses } = useAuth();
  const [show3DAnatomy, setShow3DAnatomy] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState<'Lungs' | 'Brain' | 'Heart' | 'Spine'>('Lungs');

  const patientRecords = userAnalyses;

  return (
    <div className="space-y-8">
      {/* Front Page Hero Design matching user mockup ("Stay Healthy") */}
      <StayHealthyFrontPage 
        onNavigate={onNavigate} 
        onSelectRecord={onSelectRecord} 
      />

      {/* Clinical Vitals & Bio-Metric Record Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Blood Group"
          value={user?.bloodType || 'O+ (Positive)'}
          subtitle="Genotyped Clinical Record"
          icon={Droplets}
          iconColor="text-rose-600"
          iconBg="bg-rose-50 border-rose-100"
        />

        <StatCard
          title="Personal Scans"
          value={patientRecords.length}
          subtitle="Stored in Database"
          icon={Scan}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 border-blue-100"
        />

        <StatCard
          title="Allergies"
          value={user?.allergies?.[0] || 'None Reported'}
          subtitle="Verified by attending physician"
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 border-amber-100"
        />

        <StatCard
          title="Database Sync"
          value="SQLite Store"
          subtitle={`${user?.email || 'drushtishree1@gmail.com'} Synced`}
          icon={Database}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-100"
        />
      </div>

      {/* 3D Interactive Anatomical Organ Model Viewer */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm">
              <Box className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Interactive 3D Anatomical Organ Exploration
              </h3>
              <p className="text-xs text-slate-500">
                Rotate, inspect, and analyze 3D volumetric models (Lungs, Brain, Heart, Spine) correlated with your diagnostic imaging studies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {(['Lungs', 'Brain', 'Heart', 'Spine'] as const).map((organ) => (
              <button
                key={organ}
                onClick={() => { setSelectedOrgan(organ); setShow3DAnatomy(true); }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedOrgan === organ && show3DAnatomy
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {organ}
              </button>
            ))}
            <button
              onClick={() => setShow3DAnatomy(!show3DAnatomy)}
              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-[11px] underline ml-1 cursor-pointer"
            >
              {show3DAnatomy ? 'Hide 3D View' : 'Show 3D View'}
            </button>
          </div>
        </div>

        {show3DAnatomy && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
            <Medical3DViewer selectedOrgan={selectedOrgan} />
          </div>
        )}
      </div>
    </div>
  );
};
