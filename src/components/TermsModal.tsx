import React from 'react';
import { X, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TERMS_AND_CONDITIONS_TEXT } from '../data/constants';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/90 modal-backdrop-blur">
      <div 
        className="relative w-full max-w-3xl bg-zinc-950 border border-red-600/60 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                TERMS AND CONDITIONS FOR ZARU ENTERPRISE
              </h2>
              <p className="text-xs text-zinc-400">
                Official Co-Investment & Peer-Assisted Agro Terms (Updated 2026)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
            aria-label="Close Terms"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body - Guaranteed never blank */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm text-zinc-300 leading-relaxed max-h-[calc(90vh-140px)] select-text">
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div>
              <span className="font-semibold">Notice for Nigerian Investors:</span> Minimum investment is ₦30,000. Maximum is ₦20,000,000 per slot. Please read our 14-day cycle and 2-time dividend withdrawal policies before buying any plan.
            </div>
          </div>

          <div className="whitespace-pre-line font-sans text-xs sm:text-sm text-zinc-300 space-y-3">
            {TERMS_AND_CONDITIONS_TEXT}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/90">
          <span className="text-xs text-zinc-400 hidden sm:inline">
            ZARU ENTERPRISE • Moniepoint Protected Escrow
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Close
            </button>
            {onAgree && (
              <button
                type="button"
                onClick={() => {
                  onAgree();
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#00A86B] hover:bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                I Agree & Accept Terms
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
