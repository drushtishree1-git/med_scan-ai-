import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  Stethoscope, 
  UserCheck, 
  CheckCircle2, 
  Mail, 
  Building2, 
  UserPlus
} from 'lucide-react';
import { RoleBadge } from '../common/Badge';
import { UserRole } from '../../types';

interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Pending Verification';
  joinedDate: string;
}

const INITIAL_DIRECTORY_USERS: DirectoryUser[] = [
  {
    id: 'DOC-84920',
    name: 'Dr. Sarah Jenkins, MD',
    email: 's.jenkins@mediscan.health',
    role: 'doctor',
    department: 'Radiology & AI Diagnostics',
    status: 'Active',
    joinedDate: 'Jan 15, 2024',
  },
  {
    id: 'DOC-77192',
    name: 'Dr. Kenneth Cole, MD',
    email: 'k.cole@mediscan.health',
    role: 'doctor',
    department: 'Internal Medicine & Pathology',
    status: 'Active',
    joinedDate: 'Feb 01, 2024',
  },
  {
    id: 'DOC-33104',
    name: 'Dr. Helena Rostova, MD',
    email: 'h.rostova@mediscan.health',
    role: 'doctor',
    department: 'Dermatopathology',
    status: 'Active',
    joinedDate: 'Mar 10, 2024',
  },
  {
    id: 'PAT-10392',
    name: 'Eleanor Vance',
    email: 'e.vance@example.com',
    role: 'patient',
    department: 'Outpatient Care (MRN-7840129)',
    status: 'Active',
    joinedDate: 'Feb 10, 2024',
  },
  {
    id: 'PAT-55102',
    name: 'David Chen',
    email: 'd.chen@example.com',
    role: 'patient',
    department: 'Outpatient Dermatology (MRN-4309182)',
    status: 'Active',
    joinedDate: 'Feb 21, 2024',
  },
  {
    id: 'ADM-00142',
    name: 'Marcus Sterling',
    email: 'admin@mediscan.health',
    role: 'admin',
    department: 'Clinical Operations & IT Infrastructure',
    status: 'Active',
    joinedDate: 'Nov 01, 2023',
  },
];

export const AdminUserDirectoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  const filteredUsers = INITIAL_DIRECTORY_USERS.filter((u) => {
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Hospital Personnel & Patient Directory
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md">
              {filteredUsers.length} Users
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Role-based authorization directory, access privilege management, and credential status.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'doctor', 'patient', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedRoleFilter === role
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">User / Medical ID</th>
                <th className="py-3 px-4">Role Access</th>
                <th className="py-3 px-4">Department / Clinic</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{u.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                      <span>{u.id}</span>
                      <span>&bull;</span>
                      <span>{u.email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <RoleBadge role={u.role} />
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {u.department}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
                      <CheckCircle2 className="w-3 h-3" />
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {u.joinedDate}
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
