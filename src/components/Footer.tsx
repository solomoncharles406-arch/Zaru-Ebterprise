import React from 'react';
import { ASSET_IMAGES } from '../data/constants';

interface FooterProps {
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms }) => {
  return (
    <footer className="bg-[#000000] text-zinc-400 text-xs border-t border-zinc-900 pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Centered Realistic Logo Emblem + ZARU ENTERPRISE */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500/50 shadow-lg shadow-emerald-950/40 bg-black">
            <img
              src={ASSET_IMAGES.logo}
              alt="ZARU Enterprise Logo Emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-base tracking-widest text-white uppercase block leading-none">
              ZARU ENTERPRISE
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mt-0.5">
              Agricultural Farm Nigeria
            </span>
          </div>
        </div>

        {/* Disclaimer Paragraph matching video exactly */}
        <p className="text-[11px] sm:text-xs text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          Disclaimer: All plans involve risk, including the possible loss of principal. Past performance of agricultural cycles does not guarantee future returns. ZARU ENTERPRISE is registered under the Corporate Affairs Commission of Nigeria. By using this platform, you agree to our{' '}
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-zinc-400 hover:text-white underline cursor-pointer"
          >
            Terms of Service
          </button>{' '}
          and Privacy Policy.
        </p>

        {/* Copyright matching video */}
        <div className="text-[11px] text-zinc-600 font-medium pt-2">
          © 2026 ZARU ENTERPRISE. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
