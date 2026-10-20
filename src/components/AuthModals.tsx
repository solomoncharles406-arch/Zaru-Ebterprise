import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  mode: 'login' | 'register' | 'forgot_password' | null;
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register' | 'forgot_password') => void;
  onOpenTerms: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModals: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onSwitchMode,
  onOpenTerms,
  onLoginSuccess
}) => {
  const { registerUser, loginUser, resetUserPassword, users } = useApp();

  // Registration state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regReferralCode, setRegReferralCode] = useState('');
  const [regBankName, setRegBankName] = useState('Access Bank');
  const [regAccountNumber, setRegAccountNumber] = useState('');
  const [regAccountName, setRegAccountName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-detect referral link param (?ref=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref') || sessionStorage.getItem('zaru_referral_link_code');
    if (refParam) {
      setRegReferralCode(refParam.trim());
      sessionStorage.setItem('zaru_referral_link_code', refParam.trim());
    }
  }, []);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [verifiedTargetUser, setVerifiedTargetUser] = useState<any>(null);

  // UI feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mode) return null;

  const NIGERIAN_BANKS = [
    'Access Bank',
    'Guaranty Trust Bank (GTB)',
    'Zenith Bank',
    'United Bank for Africa (UBA)',
    'First Bank of Nigeria',
    'Fidelity Bank',
    'Stanbic IBTC Bank',
    'Union Bank',
    'Sterling Bank',
    'Wema Bank / ALAT',
    'Kuda Microfinance Bank',
    'OPay',
    'Palmpay',
    'Moniepoint MFB'
  ];

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!agreedToTerms) {
      setErrorMessage('You must accept the ZARU Enterprise Terms and Conditions to register.');
      return;
    }

    const cleanAccNo = regAccountNumber.replace(/\D/g, '');
    if (cleanAccNo.length !== 10) {
      setErrorMessage('Account number must be exactly 10 digits.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = registerUser({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      bankName: regBankName,
      accountNumber: cleanAccNo,
      accountName: regAccountName,
      referredByCode: regReferralCode,
    });
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 500);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please provide both your registered email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = loginUser(loginEmail, loginPassword, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 400);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Handle Forgot Password
  const handleForgotStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const cleanInput = forgotEmail.trim().toLowerCase();
    const target = users.find(u => 
      u.email.toLowerCase() === cleanInput || 
      u.phone.replace(/\D/g, '') === cleanInput.replace(/\D/g, '') ||
      u.accountNumber === cleanInput
    );
    if (!target) {
      setErrorMessage('No registered investor found matching this identifier. Please check and try again.');
      return;
    }
    setVerifiedTargetUser(target);
    setForgotStep(2);
    setResetCode('789124'); // Instant verification code
    setSuccessMessage(`Account located for ${target.fullName}! A 6-digit recovery code has been generated: 789124`);
  };

  const handleForgotStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (resetCode.trim() !== '789124') {
      setErrorMessage('Invalid 6-digit recovery code. Please use 789124.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    const emailToReset = verifiedTargetUser ? verifiedTargetUser.email : forgotEmail;
    const result = resetUserPassword(emailToReset, newPassword);
    if (result.success) {
      setSuccessMessage('Password successfully updated! Redirecting to login with your new credentials...');
      setLoginEmail(emailToReset);
      setLoginPassword(newPassword);
      setTimeout(() => {
        onSwitchMode('login');
        setForgotStep(1);
        setResetCode('');
        setNewPassword('');
        setConfirmNewPassword('');
      }, 1200);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 modal-backdrop-blur">
      <div 
        className="relative w-full max-w-lg bg-zinc-950 border border-red-600/50 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A86B]"></span>
              {mode === 'register' && 'Investor Registration'}
              {mode === 'login' && 'Investor Login'}
              {mode === 'forgot_password' && 'Password Recovery'}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              ZARU ENTERPRISE • Secured Agro Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ---------------- REGISTER FORM (SCROLLABLE) ---------------- */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="p-6 overflow-y-auto max-h-[calc(92vh-130px)] space-y-4">
            <div className="text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
              Provide accurate KYC and banking details. Dividends and capital are credited strictly to this account.
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Legal Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Chukwuemeka Adeleke"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Official welcome note will be dispatched to this email.</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number (WhatsApp Active) *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Password with View Password Toggle */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                  title={showRegPassword ? 'Hide password' : 'View password'}
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bank Details Header */}
            <div className="pt-2 border-t border-zinc-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Payout Bank Details
              </span>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Bank Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <select
                  value={regBankName}
                  onChange={(e) => setRegBankName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b} value={b} className="bg-zinc-900 text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Account Number - Exactly 10 figures validation */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-zinc-300">Account Number *</label>
                <span className={`text-[11px] font-mono ${regAccountNumber.length === 10 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {regAccountNumber.length}/10 figures
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={10}
                value={regAccountNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setRegAccountNumber(val);
                }}
                placeholder="10 digit NUBAN (e.g. 0123456789)"
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              {regAccountNumber.length > 0 && regAccountNumber.length < 10 && (
                <p className="text-[11px] text-red-400 mt-1">Must be exactly 10 digits.</p>
              )}
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Account Name *</label>
              <input
                type="text"
                required
                value={regAccountName}
                onChange={(e) => setRegAccountName(e.target.value)}
                placeholder="As registered with your bank"
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Terms and Condition Checkbox */}
            <div className="p-3 bg-zinc-900/80 rounded-xl border border-red-600/30">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-[#00A86B] focus:ring-0 focus:ring-offset-0 bg-zinc-800 cursor-pointer"
                />
                <span className="leading-snug select-none">
                  I have read, understood, and accept the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenTerms();
                    }}
                    className="text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                  >
                    TERMS AND CONDITIONS FOR ZARU ENTERPRISE
                  </button>
                  . I acknowledge the 14-day cycle, 2% management fee, and capital withdrawal policies.
                </span>
              </label>
            </div>

            {/* Register NOW Button - Inactive until checkbox ticked */}
            <button
              type="submit"
              disabled={!agreedToTerms || isSubmitting || regAccountNumber.length !== 10}
              className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                agreedToTerms && regAccountNumber.length === 10 && !isSubmitting
                  ? 'bg-[#00A86B] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {isSubmitting ? 'Registering Account...' : 'Register NOW'}
            </button>

            <div className="text-center text-xs text-zinc-400 pt-2">
              Already have an investor account?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
              >
                Log In Here
              </button>
            </div>
          </form>
        )}

        {/* ---------------- LOGIN FORM ---------------- */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Registered Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-zinc-300">Password *</label>
                <button
                  type="button"
                  onClick={() => onSwitchMode('forgot_password')}
                  className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox - "each time user want to log in to his/her account he should be prompted to put his password except he clicked on remember me box" */}
            <div className="flex items-center justify-between py-1 px-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#00A86B] focus:ring-[#00A86B] cursor-pointer accent-[#00A86B]"
                />
                <span className="font-medium">Remember me on this device</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Keeps session active</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#00A86B] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>

            <div className="text-center text-xs text-zinc-400 pt-3 border-t border-zinc-800">
              New to ZARU Enterprise?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
              >
                Register Here
              </button>
            </div>
          </form>
        )}

        {/* ---------------- FORGOT PASSWORD FLOW ---------------- */}
        {mode === 'forgot_password' && (
          <div className="p-6 space-y-4">
            {forgotStep === 1 ? (
              <form onSubmit={handleForgotStep1} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <div className="font-semibold text-white">Password Recovery & Account Verification</div>
                  <p className="text-zinc-400">
                    Enter your registered email address, Nigerian phone number, or 10-digit account number to initiate your password reset.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Registered Email, Phone, or Account No. *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. solomoncharles406@gmail.com or 08012345678"
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00A86B] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Verify Account & Generate Recovery Code
                </button>

                <div className="text-center text-xs text-zinc-400 pt-2">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('login')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotStep2} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="block font-bold text-white">
                      Account Verified: {verifiedTargetUser?.fullName || 'Investor'}
                    </span>
                    <span className="text-[11px] text-emerald-300">
                      Security OTP Code: <strong className="font-mono text-white tracking-widest text-sm">789124</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResetCode('789124')}
                    className="px-2.5 py-1 rounded bg-emerald-500/30 hover:bg-emerald-500/50 text-white font-bold text-[10px] self-start sm:self-auto cursor-pointer"
                  >
                    Auto-Fill OTP
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    6-Digit Recovery OTP *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="789124"
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">New Password (Min 6 Characters) *</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter strong new password"
                      className="w-full pl-9 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Confirm New Password *</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-9 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00A86B] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Set New Password & Proceed to Login
                </button>

                <div className="text-center text-xs text-zinc-400 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                  >
                    ← Change Identifier / Go Back
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
