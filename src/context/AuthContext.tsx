import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  UserRole, 
  LoginSession, 
  AnalysisRecord, 
  SoundTherapyTrack, 
  SQLStatus,
  SQLQueryResult,
  PrecautionChatRecord,
  MedicalReport 
} from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  rememberedEmail: string;
  login: (email: string, password?: string, role?: UserRole, remember?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Partial<User> & { password?: string }, remember?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  
  // Password Reset with Gmail OTP
  requestPasswordResetOtp: (email: string) => Promise<{ success: boolean; message: string; otpCode?: string }>;
  verifyOtpAndResetPassword: (email: string, otpCode: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // Sessions & Database Audit
  loginSessions: LoginSession[];
  
  // SQL Relational Database Integration
  sqlStatus: SQLStatus | null;
  isSqlLoading: boolean;
  refreshSqlStatus: () => Promise<void>;
  runSqlQuery: (sql: string) => Promise<SQLQueryResult>;
  resetSqlToSeed: () => Promise<void>;
  
  // Data Collections
  userAnalyses: AnalysisRecord[];
  allAnalyses: AnalysisRecord[];
  addAnalysisRecord: (record: AnalysisRecord) => Promise<void>;
  deleteAnalysisRecord: (recordId: string) => Promise<void>;
  
  allReports: MedicalReport[];
  addReportRecord: (report: MedicalReport) => Promise<void>;
  deleteReportRecord: (reportId: string) => Promise<void>;
  
  userSoundtracks: SoundTherapyTrack[];
  addSoundtrack: (track: SoundTherapyTrack) => Promise<void>;
  deleteSoundtrack: (trackId: string) => Promise<void>;
  
  chatHistory: PrecautionChatRecord[];
  addChatRecord: (record: PrecautionChatRecord) => void;
  
  allRegisteredUsers: User[];
}

const DEFAULT_USERS_BY_ROLE: Record<UserRole, (email?: string, name?: string) => User> = {
  doctor: (email = 'drushtishree1@gmail.com', name = 'Dr. Drushti Shree, MD') => ({
    id: 'DOC-84920',
    name: name || 'Dr. Drushti Shree, MD',
    email: email || 'drushtishree1@gmail.com',
    role: 'doctor',
    title: 'Chief Diagnostic Radiologist & AI Physician',
    specialization: 'Diagnostic Radiology & Thoracic Imaging',
    department: 'Radiology & AI Diagnostics',
    licenseNumber: 'MD-84920-CA',
    phone: '+1 (555) 438-9201',
    hospitalAffiliation: 'Metropolitan Medical Center',
    createdAt: new Date().toISOString(),
  }),
  patient: (email = 'patient.drushti@gmail.com', name = 'Drushti Shree (Patient)') => ({
    id: 'PAT-10392',
    name: name || 'Drushti Shree (Patient)',
    email: email || 'patient.drushti@gmail.com',
    role: 'patient',
    patientId: 'MRN-7840129',
    phone: '+1 (555) 234-8901',
    dateOfBirth: '1996-06-18',
    bloodType: 'O+',
    allergies: ['Penicillin (Mild)'],
    createdAt: new Date().toISOString(),
  }),
  admin: (email = 'admin@mediscan.health', name = 'Marcus Sterling') => ({
    id: 'ADM-00142',
    name: name || 'Marcus Sterling',
    email: email || 'admin@mediscan.health',
    role: 'admin',
    title: 'Lead Health Informatics Administrator',
    department: 'Clinical Operations & IT Infrastructure',
    phone: '+1 (555) 902-1144',
    createdAt: new Date().toISOString(),
  }),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Remember Me State
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    const saved = localStorage.getItem('mediscan_remember_me');
    return saved !== null ? saved === 'true' : true;
  });

  const [rememberedEmail, setRememberedEmail] = useState<string>(() => {
    return localStorage.getItem('mediscan_remembered_email') || 'drushtishree1@gmail.com';
  });

  // Current Logged In User
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mediscan_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse current user from local storage', e);
      }
    }
    // Default active session for initial pleasant load
    return DEFAULT_USERS_BY_ROLE.doctor('drushtishree1@gmail.com', 'Dr. Drushti Shree, MD');
  });

  // SQL Relational DB Status
  const [sqlStatus, setSqlStatus] = useState<SQLStatus | null>(null);
  const [isSqlLoading, setIsSqlLoading] = useState<boolean>(false);

  // Registered users in system
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mediscan_all_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      DEFAULT_USERS_BY_ROLE.doctor('drushtishree1@gmail.com', 'Dr. Drushti Shree, MD'),
      DEFAULT_USERS_BY_ROLE.patient('patient.drushti@gmail.com', 'Drushti Shree (Patient)'),
      DEFAULT_USERS_BY_ROLE.patient('e.vance@example.com', 'Eleanor Vance'),
      DEFAULT_USERS_BY_ROLE.doctor('s.jenkins@mediscan.health', 'Dr. Sarah Jenkins, MD'),
      DEFAULT_USERS_BY_ROLE.admin('admin@mediscan.health', 'Marcus Sterling'),
    ];
  });

  // Login Sessions Audit
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>(() => {
    const saved = localStorage.getItem('mediscan_login_sessions_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: `SES-${Date.now()}-1`,
        email: 'drushtishree1@gmail.com',
        name: 'Dr. Drushti Shree, MD',
        role: 'doctor',
        timestamp: new Date().toISOString(),
        device: 'Chrome 128 / macOS Sequoia',
        ipAddress: '192.168.1.104',
        status: 'Active',
        location: 'San Francisco, CA (US)',
      },
      {
        id: `SES-${Date.now()}-2`,
        email: 's.jenkins@mediscan.health',
        name: 'Dr. Sarah Jenkins, MD',
        role: 'doctor',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        device: 'Safari / iPadOS 17.4',
        ipAddress: '172.56.21.9',
        status: 'Closed',
        location: 'San Jose, CA (US)',
      },
    ];
  });

  // Analyses records
  const [allAnalyses, setAllAnalyses] = useState<AnalysisRecord[]>(() => {
    const saved = localStorage.getItem('mediscan_analyses_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
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
        symptoms: ['Mild cough', 'Post-viral checkup'],
        clinicalNotes: 'Evaluate lung parenchyma for clear bronchovascular margins.',
        fileName: 'cxr_pa_patient_2025.dcm',
        fileSize: '14.2 MB',
        fileType: 'DICOM/PNG',
        primaryFindingSummary: 'Bilateral lung fields well-expanded with normal bronchovascular markings. Costophrenic sulci sharp. No consolidation detected.',
        confidenceScore: 0.96,
        tags: ['Radiology', 'Thoracic', 'Inference Complete'],
      },
      {
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
        symptoms: ['Routine wellness scan', 'Mild tension headaches'],
        clinicalNotes: 'Rule out intracranial mass or microvascular ischemia.',
        fileName: 'brain_mri_flair_0890.nii',
        fileSize: '42.8 MB',
        fileType: 'NIfTI/DICOM',
        primaryFindingSummary: 'Normal ventricular morphology and unremarkable grey-white matter differentiation. No acute intracranial pathology.',
        confidenceScore: 0.98,
        tags: ['Neurology', 'Brain MRI', 'Normal Study'],
      },
    ];
  });

  // Medical Reports Collection State with LocalStorage & SQLite persistence
  const [allReports, setAllReports] = useState<MedicalReport[]>(() => {
    const saved = localStorage.getItem('mediscan_reports_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Soundtracks
  const [userSoundtracks, setUserSoundtracks] = useState<SoundTherapyTrack[]>(() => {
    const saved = localStorage.getItem('mediscan_soundtracks_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
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
    ];
  });

  // Precaution Chat Records
  const [chatHistory, setChatHistory] = useState<PrecautionChatRecord[]>(() => {
    const saved = localStorage.getItem('mediscan_chat_history_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Fetch SQL status from server
  const refreshSqlStatus = useCallback(async () => {
    try {
      setIsSqlLoading(true);
      const res = await fetch('/api/sql/status');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSqlStatus(data);
        }
      }
      const usersRes = await fetch('/api/db/collections/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success && usersData.data && usersData.data.length > 0) {
          setAllRegisteredUsers(usersData.data);
        }
      }
    } catch (e) {
      console.warn('SQL backend status fetch error:', e);
    } finally {
      setIsSqlLoading(false);
    }
  }, []);

  // Run raw SQL query
  const runSqlQuery = async (sql: string): Promise<SQLQueryResult> => {
    try {
      const res = await fetch('/api/sql/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });
      const data = await res.json();
      refreshSqlStatus();
      return data;
    } catch (e: any) {
      return {
        success: false,
        sql,
        commandType: 'OTHER',
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: e.message || 'Failed to communicate with SQL backend',
      };
    }
  };

  // Reset SQL engine to seed dataset
  const resetSqlToSeed = async () => {
    try {
      setIsSqlLoading(true);
      const res = await fetch('/api/sql/reset-seed', { method: 'POST' });
      if (res.ok) {
        await refreshSqlStatus();
      }
    } catch (e) {
      console.error('Failed to reset SQL to seed:', e);
    } finally {
      setIsSqlLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshSqlStatus();
  }, [refreshSqlStatus]);

  // Sync to local storage
  useEffect(() => {
    if (user && rememberMe) {
      localStorage.setItem('mediscan_current_user', JSON.stringify(user));
      localStorage.setItem('mediscan_active_role', user.role);
    } else if (!rememberMe) {
      localStorage.removeItem('mediscan_current_user');
      localStorage.removeItem('mediscan_active_role');
    }
  }, [user, rememberMe]);

  useEffect(() => {
    localStorage.setItem('mediscan_remember_me', String(rememberMe));
    if (rememberMe && rememberedEmail) {
      localStorage.setItem('mediscan_remembered_email', rememberedEmail);
    }
  }, [rememberMe, rememberedEmail]);

  useEffect(() => {
    localStorage.setItem('mediscan_login_sessions_history', JSON.stringify(loginSessions));
  }, [loginSessions]);

  useEffect(() => {
    localStorage.setItem('mediscan_analyses_store', JSON.stringify(allAnalyses));
  }, [allAnalyses]);

  useEffect(() => {
    localStorage.setItem('mediscan_soundtracks_store', JSON.stringify(userSoundtracks));
  }, [userSoundtracks]);

  useEffect(() => {
    localStorage.setItem('mediscan_all_users', JSON.stringify(allRegisteredUsers));
  }, [allRegisteredUsers]);

  useEffect(() => {
    localStorage.setItem('mediscan_chat_history_store', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const isAuthenticated = user !== null;

  const recordLoginSession = (loggedInUser: User) => {
    const newSession: LoginSession = {
      id: `SES-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      email: loggedInUser.email,
      name: loggedInUser.name,
      role: loggedInUser.role,
      timestamp: new Date().toISOString(),
      device: navigator.userAgent.includes('Mac') ? 'Chrome 128 / macOS' : 'Chrome / Secure Web Client',
      ipAddress: `192.168.1.${Math.floor(50 + Math.random() * 150)}`,
      status: 'Active',
      location: 'San Francisco, CA (US)',
    };
    setLoginSessions((prev) => [newSession, ...prev.slice(0, 25)]);
  };

  // Login Handler (Enforces Registered User Validation)
  const login = async (
    email: string, 
    password = 'password123', 
    role: UserRole = 'doctor',
    remember = true
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      
      // Call server login API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, role }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setRememberMe(remember);
        if (remember) {
          setRememberedEmail(cleanEmail);
        }
        recordLoginSession(data.user);
        refreshSqlStatus();
        return { success: true, message: data.message || 'Login successful' };
      } else {
        // Check local registered fallback if server had an error
        const existing = allRegisteredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        if (existing) {
          const targetUser: User = { ...existing, role: role || existing.role };
          setUser(targetUser);
          setRememberMe(remember);
          if (remember) setRememberedEmail(cleanEmail);
          recordLoginSession(targetUser);
          return { success: true, message: 'Welcome back!' };
        }
        return { 
          success: false, 
          message: data.message || `No registered account found with email "${cleanEmail}". Please register first.` 
        };
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Local fallback check
      const cleanEmail = email.trim().toLowerCase();
      const existing = allRegisteredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        const targetUser: User = { ...existing, role: role || existing.role };
        setUser(targetUser);
        setRememberMe(remember);
        if (remember) setRememberedEmail(cleanEmail);
        recordLoginSession(targetUser);
        return { success: true, message: 'Signed in via local sync cache' };
      }
      return { 
        success: false, 
        message: `Account not found for "${cleanEmail}". Only registered users can login.` 
      };
    }
  };

  // Register Handler (Enforces One Email = One User)
  const register = async (
    userData: Partial<User> & { password?: string },
    remember = true
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const cleanEmail = (userData.email || '').trim().toLowerCase();

      // Check local cache first for instant feedback
      const alreadyExists = allRegisteredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
      if (alreadyExists) {
        return {
          success: false,
          message: `An account for "${cleanEmail}" is already registered. One email is restricted to one user. Please sign in.`,
        };
      }

      // Call register API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          email: cleanEmail,
          password: userData.password || 'password123',
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setAllRegisteredUsers((prev) => [data.user, ...prev]);
        setRememberMe(remember);
        if (remember) setRememberedEmail(cleanEmail);
        recordLoginSession(data.user);
        refreshSqlStatus();
        return { success: true, message: 'Registration complete in SQLite database!' };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed. Please check required fields.',
        };
      }
    } catch (err: any) {
      console.error('Register API error:', err);
      // Fallback local registration
      const role = userData.role || 'patient';
      const cleanEmail = (userData.email || '').trim().toLowerCase();
      const name = userData.name || (role === 'doctor' ? 'Dr. Physician, MD' : 'Medical Patient');
      const defaultBuilder = DEFAULT_USERS_BY_ROLE[role];
      const newUser: User = {
        ...defaultBuilder(cleanEmail, name),
        ...userData,
        email: cleanEmail,
        id: `${role.toUpperCase().slice(0, 3)}-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      setAllRegisteredUsers((prev) => [newUser, ...prev]);
      setRememberMe(remember);
      if (remember) setRememberedEmail(cleanEmail);
      recordLoginSession(newUser);
      return { success: true, message: 'Profile created in synchronized storage' };
    }
  };

  // Request Password Reset OTP via Gmail
  const requestPasswordResetOtp = async (email: string): Promise<{ success: boolean; message: string; otpCode?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/forgot-password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          message: data.message,
          otpCode: data.otpCode,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Unable to dispatch reset code. Ensure email is registered.',
        };
      }
    } catch (e: any) {
      console.error('Forgot password OTP error:', e);
      return {
        success: false,
        message: 'Could not communicate with authentication server.',
      };
    }
  };

  // Verify OTP and Reset Password
  const verifyOtpAndResetPassword = async (
    email: string, 
    otpCode: string, 
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth/forgot-password/verify-and-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otpCode, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        refreshSqlStatus();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Failed to verify reset code.' };
      }
    } catch (e: any) {
      console.error('Reset password error:', e);
      return { success: false, message: 'Server communication error during password reset.' };
    }
  };

  const logout = () => {
    if (user) {
      setLoginSessions((prev) =>
        prev.map((s) => (s.email === user.email && s.status === 'Active' ? { ...s, status: 'Closed' } : s))
      );
    }
    setUser(null);
    if (!rememberMe) {
      localStorage.removeItem('mediscan_current_user');
      localStorage.removeItem('mediscan_active_role');
    }
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updatedUser = {
      ...DEFAULT_USERS_BY_ROLE[role](user.email, user.name),
      email: user.email,
      name: user.name,
    };
    setUser(updatedUser);
    recordLoginSession(updatedUser);
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedData };
      setUser(updated);
      setAllRegisteredUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));

      // Sync to database backend
      try {
        await fetch(`/api/db/collections/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
      } catch (e) {
        console.warn('Profile sync error:', e);
      }
    }
  };

  const addReportRecord = async (report: MedicalReport) => {
    setAllReports((prev) => {
      const updated = [report, ...prev];
      localStorage.setItem('mediscan_reports_store', JSON.stringify(updated));
      return updated;
    });
    try {
      await fetch('/api/db/collections/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      refreshSqlStatus();
    } catch (e) {
      console.warn('SQLite report sync:', e);
    }
  };

  const deleteReportRecord = async (reportId: string) => {
    setAllReports((prev) => {
      const updated = prev.filter((r) => r.id !== reportId);
      localStorage.setItem('mediscan_reports_store', JSON.stringify(updated));
      return updated;
    });
    try {
      await fetch(`/api/db/collections/reports/${reportId}`, { method: 'DELETE' });
      refreshSqlStatus();
    } catch (e) {
      console.warn('SQLite report delete:', e);
    }
  };

  const addAnalysisRecord = async (record: AnalysisRecord) => {
    setAllAnalyses((prev) => {
      const updated = [record, ...prev];
      localStorage.setItem('mediscan_analyses_store', JSON.stringify(updated));
      return updated;
    });

    // Auto-generate and save a corresponding Medical Report into SQLite reports table
    const autoReport: MedicalReport = {
      id: `REP-${record.id}`,
      reportNumber: `RAD-${record.id.replace(/[^0-9]/g, '').slice(0, 5) || '90812'}-CXR`,
      title: record.title,
      category: 'Radiology',
      patientId: record.patientId || 'MRN-7840129',
      patientName: record.patientName || 'Drushti Shree',
      physicianName: record.doctorName || 'Dr. Drushti Shree, MD',
      date: new Date().toISOString().split('T')[0],
      status: 'Final',
      fileFormat: record.fileType?.includes('DICOM') ? 'DICOM' : 'PDF',
      fileSize: record.fileSize || '2.5 MB',
      department: 'Diagnostic Radiology',
      summary: record.primaryFindingSummary || 'Clinical diagnostic analysis complete.',
      ragVerification: record.ragVerification,
      prescriptions: record.prescriptions,
      precautions: record.precautions,
    };

    addReportRecord(autoReport);

    try {
      await fetch('/api/db/collections/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      refreshSqlStatus();
    } catch (e) {
      console.warn('SQLite analysis sync:', e);
    }
  };

  const deleteAnalysisRecord = async (recordId: string) => {
    setAllAnalyses((prev) => prev.filter((r) => r.id !== recordId));
    try {
      await fetch(`/api/db/collections/analyses/${recordId}`, { method: 'DELETE' });
      refreshSqlStatus();
    } catch (e) {
      console.warn('SQLite analysis delete:', e);
    }
  };

  const addSoundtrack = async (track: SoundTherapyTrack) => {
    setUserSoundtracks((prev) => [track, ...prev]);
    try {
      await fetch('/api/db/collections/soundtracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(track),
      });
      refreshSqlStatus();
    } catch (e) {
      console.warn('SQLite soundtrack sync:', e);
    }
  };

  const deleteSoundtrack = async (trackId: string) => {
    setUserSoundtracks((prev) => prev.filter((t) => t.id !== trackId));
    try {
      await fetch(`/api/db/collections/soundtracks/${trackId}`, { method: 'DELETE' });
      refreshSqlStatus();
    } catch (e) {
      console.warn('SQLite soundtrack delete:', e);
    }
  };

  const addChatRecord = (record: PrecautionChatRecord) => {
    setChatHistory((prev) => [record, ...prev]);
  };

  // User Analyses Filter
  const userAnalyses = allAnalyses.filter((item) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'doctor') return true;
    return (
      item.patientName.toLowerCase() === user.name.toLowerCase() ||
      item.patientId === user.patientId ||
      (user.email && item.clinicalNotes?.includes(user.email))
    );
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        rememberMe,
        setRememberMe,
        rememberedEmail,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        requestPasswordResetOtp,
        verifyOtpAndResetPassword,
        loginSessions,
        sqlStatus,
        isSqlLoading,
        refreshSqlStatus,
        runSqlQuery,
        resetSqlToSeed,
        userAnalyses,
        allAnalyses,
        addAnalysisRecord,
        deleteAnalysisRecord,
        allReports,
        addReportRecord,
        deleteReportRecord,
        userSoundtracks,
        addSoundtrack,
        deleteSoundtrack,
        chatHistory,
        addChatRecord,
        allRegisteredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
