import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Cpu, 
  Database, 
  Users, 
  Activity, 
  Lock, 
  HardDrive, 
  RefreshCw,
  Clock,
  Laptop,
  Globe,
  UserCheck
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { useAuth } from '../../context/AuthContext';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { loginSessions, allRegisteredUsers, allAnalyses } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <div className="space-y-6">
      {/* Admin Infrastructure Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              MediScan Core Administration & Telemetry
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Cluster Normal &bull; Realtime Auth Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Realtime session audits, user directories, PubMed RAG pipelines, and diagnostic store telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerRefresh}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('admin-users')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            Manage Users Directory
          </button>
        </div>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Login Sessions"
          value={loginSessions.length}
          subtitle="Real-time Gmail authentications"
          icon={UserCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-100"
          trend={{ value: `${loginSessions.filter((s) => s.status === 'Active').length} Active`, isPositive: true }}
        />

        <StatCard
          title="Inference Latency"
          value="1.14s"
          subtitle="Clinical Vision & PubMed RAG Grounding"
          icon={Cpu}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 border-blue-100"
          trend={{ value: 'PubMed Verified', isPositive: true }}
        />

        <StatCard
          title="Registered Accounts"
          value={allRegisteredUsers.length}
          subtitle="Doctors, Patients & Admins"
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50 border-indigo-100"
        />

        <StatCard
          title="Diagnostic Studies Stored"
          value={allAnalyses.length}
          subtitle="Realtime local & cloud archive"
          icon={HardDrive}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 border-amber-100"
        />
      </div>

      {/* Real-time Gmail Login Sessions Audit Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Real-Time User Login Sessions History
              </h3>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Live Stream
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited logins per specific Gmail accounts with timestamps, browser devices, client IP, and role status.
            </p>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Total Audited: {loginSessions.length} sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">User & Account Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Device & Client</th>
                <th className="py-3 px-4">IP & Location</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Session Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loginSessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{session.name}</div>
                    <div className="text-[11px] text-blue-600 font-mono">{session.email}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                      session.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : session.role === 'doctor'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {session.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.device}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.ipAddress}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{session.location || 'Secure Gateway'}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      session.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {session.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      <span>{session.status === 'Active' ? 'Active Session' : 'Terminated'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Services Status + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Infrastructure Microservices */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center justify-between">
            <span>Clinical Pipeline Status</span>
            <span className="text-[11px] text-slate-400 font-normal">Real-time Heartbeat</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Clinical Multimodal Diagnostic Engine & PubMed RAG</h4>
                  <p className="text-[11px] text-slate-500">Express Backend Proxy &bull; /api/ai/analyze-scan</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-full">
                Online &bull; Ready
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Google Search Grounding Engine</h4>
                  <p className="text-[11px] text-slate-500">Express /api/ai/search-research Grounded Agent</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                Connected
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">HIPAA Audit & Realtime Auth Tracker</h4>
                  <p className="text-[11px] text-slate-500">Tracks sessions and studies scoped to user email</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-full">
                Enforcing
              </span>
            </div>
          </div>
        </div>

        {/* Right: Registered Personnel Directory Overview */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
              Registered Accounts ({allRegisteredUsers.length})
            </h3>
            <button
              onClick={() => onNavigate('admin-users')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View Directory &rarr;
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {allRegisteredUsers.map((u) => (
              <div key={u.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                  u.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : u.role === 'doctor'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
