import React, { useState } from 'react';
import { X, ShieldAlert, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { adminLogin, adminResetPassword } = useApp();

  const [username, setUsername] = useState('Zagaru2026@');
  const [password, setPassword] = useState('Zazarusap2026@$');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgotten password on admin login page
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('ZARU-ADMIN-RECOVER-2026');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const result = adminLogin(username, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = adminResetPassword(recoveryCode, newAdminPassword || 'Zazarusap2026@$');
    if (res.success) {
      setSuccessMessage(res.message);
      setPassword('Zazarusap2026@$');
      setIsRecovering(false);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 modal-backdrop-blur">
      <div 
        className="relative w-full max-w-md bg-zinc-950 border-2 border-red-600 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-red-950/40 border-b border-red-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                ZARU Executive Control Center
              </h3>
              <p className="text-[11px] text-red-300">
                Authorized Administrative Access Only
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-500 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {!isRecovering ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Admin Username */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Admin Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Zagaru2026@"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Admin Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Master Password *
                  </label>
                  {/* Forgotten password on admin login page */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecovering(true);
                      setErrorMessage('');
                    }}
                    className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Forgotten Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Zazarusap2026@$"
                    className="w-full pl-9 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
                Credentials configured for evaluation: <br />
                User: <span className="font-mono text-zinc-200">Zagaru2026@</span> | Pass: <span className="font-mono text-zinc-200">Zazarusap2026@$</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-950/60 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {isSubmitting ? 'Authenticating...' : 'Enter Admin Executive Center'}
              </button>
            </form>
          ) : (
            /* Forgotten password recovery mode */
            <form onSubmit={handleRecovery} className="space-y-4">
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-600/40 text-xs text-red-200">
                Admin Master Recovery: Enter your master authorization security token to reset/view your administrative password.
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Master Security Key *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="ZARU-ADMIN-RECOVER-2026"
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                Restore Master Password
              </button>

              <button
                type="button"
                onClick={() => setIsRecovering(false)}
                className="w-full text-center text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Back to Admin Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
