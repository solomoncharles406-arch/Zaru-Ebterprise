import React from 'react';
import { DollarSign } from 'lucide-react';

const RECENT_INVESTMENTS = [
  {
    name: 'Chukwudi E.',
    amount: '₦500,000',
    plan: 'Poultry Investment',
    time: '15 mins ago',
  },
  {
    name: 'Grace B.',
    amount: '₦150,000',
    plan: 'Snail Investment',
    time: '22 mins ago',
  },
  {
    name: 'Ibrahim M.',
    amount: '₦300,000',
    plan: 'Fish Investment',
    time: '28 mins ago',
  },
  {
    name: 'Ngozi U.',
    amount: '₦1,000,000',
    plan: 'Poultry Investment',
    time: '34 mins ago',
  },
  {
    name: 'Adekunle S.',
    amount: '₦200,000',
    plan: 'Fish Investment',
    time: '41 mins ago',
  },
  {
    name: 'Fatima Z.',
    amount: '₦90,000',
    plan: 'Snail Investment',
    time: '49 mins ago',
  },
];

export const InvestorTicker: React.FC = () => {
  // Duplicate for smooth seamless loop
  const duplicated = [...RECENT_INVESTMENTS, ...RECENT_INVESTMENTS, ...RECENT_INVESTMENTS];

  return (
    <div className="relative w-full bg-[#050505] border-y border-zinc-900 overflow-hidden py-3 text-xs">
      <div className="flex overflow-hidden select-none whitespace-nowrap">
        <div className="animate-ticker flex items-center gap-6 sm:gap-10">
          {duplicated.map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-950/80 border border-zinc-900/90 hover:border-zinc-800 transition-colors shrink-0"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-zinc-300">{item.name}</span>
                <span className="text-zinc-500">just invested</span>
                <span className="font-bold text-[#00A86B] font-mono">{item.amount}</span>
                <span className="text-zinc-400">in {item.plan}</span>
                <span className="text-[10px] text-zinc-600 pl-1">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
