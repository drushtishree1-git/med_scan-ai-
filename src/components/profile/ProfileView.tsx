import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Stethoscope, 
  Lock, 
  Save, 
  CheckCircle2, 
  Bell, 
  KeyRound, 
  Clock, 
  Laptop, 
  Globe, 
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/Badge';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, loginSessions } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 438-9201');
  const [specialization, setSpecialization] = useState(user?.specialization || 'Diagnostic Radiology');
  const [department, setDepartment] = useState(user?.department || 'Radiology & AI Diagnostics');
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || 'MD-84920-CA');
  const [bloodType, setBloodType] = useState(user?.bloodType || 'A+');

  // Filter login sessions specifically for this logged-in account/email
  const userSessions = loginSessions.filter(
    (s) => s.email.toLowerCase() === (user?.email || '').toLowerCase()
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      specialization: user?.role === 'doctor' ? specialization : undefined,
      department: user?.role !== 'patient' ? department : undefined,
      licenseNumber: user?.role === 'doctor' ? licenseNumber : undefined,
      bloodType: user?.role === 'patient' ? bloodType : undefined,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">{user?.name}</h2>
                <RoleBadge role={user?.role || 'patient'} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Identity Verified &bull; Realtime Authenticated Session</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Credentials'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile and clinical records updated successfully in persistent state.</span>
        </div>
      )}

      {/* Main Form / Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: General & Clinical Info */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Clinical Credentials & Contact Information
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 disabled:bg-slate-100/70 disabled:text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Primary Identity)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Direct Phone Contact
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 disabled:bg-slate-100/70 disabled:text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {user?.role === 'doctor' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Medical License #
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 disabled:bg-slate-100/70 disabled:text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clinical Specialization
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 disabled:bg-slate-100/70 disabled:text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 disabled:bg-slate-100/70 disabled:text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {user?.role === 'patient' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Medical Record Number (MRN)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.patientId || 'MRN-7840129'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 disabled:bg-slate-100/70 disabled:text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            {isEditing && (
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Clinical Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right: Security & Compliance Summary */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Security & Access Policy</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span>Account Sync</span>
                <span className="font-semibold text-emerald-600 font-mono text-[11px]">{user?.email}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span>Current Status</span>
                <span className="font-semibold text-blue-600">Active Verified</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span>Access Policy</span>
                <span className="font-semibold text-slate-800">HIPAA Compliant</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Clinical Notifications</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                <span>Urgent scan alert notifications</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                <span>Physician review sign-off updates</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Login Sessions Table for this Account */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Real-Time Login History ({user?.email})
            </h3>
            <p className="text-xs text-slate-500">
              Real-time audit log of authenticated logins for this Gmail account.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            {userSessions.length} Tracked Sessions
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Device / Client</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userSessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.device}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{session.ipAddress}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {session.role}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      session.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {session.status === 'Active' ? 'Active' : 'Closed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
