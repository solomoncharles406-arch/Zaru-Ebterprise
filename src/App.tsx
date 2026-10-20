import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { InvestorTicker } from './components/InvestorTicker';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { VisionSection } from './components/VisionSection';
import { PlansSection } from './components/PlansSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { TermsModal } from './components/TermsModal';
import { AuthModals } from './components/AuthModals';
import { AdminLoginModal } from './components/AdminLoginModal';
import { WelcomeEmailModal } from './components/WelcomeEmailModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { PlanType } from './types';

const MainApp: React.FC = () => {
  const {
    currentUser,
    isAdminLoggedIn,
    activeTermsModal,
    openTermsModal,
    closeTermsModal,
    activeView,
    setActiveView
  } = useApp();

  // Modals state
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password' | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Check if current route is /reset-password or URL has Supabase recovery access_token
  const [isResetPasswordRoute, setIsResetPasswordRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      return path.includes('reset-password') || hash.includes('type=recovery') || (hash.includes('access_token') && !hash.includes('provider_token'));
    }
    return false;
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setIsResetPasswordRoute(path.includes('reset-password') || hash.includes('type=recovery') || (hash.includes('access_token') && !hash.includes('provider_token')));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Auto-detect ?auth=login or referral link on mount
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'login') {
      setAuthMode('login');
    } else if (params.has('ref') && !currentUser) {
      setAuthMode('register');
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [currentUser]);

  // Triggered when user clicks "BUY [X] PLAN" from landing
  const handleSelectPlan = (planId: PlanType) => {
    if (currentUser) {
      setActiveView('user_dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAuthMode('register');
    }
  };

  const handleOpenUserDashboard = () => {
    setActiveView('user_dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminDashboard = () => {
    if (isAdminLoggedIn) {
      setActiveView('admin_dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-red-600 selection:text-white">
      {/* ---------------- SUPABASE PASSWORD RECOVERY PAGE ---------------- */}
      {isResetPasswordRoute ? (
        <ResetPasswordPage
          onNavigateHome={() => {
            window.history.pushState({}, '', '/');
            setIsResetPasswordRoute(false);
            setActiveView('landing');
          }}
          onOpenLoginModal={() => {
            window.history.pushState({}, '', '/');
            setIsResetPasswordRoute(false);
            setAuthMode('login');
          }}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <Navbar
            onOpenAuth={(mode) => setAuthMode(mode)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            onOpenUserDashboard={handleOpenUserDashboard}
            onOpenAdminDashboard={handleOpenAdminDashboard}
            activeView={activeView}
            setActiveView={setActiveView}
          />

          {/* Main Body Switcher */}
          <main className="flex-1">
            {activeView === 'landing' && (
              <>
                <HeroSection
                  onBuyPlanClick={() => {
                    if (currentUser) {
                      setActiveView('user_dashboard');
                    } else {
                      const packagesElem = document.getElementById('packages');
                      packagesElem?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  onLearnMoreClick={() => {
                    const packagesElem = document.getElementById('packages');
                    packagesElem?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* Live Horizontal Investor Ticker (Right to Left) matching video below Hero */}
                <InvestorTicker />

                {/* Who is ZARU? */}
                <AboutSection />

                {/* Our Vision */}
                <VisionSection />

                {/* Plan Packages */}
                <PlansSection onSelectPlan={handleSelectPlan} />
              </>
            )}

            {activeView === 'user_dashboard' && <UserDashboard />}

            {activeView === 'admin_dashboard' && <AdminDashboard />}
          </main>

          {/* Footer matching video */}
          <Footer onOpenTerms={openTermsModal} />

          {/* Floating WhatsApp Us button at bottom right throughout the site */}
          <FloatingWhatsApp />
        </>
      )}

      {/* Global Modals */}
      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={activeTermsModal}
        onClose={closeTermsModal}
        onAgree={closeTermsModal}
      />

      {/* Auth Modals (Register, Login, Forgot Password) */}
      <AuthModals
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitchMode={(mode) => setAuthMode(mode)}
        onOpenTerms={openTermsModal}
        onLoginSuccess={() => {
          setActiveView('user_dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Admin Login Modal (Username: Zagaru2026@, Password: Zazarusap2026@$) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setActiveView('admin_dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Welcome Email Dispatch Modal Preview */}
      <WelcomeEmailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
