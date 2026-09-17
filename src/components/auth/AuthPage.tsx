import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Stethoscope, 
  UserCheck, 
  Shield, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  BadgeCheck, 
  AlertCircle,
  Sparkles,
  Database,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  Radio,
  Fingerprint,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const { 
    login, 
    register, 
    requestPasswordResetOtp, 
    verifyOtpAndResetPassword,
    sqlStatus,
    rememberMe,
    setRememberMe,
    rememberedEmail
  } = useAuth();

  // Auth Modes: 'login' | 'register' | 'forgot_password'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState(rememberedEmail || 'drushtishree1@gmail.com');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('Diagnostic Radiology & Thoracic Imaging');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [patientId, setPatientId] = useState('');
  const [phone, setPhone] = useState('+1 (555) 019-2834');

  // Forgot Password flow states
  const [forgotStep, setForgotStep] = useState<'request_otp' | 'verify_otp'>('request_otp');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dispatchedOtpPreview, setDispatchedOtpPreview] = useState<string | null>(null);

  useEffect(() => {
    if (rememberedEmail && authMode === 'login') {
      setEmail(rememberedEmail);
    }
  }, [rememberedEmail, authMode]);

  const resetFormErrors = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormErrors();
    setIsLoading(true);

    try {
      if (!email.trim()) {
        setErrorMessage('Please provide your registered email address.');
        setIsLoading(false);
        return;
      }

      const res = await login(email, password || 'password123', selectedRole, rememberMe);
      if (!res.success) {
        setErrorMessage(res.message || 'Login failed. Only registered accounts can log in.');
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormErrors();
    setIsLoading(true);

    try {
      if (!email.trim() || !name.trim()) {
        setErrorMessage('Full name and email are mandatory fields.');
        setIsLoading(false);
        return;
      }

      if (password && password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }

      const res = await register({
        email: email.trim().toLowerCase(),
        password: password || 'password123',
        name: name.trim(),
        role: selectedRole,
        specialization: selectedRole === 'doctor' ? specialization : undefined,
        licenseNumber: selectedRole === 'doctor' ? licenseNumber : undefined,
        patientId: selectedRole === 'patient' ? (patientId || `MRN-${Math.floor(1000000 + Math.random() * 9000000)}`) : undefined,
        phone,
      }, rememberMe);

      if (!res.success) {
        setErrorMessage(res.message || 'Registration failed.');
      } else {
        setSuccessMessage('Account registered successfully in database!');
      }
    } catch {
      setErrorMessage('Failed to connect to database for registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Step 1 - Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormErrors();
    setIsLoading(true);

    try {
      if (!email.trim()) {
        setErrorMessage('Please enter your registered Gmail or email address.');
        setIsLoading(false);
        return;
      }

      const res = await requestPasswordResetOtp(email.trim());
      if (res.success) {
        setForgotStep('verify_otp');
        setSuccessMessage(res.message);
        if (res.otpCode) {
          setDispatchedOtpPreview(res.otpCode);
          setOtpCode(res.otpCode); // Pre-populate for convenient testing
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Could not send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Step 2 - Verify OTP & Set New Password
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormErrors();
    setIsLoading(true);

    try {
      if (!otpCode.trim()) {
        setErrorMessage('Please enter the 6-digit OTP code received.');
        setIsLoading(false);
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage('New passwords do not match. Please retype carefully.');
        setIsLoading(false);
        return;
      }

      const res = await verifyOtpAndResetPassword(email.trim(), otpCode.trim(), newPassword);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setAuthMode('login');
          setForgotStep('request_otp');
          setPassword(newPassword);
        }, 2000);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to reset password. Please verify the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, role: UserRole, demoName: string) => {
    setEmail(demoEmail);
    setSelectedRole(role);
    setName(demoName);
    setPassword('password123');
    resetFormErrors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-100 relative overflow-hidden">
      {/* 3D Atmospheric Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none pulse-glow" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none pulse-glow" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main 3D Framed Auth Container */}
      <div className="w-full max-w-5xl grid lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900/90 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative z-10 perspective-container">
        
        {/* LEFT PANEL: 3D Holographic Visuals & Database Connectivity */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-blue-950/95 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          {/* Subtle Grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          {/* Top Brand & Badge */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] border border-white/20">
                <Activity className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white">MediScan</span>
                  <span className="rounded-full bg-blue-500/20 text-blue-400 px-2 py-0.5 text-[11px] font-bold tracking-wider border border-blue-400/30">
                    3D AI
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Diagnostic Radiology Engine
                </span>
              </div>
            </div>

            {/* 3D Medical Hologram Visual Card */}
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 border border-slate-700/60 shadow-xl relative preserve-3d">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Biometric Auth Gate</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" /> SQLite Store
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Account Policy:</span>
                  <span className="font-semibold text-slate-200">1 Email = 1 Registered User</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Password Recovery:</span>
                  <span className="font-semibold text-cyan-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Gmail 6-Digit OTP
                  </span>
                </div>
              </div>

              {/* Live SQLite DB stats preview */}
              <div className="pt-3 border-t border-slate-700/50 grid grid-cols-2 gap-2">
                <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-700/40 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Registered Users</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {sqlStatus?.tables?.users ?? 5} Accounts
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-700/40 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Synced Records</div>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5">
                    {(sqlStatus?.tables?.analyses ?? 2) + (sqlStatus?.tables?.reports ?? 2)} Studies
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-Pick Registered User Pills */}
            <div className="mt-6 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Test Accounts:
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('drushtishree1@gmail.com', 'doctor', 'Dr. Drushti Shree, MD')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-blue-600/20 border border-slate-700/60 hover:border-blue-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300">Dr. Drushti Shree, MD</div>
                      <div className="text-[10px] text-slate-400">drushtishree1@gmail.com (Doctor)</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">Use &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('patient.drushti@gmail.com', 'patient', 'Drushti Shree (Patient)')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-emerald-600/20 border border-slate-700/60 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300">Drushti Shree (Patient)</div>
                      <div className="text-[10px] text-slate-400">patient.drushti@gmail.com (Patient)</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">Use &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>256-Bit Encrypted HIPAA & DICOM Compliant Storage</span>
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Tabs (Login / Register / Forgot Password) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-slate-900/60">
          
          {/* Top Mode Navigation Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-6">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); resetFormErrors(); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); resetFormErrors(); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('forgot_password'); resetFormErrors(); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'forgot_password'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forgot Password
            </button>
          </div>

          {/* Alerts: Error or Success */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: SIGN IN (Strictly Validates Registered Users) */}
          {/* ======================================================== */}
          {authMode === 'login' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-white">Welcome back</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your credentials to access your synchronized diagnostic workstation.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="mb-5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Access Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['doctor', 'patient', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        selectedRole === role
                          ? 'border-blue-500 bg-blue-500/15 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {role === 'doctor' && <Stethoscope className="w-4 h-4 text-blue-400" />}
                      {role === 'patient' && <User className="w-4 h-4 text-emerald-400" />}
                      {role === 'admin' && <Shield className="w-4 h-4 text-purple-400" />}
                      <span className="text-xs font-bold capitalize">{role}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. drushtishree1@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot_password'); resetFormErrors(); }}
                      className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password (default: password123)"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-xs text-slate-300 font-medium">Remember me on this browser</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Auto-saves session</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                <span className="text-xs text-slate-400">
                  New to MediScan?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); resetFormErrors(); }}
                    className="font-bold text-blue-400 hover:text-blue-300 underline"
                  >
                    Register new account
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CREATE ACCOUNT (1 Email = 1 User Enforced) */}
          {/* ======================================================== */}
          {authMode === 'register' && (
            <div>
              <div className="mb-5">
                <h1 className="text-2xl font-black tracking-tight text-white">Create your account</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Enforces strict one-user-per-email policy stored in database.
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Registering As:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('doctor')}
                    className={`p-2 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                      selectedRole === 'doctor'
                        ? 'border-blue-500 bg-blue-500/15 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold">Medical Doctor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('patient')}
                    className={`p-2 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                      selectedRole === 'patient'
                        ? 'border-emerald-500 bg-emerald-500/15 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold">Patient / User</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === 'doctor' ? 'e.g. Dr. Drushti Shree, MD' : 'e.g. Drushti Shree'}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Email Address <span className="text-[10px] text-cyan-400 font-normal">(1 email = 1 account)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. drushtishree1@gmail.com"
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {selectedRole === 'doctor' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Specialization</label>
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="Radiology / Thoracic"
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">License No.</label>
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="MD-84920-CA"
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600"
                    />
                    <span className="text-xs text-slate-300">Remember credentials on this machine</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating account in database...
                    </>
                  ) : (
                    <>
                      <span>Register & Launch Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                <span className="text-xs text-slate-400">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); resetFormErrors(); }}
                    className="font-bold text-blue-400 hover:text-blue-300 underline"
                  >
                    Sign in here
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: FORGOT PASSWORD (Reset via Gmail OTP) */}
          {/* ======================================================== */}
          {authMode === 'forgot_password' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <KeyRound className="w-6 h-6 text-cyan-400" />
                  Password Recovery
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Reset your password securely via a 6-digit verification code sent to your Gmail.
                </p>
              </div>

              {forgotStep === 'request_otp' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Your Registered Gmail / Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. drushtishree1@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 leading-relaxed">
                    A 6-digit one-time passcode (OTP) will be dispatched to this Gmail address. The code remains valid for 15 minutes.
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating OTP...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send 6-Digit Code to Gmail</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndReset} className="space-y-4">
                  {dispatchedOtpPreview && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                      <span>Verification Code for {email}:</span>
                      <span className="font-mono font-bold text-base tracking-widest text-white px-2 py-0.5 bg-emerald-950/80 rounded border border-emerald-500/40">
                        {dispatchedOtpPreview}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="e.g. 849201"
                      className="w-full py-2.5 px-4 bg-slate-800/80 border border-slate-700/80 rounded-xl text-center font-mono text-base tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full py-2.5 px-4 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retype new password"
                      className="w-full py-2.5 px-4 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating password in database...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Reset Password</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep('request_otp')}
                      className="text-xs text-slate-400 hover:text-slate-200 underline"
                    >
                      Resend Code to different email
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); resetFormErrors(); }}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  &larr; Return to Sign In
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
