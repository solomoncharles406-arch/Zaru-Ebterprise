import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { cmsConfig } = useApp();

  const cleanWhatsapp = cmsConfig.whatsappNumber.replace(/\D/g, '');
  const internationalWhatsapp = cleanWhatsapp.startsWith('0')
    ? '234' + cleanWhatsapp.slice(1)
    : cleanWhatsapp;

  return (
    <a
      href={`https://wa.me/${internationalWhatsapp}?text=${encodeURIComponent(
        'Hello ZARU Enterprise, I want to inquire about purchasing an Agricultural Plan.'
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#00A86B] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-950/80 transition-all hover:scale-105 active:scale-95 group"
    >
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
        <MessageSquare className="w-3.5 h-3.5 fill-current" />
      </div>
      <span>WhatsApp Us</span>
    </a>
  );
};
