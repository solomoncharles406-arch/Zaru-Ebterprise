import React from 'react';
import { useApp } from '../context/AppContext';
import { PlanType } from '../types';

interface PlansSectionProps {
  onSelectPlan: (planId: PlanType) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({ onSelectPlan }) => {
  const { plans, cmsConfig } = useApp();

  return (
    <section id="packages" className="py-20 lg:py-24 bg-[#000000] border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching video */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Plan Packages
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal">
            Choose a plan that fits your financial goals. All plans are backed by physical agricultural assets.
          </p>
        </div>

        {/* 3 Plan Cards Grid matching video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => {
            const displayImage = cmsConfig.planImages[plan.id] || plan.image;

            return (
              <div
                key={plan.id}
                className="rounded-2xl bg-[#09090b] border border-zinc-800/90 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 shadow-xl"
              >
                {/* Image with 14 Days Badge on Top Right */}
                <div className="relative w-full h-52 bg-zinc-900 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={plan.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Badge matching video */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white text-black font-extrabold text-[11px] tracking-wide shadow-md">
                    14 Days
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white tracking-wide">
                      {plan.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal min-h-[40px]">
                      {plan.description}
                    </p>

                    {/* Stats Box matching video: MIN. CAPITAL & FIXED ROI */}
                    <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-2 mt-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                          MIN. CAPITAL
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          ₦{plan.minAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-900">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                          FIXED ROI
                        </span>
                        <span className="font-mono font-bold text-[#00A86B] text-sm">
                          {plan.roiPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Button matching video */}
                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className="w-full py-3 rounded-xl bg-[#0e1713] hover:bg-[#00A86B] text-[#00A86B] hover:text-white border border-[#00A86B]/40 hover:border-[#00A86B] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center"
                  >
                    {plan.buttonText}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
