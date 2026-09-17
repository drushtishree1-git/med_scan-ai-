import React from 'react';
import { Database, Table as TableIcon, RefreshCw, Terminal, Download, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SQLManager } from './SQLManager';

export const DatabaseStudio: React.FC = () => {
  const { sqlStatus, refreshSqlStatus } = useAuth();

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl shadow-lg">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  MediScan SQL Database Studio
                  <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    SQLite Relational Engine
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Native relational file engine (`data/sqlite_store.db`) with schema introspection, raw SQL console, and tabular CRUD grid.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshSqlStatus()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-2 shadow"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              Refresh Status
            </button>
          </div>
        </div>
      </div>

      {/* SQL Manager Content */}
      <SQLManager />
    </div>
  );
};
