import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const SQL_DB_FILE = path.join(DATA_DIR, 'sqlite_store.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface SQLColumnDef {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'REAL' | 'TIMESTAMP';
  pk?: boolean;
  notNull?: boolean;
}

export interface SQLTableMeta {
  name: string;
  primaryKey: string;
  columns: SQLColumnDef[];
}

const TABLE_SCHEMAS: SQLTableMeta[] = [
  {
    name: 'users',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'TEXT', pk: true, notNull: true },
      { name: '_id', type: 'TEXT' },
      { name: 'email', type: 'TEXT', notNull: true },
      { name: 'password', type: 'TEXT' },
      { name: 'name', type: 'TEXT', notNull: true },
      { name: 'role', type: 'TEXT', notNull: true },
      { name: 'title', type: 'TEXT' },
      { name: 'specialization', type: 'TEXT' },
      { name: 'department', type: 'TEXT' },
      { name: 'licenseNumber', type: 'TEXT' },
      { name: 'patientId', type: 'TEXT' },
      { name: 'phone', type: 'TEXT' },
      { name: 'dateOfBirth', type: 'TEXT' },
      { name: 'bloodType', type: 'TEXT' },
      { name: 'allergies', type: 'TEXT' },
      { name: 'hospitalAffiliation', type: 'TEXT' },
      { name: 'createdAt', type: 'TIMESTAMP' },
      { name: 'lastLoginAt', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'analyses',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'TEXT', pk: true, notNull: true },
      { name: '_id', type: 'TEXT' },
      { name: 'title', type: 'TEXT', notNull: true },
      { name: 'modality', type: 'TEXT', notNull: true },
      { name: 'status', type: 'TEXT', notNull: true },
      { name: 'urgency', type: 'TEXT', notNull: true },
      { name: 'patientId', type: 'TEXT' },
      { name: 'patientName', type: 'TEXT' },
      { name: 'doctorId', type: 'TEXT' },
      { name: 'doctorName', type: 'TEXT' },
      { name: 'submittedAt', type: 'TIMESTAMP' },
      { name: 'completedAt', type: 'TIMESTAMP' },
      { name: 'symptoms', type: 'TEXT' },
      { name: 'clinicalNotes', type: 'TEXT' },
      { name: 'fileName', type: 'TEXT' },
      { name: 'fileSize', type: 'TEXT' },
      { name: 'fileType', type: 'TEXT' },
      { name: 'primaryFindingSummary', type: 'TEXT' },
      { name: 'confidenceScore', type: 'REAL' },
      { name: 'tags', type: 'TEXT' },
      { name: 'ragVerification', type: 'TEXT' },
      { name: 'prescriptions', type: 'TEXT' },
      { name: 'precautions', type: 'TEXT' },
    ],
  },
  {
    name: 'reports',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'TEXT', pk: true, notNull: true },
      { name: '_id', type: 'TEXT' },
      { name: 'reportNumber', type: 'TEXT' },
      { name: 'title', type: 'TEXT', notNull: true },
      { name: 'category', type: 'TEXT' },
      { name: 'patientId', type: 'TEXT' },
      { name: 'patientName', type: 'TEXT' },
      { name: 'physicianName', type: 'TEXT' },
      { name: 'date', type: 'TEXT' },
      { name: 'status', type: 'TEXT' },
      { name: 'fileFormat', type: 'TEXT' },
      { name: 'fileSize', type: 'TEXT' },
      { name: 'department', type: 'TEXT' },
      { name: 'summary', type: 'TEXT' },
    ],
  },
  {
    name: 'chat_history',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'TEXT', pk: true, notNull: true },
      { name: '_id', type: 'TEXT' },
      { name: 'userEmail', type: 'TEXT' },
      { name: 'userRole', type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
      { name: 'question', type: 'TEXT' },
      { name: 'answer', type: 'TEXT' },
      { name: 'precautions', type: 'TEXT' },
      { name: 'triageLevel', type: 'TEXT' },
      { name: 'timestamp', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'otp_codes',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'TEXT', pk: true, notNull: true },
      { name: '_id', type: 'TEXT' },
      { name: 'email', type: 'TEXT', notNull: true },
      { name: 'code', type: 'TEXT', notNull: true },
      { name: 'expiresAt', type: 'TIMESTAMP' },
      { name: 'used', type: 'INTEGER' },
      { name: 'createdAt', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'audit_logs',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'TEXT', pk: true, notNull: true },
      { name: '_id', type: 'TEXT' },
      { name: 'userEmail', type: 'TEXT' },
      { name: 'action', type: 'TEXT', notNull: true },
      { name: 'details', type: 'TEXT' },
      { name: 'ipAddress', type: 'TEXT' },
      { name: 'device', type: 'TEXT' },
      { name: 'timestamp', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'soundtracks',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'TEXT', pk: true, notNull: true },
      { name: '_id', type: 'TEXT' },
      { name: 'title', type: 'TEXT', notNull: true },
      { name: 'category', type: 'TEXT' },
      { name: 'baseFrequency', type: 'INTEGER' },
      { name: 'binauralBeatHz', type: 'INTEGER' },
      { name: 'durationSeconds', type: 'INTEGER' },
      { name: 'description', type: 'TEXT' },
      { name: 'waveformType', type: 'TEXT' },
      { name: 'createdAt', type: 'TIMESTAMP' },
    ],
  },
  {
    name: 'xrays',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'INTEGER', pk: true, notNull: false },
      { name: 'split', type: 'TEXT' },
      { name: 'label', type: 'TEXT' },
      { name: 'file_path', type: 'TEXT' },
    ],
  },
];

const INITIAL_SEED_DATA: Record<string, any[]> = {
  users: [
    {
      _id: 'usr_66c001a1',
      id: 'DOC-84920',
      email: 'drushtishree1@gmail.com',
      password: 'password123',
      name: 'Dr. Drushti Shree, MD',
      role: 'doctor',
      title: 'Chief Diagnostic Radiologist & AI Physician',
      specialization: 'Diagnostic Radiology & Thoracic Imaging',
      department: 'Radiology & AI Diagnostics',
      licenseNumber: 'MD-84920-CA',
      phone: '+1 (555) 438-9201',
      hospitalAffiliation: 'Metropolitan Medical Center',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
    {
      _id: 'usr_66c001a2',
      id: 'PAT-10392',
      email: 'patient.drushti@gmail.com',
      password: 'password123',
      name: 'Drushti Shree (Patient)',
      role: 'patient',
      patientId: 'MRN-7840129',
      phone: '+1 (555) 234-8901',
      dateOfBirth: '1996-06-18',
      bloodType: 'O+',
      allergies: JSON.stringify(['Penicillin (Mild)']),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
    {
      _id: 'usr_66c001a3',
      id: 'ADM-00142',
      email: 'admin@mediscan.health',
      password: 'adminpassword',
      name: 'Marcus Sterling',
      role: 'admin',
      title: 'Lead Health Informatics Administrator',
      department: 'Clinical Operations & IT Infrastructure',
      phone: '+1 (555) 902-1144',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    },
    {
      _id: 'usr_66c001a4',
      id: 'DOC-99214',
      email: 's.jenkins@mediscan.health',
      password: 'password123',
      name: 'Dr. Sarah Jenkins, MD',
      role: 'doctor',
      title: 'Senior Neuro-Radiologist',
      specialization: 'Neuroradiology & Interventional Oncology',
      department: 'Neurology Department',
      licenseNumber: 'MD-99214-NY',
      phone: '+1 (555) 781-9923',
      hospitalAffiliation: 'St. Jude Health & Sciences',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      _id: 'usr_66c001a5',
      id: 'PAT-88192',
      email: 'e.vance@example.com',
      password: 'password123',
      name: 'Eleanor Vance',
      role: 'patient',
      patientId: 'MRN-991204',
      phone: '+1 (555) 671-8821',
      dateOfBirth: '1988-11-24',
      bloodType: 'A+',
      allergies: JSON.stringify(['None']),
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
  ],
  analyses: [
    {
      _id: 'scn_66c101a1',
      id: 'MED-2025-0891',
      title: 'PA Chest Radiograph - Thoracic Evaluation',
      modality: 'xray',
      status: 'completed',
      urgency: 'moderate',
      patientId: 'MRN-7840129',
      patientName: 'Drushti Shree',
      doctorId: 'DOC-84920',
      doctorName: 'Dr. Drushti Shree, MD',
      submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 1.9).toISOString(),
      symptoms: JSON.stringify(['Mild cough', 'Post-viral checkup']),
      clinicalNotes: 'Evaluate lung parenchyma for clear bronchovascular margins.',
      fileName: 'cxr_pa_patient_2025.dcm',
      fileSize: '14.2 MB',
      fileType: 'DICOM/PNG',
      primaryFindingSummary: 'Bilateral lung fields well-expanded with normal bronchovascular markings. Costophrenic sulci sharp. No consolidation detected.',
      confidenceScore: 0.96,
      tags: JSON.stringify(['Radiology', 'Thoracic', 'Inference Complete']),
    },
    {
      _id: 'scn_66c101a2',
      id: 'MED-2025-0890',
      title: 'Brain MRI T1/T2 FLAIR Volumetric Screening',
      modality: 'mri',
      status: 'reviewed',
      urgency: 'routine',
      patientId: 'MRN-7840129',
      patientName: 'Drushti Shree',
      doctorId: 'DOC-84920',
      doctorName: 'Dr. Drushti Shree, MD',
      submittedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 25.8).toISOString(),
      symptoms: JSON.stringify(['Routine wellness scan', 'Mild tension headaches']),
      clinicalNotes: 'Rule out intracranial mass or microvascular ischemia.',
      fileName: 'brain_mri_flair_0890.nii',
      fileSize: '42.8 MB',
      fileType: 'NIfTI/DICOM',
      primaryFindingSummary: 'Normal ventricular morphology and unremarkable grey-white matter differentiation. No acute intracranial pathology.',
      confidenceScore: 0.98,
      tags: JSON.stringify(['Neurology', 'Brain MRI', 'Normal Study']),
    },
    {
      _id: 'scn_66c101a3',
      id: 'MED-2025-0889',
      title: 'Contrast-Enhanced Abdominal CT Scan',
      modality: 'ct',
      status: 'completed',
      urgency: 'urgent',
      patientId: 'MRN-991204',
      patientName: 'Eleanor Vance',
      doctorId: 'DOC-84920',
      doctorName: 'Dr. Drushti Shree, MD',
      submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 47.5).toISOString(),
      symptoms: JSON.stringify(['Right upper quadrant abdominal pain', 'Nausea postprandial']),
      clinicalNotes: 'Assess biliary tree, gallbladder wall thickening, and hepatic parenchyma.',
      fileName: 'abd_ct_iv_contrast_0889.dcm',
      fileSize: '68.4 MB',
      fileType: 'DICOM',
      primaryFindingSummary: 'Mild cholelithiasis without acute inflammatory wall thickening. Liver, spleen, and pancreas are morphologically within normal limits.',
      confidenceScore: 0.94,
      tags: JSON.stringify(['Abdominal CT', 'Gallbladder', 'Gastroenterology']),
    },
  ],
  reports: [
    {
      _id: 'rep_66c201a1',
      id: 'REP-2025-001',
      reportNumber: 'RAD-90812-CXR',
      title: 'Comprehensive Thoracic Diagnostic Examination',
      category: 'Radiology',
      patientId: 'MRN-7840129',
      patientName: 'Drushti Shree',
      physicianName: 'Dr. Drushti Shree, MD',
      date: '2025-05-14',
      status: 'Final',
      fileFormat: 'PDF',
      fileSize: '2.4 MB',
      department: 'Diagnostic Radiology',
      summary: 'Normal baseline cardiac silhouette and pulmonary vasculature. No acute cardiopulmonary abnormality detected.',
    },
    {
      _id: 'rep_66c201a2',
      id: 'REP-2025-002',
      reportNumber: 'NEU-41092-MRI',
      title: 'High-Resolution 3T Brain MRI Volumetric Study',
      category: 'Radiology',
      patientId: 'MRN-7840129',
      patientName: 'Drushti Shree',
      physicianName: 'Dr. Sarah Jenkins, MD',
      date: '2025-05-10',
      status: 'Final',
      fileFormat: 'PDF',
      fileSize: '4.8 MB',
      department: 'Neuroradiology Division',
      summary: 'Volumetric and diffuse tensor screening demonstrates preserved brain parenchymal volume without acute ischemia.',
    },
  ],
  chat_history: [
    {
      _id: 'msg_66c301a1',
      id: 'MSG-INIT-01',
      userEmail: 'drushtishree1@gmail.com',
      userRole: 'doctor',
      category: 'Pre-Scan Precaution',
      question: 'What are the required precautions before a 3T Brain MRI with Gadolinium contrast?',
      answer: '1. Fasting: Maintain 4-6 hours fasting prior to contrast injection.\n2. Ferromagnetic Checklist: Remove all metallic items, jewelry, dental appliances, and piercings.\n3. Renal Clearance: Confirm eGFR (>30 mL/min/1.73m²) to prevent NSF.\n4. Claustrophobia / Anxiety: Offer 432Hz calming acoustic therapy if needed.\n5. Pregnancy Screening: Rule out first trimester pregnancy unless clinically critical.',
      precautions: JSON.stringify([
        'Fast 4-6 hours before scan',
        'Verify eGFR > 30 for Gadolinium',
        'Strict 100% metal-free screening',
        'Earplugs provided for acoustic gradient noise (95-105 dB)',
      ]),
      triageLevel: 'routine',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ],
  otp_codes: [],
  audit_logs: [
    {
      _id: 'log_66c401a1',
      id: 'LOG-001',
      userEmail: 'drushtishree1@gmail.com',
      action: 'SYSTEM_BOOT',
      details: 'SQLite Relational Database Engine initialized as primary system database.',
      ipAddress: '127.0.0.1',
      device: 'Node/Express Server',
      timestamp: new Date().toISOString(),
    },
  ],
  soundtracks: [
    {
      _id: 'snd_66c501a1',
      id: 'SND-432-ALPHA',
      title: '432Hz Thoracic Calm & Resonance',
      category: 'Thoracic Respiration',
      baseFrequency: 432,
      binauralBeatHz: 10,
      durationSeconds: 120,
      description: 'Harmonic 432Hz carrier tone with 10Hz Alpha waves for pre-scan anxiety mitigation and rhythmic breathing synchronization.',
      waveformType: 'sine',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'snd_66c501a2',
      id: 'SND-528-NEURAL',
      title: '528Hz Solfeggio Neural Reset',
      category: 'Neural Reset',
      baseFrequency: 528,
      binauralBeatHz: 6,
      durationSeconds: 180,
      description: '528Hz cellular restoration tone paired with 6Hz Theta frequency to induce calm brainwave states during MRI acoustic exposure.',
      waveformType: 'ambient',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
};

export class SQLEngine {
  private db!: sqlite3.Database;
  private isInitialized = false;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    this.db = new sqlite3.Database(SQL_DB_FILE, (err) => {
      if (err) {
        console.error('Failed to connect to SQLite database:', err.message);
      } else {
        console.log(`Connected to SQLite relational database file: ${SQL_DB_FILE}`);
        this.createTablesAndSeed();
      }
    });
  }

  private runSql(sql: string, params: any[] = []): Promise<{ lastID?: number; changes?: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  private allSql<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve((rows as T[]) || []);
      });
    });
  }

  private getSql<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  private async createTablesAndSeed() {
    try {
      // Create tables if they do not exist
      for (const tableMeta of TABLE_SCHEMAS) {
        const columnDefs = tableMeta.columns
          .map((col) => {
            let def = `"${col.name}" ${col.type}`;
            if (col.pk) def += ' PRIMARY KEY';
            if (col.notNull && !col.pk) def += ' NOT NULL';
            return def;
          })
          .join(', ');

        const createSql = `CREATE TABLE IF NOT EXISTS "${tableMeta.name}" (${columnDefs});`;
        await this.runSql(createSql);
      }

      // Check if users table has rows, if empty seed default data
      const userCount = await this.getSql<{ count: number }>('SELECT COUNT(*) as count FROM users');
      if (!userCount || userCount.count === 0) {
        await this.seedInitialDataset();
      }

      this.isInitialized = true;
    } catch (e) {
      console.error('Error during SQLite schema initialization:', e);
    }
  }

  public async seedInitialDataset(): Promise<boolean> {
    try {
      for (const tableMeta of TABLE_SCHEMAS) {
        const seedRows = INITIAL_SEED_DATA[tableMeta.name] || [];
        for (const rowData of seedRows) {
          const colNames = Object.keys(rowData);
          const placeholders = colNames.map(() => '?').join(', ');
          const values = Object.values(rowData);

          const insertOrReplaceSql = `INSERT OR REPLACE INTO "${tableMeta.name}" (${colNames
            .map((c) => `"${c}"`)
            .join(', ')}) VALUES (${placeholders});`;

          await this.runSql(insertOrReplaceSql, values);
        }
      }
      return true;
    } catch (err) {
      console.error('Failed to seed SQLite database:', err);
      return false;
    }
  }

  public async getStatus() {
    let totalRows = 0;
    const tableCounts: Record<string, number> = {};

    for (const table of TABLE_SCHEMAS) {
      try {
        const res = await this.getSql<{ count: number }>(`SELECT COUNT(*) as count FROM "${table.name}"`);
        const cnt = res?.count || 0;
        tableCounts[table.name] = cnt;
        totalRows += cnt;
      } catch {
        tableCounts[table.name] = 0;
      }
    }

    let fileSize = 0;
    try {
      if (fs.existsSync(SQL_DB_FILE)) {
        fileSize = fs.statSync(SQL_DB_FILE).size;
      }
    } catch {
      fileSize = 1024 * 32;
    }

    return {
      status: 'Connected',
      engine: 'SQLite Relational Database Engine',
      databaseName: 'mediscan_clinical_sql',
      driver: 'sqlite3 (C-NAPI / File Engine)',
      filePath: SQL_DB_FILE,
      tables: tableCounts,
      totalTables: TABLE_SCHEMAS.length,
      totalRows,
      storageSizeBytes: fileSize,
      storageFormatted: `${(fileSize / 1024).toFixed(2)} KB`,
      lastSyncedAt: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      syncedWithStore: true,
    };
  }

  public async getTables(): Promise<any[]> {
    const result: any[] = [];
    for (const tableMeta of TABLE_SCHEMAS) {
      try {
        const cntRes = await this.getSql<{ count: number }>(`SELECT COUNT(*) as count FROM "${tableMeta.name}"`);
        result.push({
          name: tableMeta.name,
          primaryKey: tableMeta.primaryKey,
          columns: tableMeta.columns,
          rowCount: cntRes?.count || 0,
        });
      } catch (err) {
        result.push({
          name: tableMeta.name,
          primaryKey: tableMeta.primaryKey,
          columns: tableMeta.columns,
          rowCount: 0,
        });
      }
    }
    return result;
  }

  public async getTableRows(tableName: string, query: Record<string, any> = {}): Promise<any[]> {
    const tableMeta = TABLE_SCHEMAS.find((t) => t.name === tableName);
    if (!tableMeta) throw new Error(`SQL Table "${tableName}" does not exist in schema.`);

    let sql = `SELECT * FROM "${tableName}"`;
    const whereClauses: string[] = [];
    const params: any[] = [];

    const search = query.search || query.q;
    if (search && typeof search === 'string') {
      const textCols = tableMeta.columns.filter((c) => c.type === 'TEXT').map((c) => `"${c.name}" LIKE ?`);
      if (textCols.length > 0) {
        whereClauses.push(`(${textCols.join(' OR ')})`);
        textCols.forEach(() => params.push(`%${search}%`));
      }
    }

    for (const [k, v] of Object.entries(query)) {
      if (['search', 'q', 'limit', 'offset'].includes(k)) continue;
      if (tableMeta.columns.some((c) => c.name === k)) {
        whereClauses.push(`"${k}" = ?`);
        params.push(v);
      }
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    sql += ` ORDER BY rowid DESC LIMIT 100`;

    const rows = await this.allSql(sql, params);

    // Parse JSON fields automatically
    return rows.map((row) => {
      const parsed: Record<string, any> = { ...row };
      for (const [key, val] of Object.entries(parsed)) {
        if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
          try {
            parsed[key] = JSON.parse(val);
          } catch {
            // keep as string
          }
        }
      }
      return parsed;
    });
  }

  public async executeQuery(sql: string): Promise<any> {
    const startTime = Date.now();
    const cleanSql = sql.trim();
    const upperSql = cleanSql.toUpperCase();

    let commandType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'DDL' | 'OTHER' = 'OTHER';

    if (upperSql.startsWith('SELECT') || upperSql.startsWith('PRAGMA') || upperSql.startsWith('EXPLAIN')) {
      commandType = 'SELECT';
    } else if (upperSql.startsWith('INSERT')) {
      commandType = 'INSERT';
    } else if (upperSql.startsWith('UPDATE')) {
      commandType = 'UPDATE';
    } else if (upperSql.startsWith('DELETE')) {
      commandType = 'DELETE';
    } else if (
      upperSql.startsWith('CREATE') ||
      upperSql.startsWith('DROP') ||
      upperSql.startsWith('ALTER') ||
      upperSql.startsWith('TRUNCATE')
    ) {
      commandType = 'DDL';
    }

    try {
      if (commandType === 'SELECT') {
        const rows = await this.allSql(cleanSql);
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        const executionTimeMs = Date.now() - startTime;

        return {
          success: true,
          sql: cleanSql,
          commandType,
          columns,
          rows,
          rowCount: rows.length,
          executionTimeMs,
        };
      } else {
        const result = await this.runSql(cleanSql);
        const executionTimeMs = Date.now() - startTime;

        return {
          success: true,
          sql: cleanSql,
          commandType,
          columns: ['status', 'affectedRows', 'lastID'],
          rows: [
            {
              status: 'Query Executed Successfully',
              affectedRows: result.changes ?? 0,
              lastID: result.lastID ?? null,
            },
          ],
          rowCount: 1,
          affectedRows: result.changes ?? 0,
          executionTimeMs,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        sql: cleanSql,
        commandType,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Date.now() - startTime,
        error: err.message,
      };
    }
  }

  public async insertRow(tableName: string, data: Record<string, any>): Promise<any> {
    const tableMeta = TABLE_SCHEMAS.find((t) => t.name === tableName);
    if (!tableMeta) throw new Error(`Table "${tableName}" not found.`);

    const id = data.id || `${tableName.slice(0, 3)}_${Date.now()}`;
    const rowData: Record<string, any> = { ...data, id };

    const colNames: string[] = [];
    const placeholders: string[] = [];
    const values: any[] = [];

    for (const [key, val] of Object.entries(rowData)) {
      if (tableMeta.columns.some((c) => c.name === key)) {
        colNames.push(`"${key}"`);
        placeholders.push('?');
        values.push(typeof val === 'object' ? JSON.stringify(val) : val);
      }
    }

    const sql = `INSERT INTO "${tableName}" (${colNames.join(', ')}) VALUES (${placeholders.join(', ')});`;
    await this.runSql(sql, values);
    return rowData;
  }

  public async updateRow(tableName: string, id: string, data: Record<string, any>): Promise<any> {
    const tableMeta = TABLE_SCHEMAS.find((t) => t.name === tableName);
    if (!tableMeta) throw new Error(`Table "${tableName}" not found.`);

    const updates: string[] = [];
    const values: any[] = [];

    for (const [key, val] of Object.entries(data)) {
      if (key === 'id' || key === '_id') continue;
      if (tableMeta.columns.some((c) => c.name === key)) {
        updates.push(`"${key}" = ?`);
        values.push(typeof val === 'object' ? JSON.stringify(val) : val);
      }
    }

    if (updates.length === 0) return data;

    values.push(id);
    values.push(id);
    const sql = `UPDATE "${tableName}" SET ${updates.join(', ')} WHERE "id" = ? OR "_id" = ?;`;

    await this.runSql(sql, values);
    return { id, ...data };
  }

  public async deleteRow(tableName: string, id: string): Promise<boolean> {
    const sql = `DELETE FROM "${tableName}" WHERE "id" = ? OR "_id" = ?;`;
    const res = await this.runSql(sql, [id, id]);
    return (res.changes || 0) > 0;
  }

  public async resetToSeed(): Promise<boolean> {
    for (const tableMeta of TABLE_SCHEMAS) {
      await this.runSql(`DELETE FROM "${tableMeta.name}";`);
    }
    return await this.seedInitialDataset();
  }
}

export const sqlDB = new SQLEngine();
