import React from 'react';
import { Mail, CheckCircle2, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WelcomeEmailModal: React.FC = () => {
  const { welcomeEmailData, closeWelcomeEmailModal, cmsConfig } = useApp();

  if (!welcomeEmailData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 modal-backdrop-blur">
      <div 
        className="relative w-full max-w-lg bg-zinc-950 border border-emerald-500/50 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Email Header Bar */}
        <div className="bg-emerald-950/60 border-b border-emerald-600/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                  Email Dispatched
                </span>
                <span className="text-xs text-zinc-400">Just now</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Official Welcome Note from ZARU Enterprise
              </h3>
            </div>
          </div>
          <button
            onClick={closeWelcomeEmailModal}
            className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simulated Email Envelope Details */}
        <div className="px-5 py-3 bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-300 space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-400">From:</span>
            <span className="font-semibold text-emerald-400">{cmsConfig.companyEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">To:</span>
            <span className="font-semibold text-white">{welcomeEmailData.recipientEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Subject:</span>
            <span className="text-zinc-200">Welcome to ZARU Enterprise Co-Investment Portal</span>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-5 sm:p-6 text-sm text-zinc-300 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Dear {welcomeEmailData.recipientName},
          </div>

          <p className="leading-relaxed">
            Congratulations on successfully registering your agricultural investor account with <strong className="text-white">ZARU ENTERPRISE</strong>!
          </p>

          <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Next Steps to Activate Your 14-Day Cycle:
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-zinc-300">
              <li>Navigate to your Investor Dashboard.</li>
              <li>Select your preferred farm plan: <strong>Snail Plan (15% ROI)</strong>, <strong>Fish Plan (15% ROI)</strong>, or <strong>Poultry Plan (20% ROI)</strong>.</li>
              <li>Transfer the plan fee to our verified Moniepoint account: <strong>6394899106 (Zaru Enterprise Farm)</strong>.</li>
              <li>Upload your transfer receipt. Admin verifies and your dividend commitment bar begins immediately!</li>
            </ol>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            For real-time inquiries or farm inspection bookings, message our desk directly on WhatsApp at <strong className="text-emerald-400">{cmsConfig.whatsappNumber}</strong> or email <strong className="text-emerald-400">{cmsConfig.companyEmail}</strong>.
          </p>

          <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-500">
            ZARU ENTERPRISE • Agricultural Financing & Farm Management • Nigeria
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            A copy has been recorded to your account notifications.
          </span>
          <button
            onClick={closeWelcomeEmailModal}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#00A86B] hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
          >
            Proceed to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
