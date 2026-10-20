import React from 'react';

export const VisionSection: React.FC = () => {
  return (
    <section id="vision" className="py-20 lg:py-24 bg-[#000000] border-t border-zinc-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Centered red leaf icon matching video */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-950/40 border border-red-600/40 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/50">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-red-500 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Our Vision
        </h2>

        {/* Vision Quote Statement matching video text */}
        <p className="text-base sm:text-xl text-zinc-300 leading-relaxed font-normal max-w-3xl mx-auto italic">
          &ldquo;We believe in the power of agriculture to transform lives and communities. By connecting capital to carefully managed farming operations, we ensure food security while providing our users with consistent, reliable returns. Our expert team handles everything from cultivation to market sales.&rdquo;
        </p>

      </div>
    </section>
  );
};
