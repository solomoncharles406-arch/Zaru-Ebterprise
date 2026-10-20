import React, { useState } from 'react';
import {
  Menu,
  X,
  ShieldAlert,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ASSET_IMAGES } from '../data/constants';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenAdminLogin: () => void;
  onOpenUserDashboard: () => void;
  onOpenAdminDashboard: () => void;
  activeView: 'landing' | 'user_dashboard' | 'admin_dashboard';
  setActiveView: (view: 'landing' | 'user_dashboard' | 'admin_dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenAdminLogin,
  onOpenUserDashboard,
  onOpenAdminDashboard,
  activeView,
  setActiveView
}) => {
  const { currentUser, logoutUser, isAdminLoggedIn, adminLogout, cmsConfig } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavScroll = (sectionId: string) => {
    setActiveView('landing');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black border-b border-zinc-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Realistic Logo Emblem: Metallic Bronze & Emerald Emblem + ZARU Typography */}
          <div
            onClick={() => {
              setActiveView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/60 group-hover:scale-105 group-hover:border-emerald-400 transition-all bg-black shrink-0">
              <img
                src={cmsConfig?.logoImage || ASSET_IMAGES.logo}
                alt="ZARU Enterprise Agricultural Farm Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tight text-white flex items-center leading-none">
                ZARU<span className="text-[#00A86B]">.</span>
              </span>
              <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest leading-tight mt-0.5">
                Enterprise Farm
              </span>
            </div>
          </div>

          {/* Center Navigation Links: HOME, ABOUT, VISION, PACKAGES, CONTACT */}
          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-semibold tracking-wider text-zinc-300">
            <button
              onClick={() => handleNavScroll('home')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              HOME
            </button>
            <button
              onClick={() => handleNavScroll('about')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              ABOUT
            </button>
            <button
              onClick={() => handleNavScroll('vision')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              VISION
            </button>
            <button
              onClick={() => handleNavScroll('packages')}
              className="hover:text-white transition-colors cursor-pointer uppercase"
            >
              PACKAGES
            </button>
          </nav>

          {/* Right Actions: LOGIN, BUY A PLAN, and ADMIN Login Button */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenUserDashboard}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'user_dashboard'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-950/50'
                      : 'bg-zinc-900 text-white border-zinc-700 hover:border-emerald-500 hover:text-emerald-400'
                  }`}
                  title="Open Your Investor Dashboard"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DASHBOARD</span>
                  <span className="text-zinc-500 font-normal">({currentUser.fullName.split(' ')[0]})</span>
                </button>
                <button
                  onClick={logoutUser}
                  title="Log out"
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:text-emerald-400 transition-colors cursor-pointer"
              >
                LOGIN
              </button>
            )}

            {/* BUY A PLAN Button (solid green) */}
            <button
              onClick={() => {
                if (currentUser) {
                  onOpenUserDashboard();
                } else {
                  handleNavScroll('packages');
                }
              }}
              className="px-5 py-2.5 rounded-lg bg-[#00A86B] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              BUY A PLAN
            </button>

            {/* ADMIN Login Button (kept right where it is per user requirement) */}
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdminDashboard}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  activeView === 'admin_dashboard'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950'
                    : 'bg-red-950/70 text-red-200 border-red-700/80 hover:bg-red-900'
                }`}
                title="Executive Admin Desk"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                ADMIN
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-red-950/70 text-zinc-300 hover:text-red-300 border border-zinc-800 hover:border-red-600/70 text-xs font-bold transition-all cursor-pointer"
                title="Admin Login"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                ADMIN
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => {
                if (currentUser) onOpenUserDashboard();
                else handleNavScroll('packages');
              }}
              className="px-3 py-1.5 bg-[#00A86B] text-white font-bold text-xs rounded-lg uppercase"
            >
              BUY A PLAN
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-5 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-zinc-800">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUserDashboard();
                }}
                className="py-2.5 bg-zinc-900 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-500/40"
              >
                DASHBOARD
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="py-2.5 bg-zinc-900 text-white font-bold text-xs rounded-lg border border-zinc-700"
              >
                LOGIN
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn) onOpenAdminDashboard();
                else onOpenAdminLogin();
              }}
              className="py-2.5 bg-red-950 text-red-300 font-bold text-xs rounded-lg border border-red-600 text-center"
            >
              ADMIN
            </button>
          </div>

          <div className="space-y-1 text-sm font-semibold tracking-wide">
            <button
              onClick={() => handleNavScroll('home')}
              className="w-full text-left py-2 px-3 rounded text-zinc-300 hover:bg-zinc-900 uppercase"
            >
              HOME
            </button>
            <button
              onClick={() => handleNavScroll('about')}
              className="w-full text-left py-2 px-3 rounded text-zinc-300 hover:bg-zinc-900 uppercase"
            >
              ABOUT
            </button>
            <button
              onClick={() => handleNavScroll('vision')}
              className="w-full text-left py-2 px-3 rounded text-zinc-300 hover:bg-zinc-900 uppercase"
            >
              VISION
            </button>
            <button
              onClick={() => handleNavScroll('packages')}
              className="w-full text-left py-2 px-3 rounded text-zinc-300 hover:bg-zinc-900 uppercase"
            >
              PACKAGES
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
