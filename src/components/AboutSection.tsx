import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-24 bg-[#000000] border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Who is ZARU? */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Who is <span className="text-white">ZARU</span><span className="text-red-500">?</span>
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              <p>
                ZARU ENTERPRISE is a premier agricultural planning firm operating at the heart of Nigeria&apos;s agrarian economy. We bridge the gap between everyday investors and high-scale farming operations.
              </p>
              <p>
                By investing with us, you are funding real, on-ground farming cycles. We handle the land acquisition, labor, risk management, and sales. You simply provide the capital and watch your returns grow.
              </p>
            </div>
          </div>

          {/* Right Column: 2x2 Metric Cards matching video */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              
              {/* Card 1: 100% INSURED FARMS */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors">
                <span className="text-3xl sm:text-4xl font-black text-[#00A86B] font-mono">
                  100%
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-zinc-400 uppercase mt-2">
                  INSURED FARMS
                </span>
              </div>

              {/* Card 2: 24/7 MONITORING */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors">
                <span className="text-3xl sm:text-4xl font-black text-[#00A86B] font-mono">
                  24/7
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-zinc-400 uppercase mt-2">
                  MONITORING
                </span>
              </div>

              {/* Card 3: Zero HIDDEN FEES */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors">
                <span className="text-3xl sm:text-4xl font-black text-[#00A86B]">
                  Zero
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-zinc-400 uppercase mt-2">
                  HIDDEN FEES
                </span>
              </div>

              {/* Card 4: Fast PAYOUTS */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors">
                <span className="text-3xl sm:text-4xl font-black text-[#00A86B]">
                  Fast
                </span>
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-zinc-400 uppercase mt-2">
                  PAYOUTS
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
