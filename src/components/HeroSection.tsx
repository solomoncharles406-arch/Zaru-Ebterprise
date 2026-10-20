import React from 'react';
import { ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { ASSET_IMAGES } from '../data/constants';
import { useApp } from '../context/AppContext';

interface HeroSectionProps {
  onBuyPlanClick: () => void;
  onLearnMoreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBuyPlanClick, onLearnMoreClick }) => {
  const { cmsConfig } = useApp();

  return (
    <section id="home" className="relative bg-[#000000] overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20">
      {/* Deep red gradient background matching video clip */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-90"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 20% 40%, rgba(165, 14, 14, 0.75) 0%, rgba(90, 8, 8, 0.45) 55%, rgba(0, 0, 0, 0.95) 100%)'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subtitle, Buttons, Trust Badges */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Badge matching video */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-red-500/30 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              SECURE AGRICULTURAL PLANS IN NIGERIA
            </div>

            {/* Main Headline matching video typography or CMS customized */}
            {cmsConfig.heroHeadline && cmsConfig.heroHeadline !== 'Grow Your Wealth With Nature.' ? (
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                {cmsConfig.heroHeadline}
              </h1>
            ) : (
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
                Grow Your <br />
                Wealth With <br />
                <span className="text-[#00A86B]">Nature.</span>
              </h1>
            )}

            {/* Subtitle text matching video / CMS */}
            <p className="text-base sm:text-lg text-zinc-200/90 max-w-xl font-normal leading-relaxed">
              {cmsConfig.heroSubheadline || 'ZARU ENTERPRISE offers high-yield, secure, and transparent agricultural plan opportunities designed for the modern Nigerian investor.'}
            </p>

            {/* Dual Buttons matching video */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onBuyPlanClick}
                className="px-7 py-3.5 rounded-lg bg-[#00A86B] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                PICK A PLANE
              </button>

              <button
                onClick={onLearnMoreClick}
                className="px-7 py-3.5 rounded-lg bg-black/50 hover:bg-black/80 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-zinc-700/80 hover:border-zinc-500 transition-all cursor-pointer backdrop-blur-sm"
              >
                VIEW PACKAGES
              </button>
            </div>

            {/* Trust Badges matching video row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>High ROI</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>10k+ Investors</span>
              </div>
            </div>

          </div>

          {/* Right Column: Black and White Farm Seedlings Image matching video */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 group">
              <img
                src={cmsConfig.heroImage || ASSET_IMAGES.seedlings}
                alt="Agricultural Farm Seedlings"
                className="w-full h-[320px] sm:h-[400px] object-cover contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
