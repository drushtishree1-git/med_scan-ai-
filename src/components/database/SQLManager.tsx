import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  Search,
  Trash2,
  Edit3,
  Plus,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Server,
  HardDrive,
  Clock,
  ShieldCheck,
  Layers,
  Key,
  Users,
  Activity,
  MessageSquare,
  Download,
  Terminal,
  Play,
  Copy,
  Table as TableIcon,
  HelpCircle,
  FileJson,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SQLTableInfo, SQLQueryResult } from '../../types';

type SQLTableName = 'users' | 'analyses' | 'reports' | 'chat_history' | 'otp_codes' | 'audit_logs' | 'soundtracks' | 'xrays';

const PRESET_SQL_QUERIES = [
  {
    label: 'Chest X-Ray Dataset Breakdown',
    query: 'SELECT split, label, COUNT(*) as scan_count FROM xrays GROUP BY split, label ORDER BY split, label;',
  },
  {
    label: 'Sample Pneumonia X-Ray Test Scans',
    query: "SELECT id, split, label, file_path FROM xrays WHERE split = 'test' AND label = 'PNEUMONIA' LIMIT 10;",
  },
  {
    label: 'All Users by Role',
    query: 'SELECT role, COUNT(*) as total_users FROM users GROUP BY role;',
  },
  {
    label: 'Urgent Radiology Scans',
    query: "SELECT id, title, modality, urgency, confidenceScore, patientName FROM analyses WHERE urgency = 'urgent' OR urgency = 'critical';",
  },
  {
    label: 'Analyses Joined with Doctors',
    query: 'SELECT a.id, a.title, a.modality, u.name as doctor_name, u.specialization FROM analyses a JOIN users u ON a.doctorId = u.id;',
  },
  {
    label: 'Latest Medical Reports',
    query: 'SELECT id, reportNumber, title, patientName, status, department FROM reports ORDER BY date DESC LIMIT 10;',
  },
  {
    label: 'Therapy Tracks Summary',
    query: 'SELECT category, COUNT(*) as count, AVG(baseFrequency) as avg_freq FROM soundtracks GROUP BY category;',
  },
  {
    label: 'Latest Audit Log Activity',
    query: 'SELECT id, userEmail, action, timestamp, device FROM audit_logs ORDER BY timestamp DESC LIMIT 10;',
  },
];

export const SQLManager: React.FC = () => {
  const { sqlStatus, refreshSqlStatus, runSqlQuery, resetSqlToSeed } = useAuth();

  const [tablesMeta, setTablesMeta] = useState<SQLTableInfo[]>([]);
  const [activeTable, setActiveTable] = useState<SQLTableName>('users');
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Console State
  const [sqlInput, setSqlInput] = useState<string>('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<SQLQueryResult | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Edit / Insert Modal State
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isEditingRow, setIsEditingRow] = useState(false);
  const [editJson, setEditJson] = useState('');
  const [isInsertingRow, setIsInsertingRow] = useState(false);
  const [newRowJson, setNewRowJson] = useState('{\n  "title": "New SQL Record",\n  "status": "active"\n}');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load Tables Schema
  const fetchTablesSchema = async () => {
    try {
      const res = await fetch('/api/sql/tables');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTablesMeta(data.tables || []);
        }
      }
    } catch (e: any) {
      console.warn('Failed to fetch SQL tables metadata:', e);
    }
  };

  // Load Table Rows
  const loadTableData = async (tableName: SQLTableName) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/sql/tables/${tableName}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTableRows(data.data || []);
          if (data.data && data.data.length > 0) {
            setSelectedRow(data.data[0]);
            setEditJson(JSON.stringify(data.data[0], null, 2));
          } else {
            setSelectedRow(null);
            setEditJson('');
          }
        }
      }
    } catch (e: any) {
      setMessage({ text: `Failed to query SQL table: ${e.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTablesSchema();
    refreshSqlStatus();
    loadTableData(activeTable);
  }, [activeTable]);

  // Execute SQL Console Query
  const handleExecuteSql = async () => {
    if (!sqlInput.trim()) return;
    setIsExecutingSql(true);
    setMessage(null);
    try {
      const result = await runSqlQuery(sqlInput);
      setQueryResult(result);
      if (result.success) {
        fetchTablesSchema();
        loadTableData(activeTable);
      } else if (result.error) {
        setMessage({ text: `SQL Execution Error: ${result.error}`, type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: `SQL Execution Exception: ${err.message}`, type: 'error' });
    } finally {
      setIsExecutingSql(false);
    }
  };

  // Save Row Edit
  const handleSaveRowEdit = async () => {
    if (!selectedRow) return;
    try {
      const parsed = JSON.parse(editJson);
      const rowId = selectedRow.id || selectedRow._id;
      const res = await fetch(`/api/sql/tables/${activeTable}/${rowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Record ${rowId} updated in SQL table "${activeTable}".`, type: 'success' });
        setIsEditingRow(false);
        await loadTableData(activeTable);
        await fetchTablesSchema();
        await refreshSqlStatus();
      } else {
        setMessage({ text: data.message || 'Failed to update SQL record.', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: `JSON Error: ${err.message}`, type: 'error' });
    }
  };

  // Insert Row
  const handleInsertRow = async () => {
    try {
      const parsed = JSON.parse(newRowJson);
      const res = await fetch(`/api/sql/tables/${activeTable}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `New row inserted into SQL table "${activeTable}".`, type: 'success' });
        setIsInsertingRow(false);
        await loadTableData(activeTable);
        await fetchTablesSchema();
        await refreshSqlStatus();
      } else {
        setMessage({ text: data.message || 'Failed to insert row.', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: `JSON Syntax Error: ${err.message}`, type: 'error' });
    }
  };

  // Delete Row
  const handleDeleteRow = async (id: string) => {
    if (!confirm(`Permanently delete row "${id}" from SQL table "${activeTable}"?`)) return;
    try {
      const res = await fetch(`/api/sql/tables/${activeTable}/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Row ${id} deleted from SQL table.`, type: 'success' });
        await loadTableData(activeTable);
        await fetchTablesSchema();
        await refreshSqlStatus();
      }
    } catch (e: any) {
      setMessage({ text: `Delete failed: ${e.message}`, type: 'error' });
    }
  };

  // Export Table as DDL/DML .sql file
  const handleExportSqlScript = () => {
    const tableInfo = tablesMeta.find((t) => t.name === activeTable);
    if (!tableInfo) return;

    let ddl = `-- SQLite DDL & DML Dump for Table: ${activeTable}\n`;
    ddl += `-- Generated at: ${new Date().toISOString()}\n\n`;

    const cols = tableInfo.columns.map((c) => `  "${c.name}" ${c.type}`).join(',\n');
    ddl += `CREATE TABLE IF NOT EXISTS "${activeTable}" (\n${cols}\n);\n\n`;

    tableRows.forEach((row) => {
      const keys = Object.keys(row);
      const vals = keys.map((k) => {
        const v = row[k];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number') return v;
        return `'${String(typeof v === 'object' ? JSON.stringify(v) : v).replace(/'/g, "''")}'`;
      });
      ddl += `INSERT INTO "${activeTable}" (${keys.map((k) => `"${k}"`).join(', ')}) VALUES (${vals.join(', ')});\n`;
    });

    const blob = new Blob([ddl], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTable}_dump.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRows = tableRows.filter((r) => JSON.stringify(r).toLowerCase().includes(searchQuery.toLowerCase()));

  const activeTableMeta = tablesMeta.find((t) => t.name === activeTable);

  const tablesList: { name: SQLTableName; label: string; icon: React.FC<any> }[] = [
    { name: 'users', label: 'users (Auth)', icon: Users },
    { name: 'analyses', label: 'analyses (Scans)', icon: Activity },
    { name: 'reports', label: 'reports (Clinical)', icon: FileJson },
    { name: 'chat_history', label: 'chat_history (Triage)', icon: MessageSquare },
    { name: 'otp_codes', label: 'otp_codes (Gmail Tokens)', icon: Key },
    { name: 'audit_logs', label: 'audit_logs (Security)', icon: ShieldCheck },
    { name: 'soundtracks', label: 'soundtracks (Therapy)', icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Status Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  SQLite Relational Database Engine
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Active SQL
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Native relational file engine (`data/sqlite_store.db`) with dynamic schema introspection & SQL console.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportSqlScript()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export .SQL
            </button>
            <button
              onClick={async () => {
                if (confirm('Reset SQLite Relational Database to initial seed records?')) {
                  await resetSqlToSeed();
                  await loadTableData(activeTable);
                }
              }}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium rounded-xl border border-rose-500/30 transition flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              Reset SQL Seed
            </button>
          </div>
        </div>

        {/* Database Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 relative z-10">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" /> Driver Engine
            </div>
            <div className="text-sm font-semibold text-white mt-1 truncate">
              {sqlStatus?.driver || 'sqlite3 (C-NAPI)'}
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-indigo-400" /> Relational Tables
            </div>
            <div className="text-sm font-semibold text-indigo-300 mt-1">{sqlStatus?.totalTables || 7} Tables</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Total SQL Rows
            </div>
            <div className="text-sm font-semibold text-emerald-400 mt-1">{sqlStatus?.totalRows || 0} Records</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-amber-400" /> DB File Size
            </div>
            <div className="text-sm font-semibold text-amber-300 mt-1">{sqlStatus?.storageFormatted || '32 KB'}</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Last Synced
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1">
              {sqlStatus?.lastSyncedAt ? new Date(sqlStatus.lastSyncedAt).toLocaleTimeString() : 'Active'}
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SQLite Sync
            </div>
            <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Synchronized
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs hover:underline opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* SQL Query Console Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">Interactive SQL Query Console</h3>
            <span className="px-2 py-0.5 text-xs bg-slate-800 text-cyan-300 border border-slate-700 rounded-md font-mono">
              SQLite 3 Dialect
            </span>
          </div>
          <button
            onClick={handleExecuteSql}
            disabled={isExecutingSql}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            {isExecutingSql ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Execute SQL Query
          </button>
        </div>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-slate-400 py-1 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-amber-400" /> Sample Queries:
          </span>
          {PRESET_SQL_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setSqlInput(preset.query)}
              className="px-2.5 py-1 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 rounded-lg transition font-mono"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* SQL Code Textarea */}
        <div className="relative mb-4">
          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            rows={3}
            placeholder="Type raw SQL query here (e.g. SELECT * FROM users WHERE role = 'doctor';)"
            className="w-full bg-slate-950 text-cyan-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 transition shadow-inner leading-relaxed"
          />
        </div>

        {/* SQL Console Result Output */}
        {queryResult && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-semibold">{queryResult.commandType} Command</span>
                <span>{queryResult.rowCount} rows returned</span>
                <span>Execution Time: {queryResult.executionTimeMs} ms</span>
              </div>
              {queryResult.error && <span className="text-rose-400 font-semibold">Error Encurred</span>}
            </div>

            {queryResult.error ? (
              <div className="p-4 bg-rose-950/40 text-rose-300 font-mono text-xs border-l-4 border-rose-500">
                {queryResult.error}
              </div>
            ) : queryResult.rows.length === 0 ? (
              <div className="p-4 text-slate-500 font-mono text-center">Query executed successfully. 0 rows returned.</div>
            ) : (
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-left font-mono border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                      {queryResult.columns.map((col, i) => (
                        <th key={i} className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 border-r border-slate-800/60">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {queryResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-900/50 transition">
                        {queryResult.columns.map((col, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 text-xs truncate max-w-xs border-r border-slate-800/40 text-slate-300">
                            {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Relational Table Navigation & Schema Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Table Selector & Columns Schema */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
              <span>SQL Relational Tables</span>
              <span className="text-cyan-400 font-normal">7 Tables</span>
            </h3>

            <div className="space-y-1.5">
              {tablesList.map((tbl) => {
                const Icon = tbl.icon;
                const meta = tablesMeta.find((t) => t.name === tbl.name);
                const count = meta?.rowCount ?? sqlStatus?.tables?.[tbl.name] ?? 0;
                const isActive = activeTable === tbl.name;

                return (
                  <button
                    key={tbl.name}
                    onClick={() => setActiveTable(tbl.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-md'
                        : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                      <span>{tbl.name}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-2xs font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column Schema Definition Box */}
          {activeTableMeta && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
                <span>Schema Column Defs</span>
                <span className="text-cyan-400 font-mono text-2xs">PK: {activeTableMeta.primaryKey}</span>
              </h4>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {activeTableMeta.columns.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800/60 text-2xs font-mono"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {col.pk && <span className="px-1 py-0.5 bg-amber-500/20 text-amber-400 font-bold text-3xs rounded">PK</span>}
                      <span className="text-slate-200 font-semibold">{col.name}</span>
                    </div>
                    <span className="text-cyan-400 font-bold uppercase">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Data Grid & Row Editor */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Table: `{activeTable}`</span>
                  <span className="text-xs font-normal text-slate-400">({filteredRows.length} rows loaded)</span>
                </h3>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${activeTable}...`}
                    className="w-full bg-slate-950 text-slate-200 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={() => setIsInsertingRow(true)}
                  className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Insert Row
                </button>
              </div>
            </div>

            {/* Rows Data Grid Table */}
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs">Executing SQL query on table `{activeTable}`...</span>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="p-12 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <p className="text-xs font-medium">No rows found in SQL table `{activeTable}` matching filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left font-sans border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-xs">
                      <th className="p-3 font-bold uppercase text-2xs text-cyan-400">ID</th>
                      <th className="p-3 font-bold uppercase text-2xs text-cyan-400">Details / Primary Columns</th>
                      <th className="p-3 font-bold uppercase text-2xs text-cyan-400">Timestamp / Date</th>
                      <th className="p-3 font-bold uppercase text-2xs text-cyan-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {filteredRows.map((row, idx) => {
                      const rowId = row.id || row._id || `row-${idx}`;
                      const titleOrName = row.name || row.title || row.action || row.question || row.reportNumber || rowId;
                      const secondary = row.email || row.modality || row.category || row.userEmail || '';
                      const dateStr = row.createdAt || row.submittedAt || row.timestamp || row.date || '';

                      const isSelected = selectedRow && (selectedRow.id === row.id || selectedRow._id === row._id);

                      return (
                        <tr
                          key={rowId}
                          onClick={() => {
                            setSelectedRow(row);
                            setEditJson(JSON.stringify(row, null, 2));
                          }}
                          className={`cursor-pointer transition ${
                            isSelected ? 'bg-cyan-950/40 border-l-4 border-cyan-500' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="p-3 font-mono text-cyan-300 font-semibold truncate max-w-xs">{rowId}</td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-200">{titleOrName}</div>
                            {secondary && <div className="text-2xs text-slate-400 mt-0.5">{secondary}</div>}
                          </td>
                          <td className="p-3 text-slate-400 text-2xs font-mono">
                            {dateStr ? new Date(dateStr).toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRow(row);
                                setEditJson(JSON.stringify(row, null, 2));
                                setIsEditingRow(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg transition"
                              title="Edit Row JSON"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRow(rowId);
                              }}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                              title="Delete Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Row JSON Modal */}
      {isEditingRow && selectedRow && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                Edit SQL Record ({selectedRow.id || selectedRow._id})
              </h3>
              <button onClick={() => setIsEditingRow(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Modify row column attributes directly in strict JSON format. Changes will persist directly to SQLite DB.
            </p>

            <textarea
              value={editJson}
              onChange={(e) => setEditJson(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 font-mono text-xs text-cyan-300 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditingRow(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRowEdit}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow"
              >
                Save SQL Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert New Row Modal */}
      {isInsertingRow && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Insert New Row into SQL Table `{activeTable}`
              </h3>
              <button onClick={() => setIsInsertingRow(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <textarea
              value={newRowJson}
              onChange={(e) => setNewRowJson(e.target.value)}
              rows={10}
              className="w-full bg-slate-950 font-mono text-xs text-emerald-300 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsInsertingRow(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertRow}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow"
              >
                Insert SQL Row
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
