import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactSection: React.FC = () => {
  const { cmsConfig, sendUserMessage, currentUser } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const senderId = currentUser ? currentUser.id : `guest-${Date.now()}`;
    const fullText = `[Inquiry from ${fullName} | ${email}]: ${message}`;
    sendUserMessage(senderId, fullText);

    const mailtoUrl = `mailto:${cmsConfig.companyEmail}?subject=${encodeURIComponent(
      `ZARU Investor Inquiry - ${fullName}`
    )}&body=${encodeURIComponent(`Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessStatus(true);
      setFullName('');
      setEmail('');
      setMessage('');

      try {
        window.location.href = mailtoUrl;
      } catch (err) {
        // handled
      }
    }, 600);
  };

  const cleanWhatsapp = cmsConfig.whatsappNumber.replace(/\D/g, '');
  const internationalWhatsapp = cleanWhatsapp.startsWith('0')
    ? '234' + cleanWhatsapp.slice(1)
    : cleanWhatsapp;

  return (
    <section id="contact" className="py-20 lg:py-24 bg-[#000000] border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Get in Touch matching video */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Get in Touch
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-normal">
                Have questions about our plan packages? Our support team is available 24/7 to assist you.
              </p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp & Call Card matching video */}
              <a
                href={`https://wa.me/${internationalWhatsapp}?text=${encodeURIComponent(
                  'Hello ZARU Enterprise, I want to inquire about purchasing an Agricultural Plan.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#09090b] border border-zinc-800/80 hover:border-zinc-700 transition-all block group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                    WhatsApp & Call
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {cmsConfig.whatsappNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Chat on WhatsApp
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    +234 913 137 6638 (Direct Line)
                  </p>
                </div>
              </a>

              {/* Email Card matching video */}
              <a
                href={`mailto:${cmsConfig.companyEmail}`}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#09090b] border border-zinc-800/80 hover:border-zinc-700 transition-all block group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                    Email
                  </span>
                  <span className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors break-all block">
                    {cmsConfig.companyEmail}
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Send a Message Form matching video */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#09090b] border border-zinc-800/80 space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Send a Message
              </h3>

              {successStatus && (
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Your message has been sent to {cmsConfig.companyEmail}! We will respond shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder=""
                    className="w-full px-4 py-3 bg-[#030303] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full px-4 py-3 bg-[#030303] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder=""
                    className="w-full p-4 bg-[#030303] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
                  ></textarea>
                </div>

                {/* Solid White Button with Black Text matching video at 00:31 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer shadow-lg mt-2"
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
