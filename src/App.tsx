import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { HospitalDashboard } from './components/hospital/HospitalDashboard';
import { EngineerDashboard } from './components/engineer/EngineerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { SafetyNoticeModal } from './components/common/SafetyNoticeModal';
import { AuthModal } from './components/auth/AuthModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { UserRole } from './types';
import { ShieldAlert, Heart, Building2, Wrench, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRole, switchDemoRole } = useApp();

  // Navigation state
  const [activeNavTab, setActiveNavTab] = useState<string>('assets');
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'hospital_reg' | 'engineer_reg' | 'sign_in'>('sign_in');

  const handleOpenAuth = (tab: 'hospital_reg' | 'engineer_reg' | 'sign_in' = 'sign_in') => {
    setAuthModalInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleEnterRole = (role: UserRole) => {
    switchDemoRole(role);
    if (role === 'hospital_user') setActiveNavTab('assets');
    if (role === 'engineer') setActiveNavTab('work_orders');
    if (role === 'admin') setActiveNavTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Navbar with role switcher, PWA installer, and navigation */}
      <Navbar
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeNavTab === 'landing' ? (
          <LandingPage
            onOpenAuthModal={handleOpenAuth}
            onOpenSafetyModal={() => setSafetyModalOpen(true)}
            onEnterRole={handleEnterRole}
          />
        ) : (
          <>
            {currentRole === 'hospital_user' && (
              <HospitalDashboard
                activeTab={activeNavTab}
                setActiveTab={setActiveNavTab}
                onOpenSafetyModal={() => setSafetyModalOpen(true)}
              />
            )}

            {currentRole === 'engineer' && (
              <EngineerDashboard
                activeTab={activeNavTab}
                setActiveTab={setActiveNavTab}
                onOpenSafetyModal={() => setSafetyModalOpen(true)}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                activeTab={activeNavTab}
                setActiveTab={setActiveNavTab}
                onOpenSafetyModal={() => setSafetyModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white text-xs">
                O₂
              </div>
              <div>
                <span className="font-bold text-slate-200">OxygenCare Malawi</span>
                <span className="mx-2 text-slate-600">|</span>
                <span>D-Prize Challenge Biomedical Maintenance Platform</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <button
                onClick={() => setSafetyModalOpen(true)}
                className="hover:text-rose-300 transition cursor-pointer flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Clinical Safety Notice</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveNavTab('landing')}
                className="hover:text-white transition cursor-pointer"
              >
                Pilot Overview
              </button>
              <span>•</span>
              <button
                onClick={() => handleOpenAuth('sign_in')}
                className="hover:text-white transition cursor-pointer"
              >
                Switch Account
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              Aligned with Ministry of Health Malawi Physical Asset Management (PAM) Guidelines & WHO Technical Specifications for Oxygen Concentrators.
            </p>
            <p className="flex items-center gap-1">
              <span>Engineered for Malawian Hospitals</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Floating Indicators */}
      <SafetyNoticeModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalInitialTab}
      />

      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
