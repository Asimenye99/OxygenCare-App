import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  ShieldAlert,
  RotateCcw,
  Building2,
  Wrench,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  FileText,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenSafetyModal: () => void;
  onOpenAuthModal: (tab?: 'hospital_reg' | 'engineer_reg' | 'sign_in') => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSafetyModal,
  onOpenAuthModal,
  activeNavTab,
  setActiveNavTab,
}) => {
  const {
    currentUser,
    currentRole,
    currentHospital,
    currentEngineer,
    switchDemoRole,
    resetToDemoData,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'hospital_user':
        return {
          label: 'Hospital PAM',
          name: currentHospital ? currentHospital.name : currentUser?.name,
          icon: Building2,
          color: 'bg-teal-700 text-teal-100 border-teal-500',
        };
      case 'engineer':
        return {
          label: 'Biomedical Engineer',
          name: currentEngineer ? currentEngineer.name : currentUser?.name,
          icon: Wrench,
          color: 'bg-sky-800 text-sky-100 border-sky-600',
        };
      case 'admin':
      default:
        return {
          label: 'National QA Admin',
          name: currentUser?.name || 'Admin',
          icon: ShieldCheck,
          color: 'bg-indigo-900 text-indigo-100 border-indigo-700',
        };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  const handleRoleSelect = (role: 'hospital_user' | 'engineer' | 'admin') => {
    switchDemoRole(role);
    setRoleMenuOpen(false);
    // Reset to default tab for new role
    if (role === 'hospital_user') setActiveNavTab('assets');
    if (role === 'engineer') setActiveNavTab('work_orders');
    if (role === 'admin') setActiveNavTab('overview');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-lg text-white">
      {/* Top Banner Notice: D-Prize Challenge / MoH Malawi */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 px-4 py-1.5 text-[11px] sm:text-xs text-teal-200 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 truncate">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">OxygenCare Malawi</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">D-Prize Challenge Pilot for Reliable Healthcare Oxygen</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1 text-rose-300 hover:text-white transition font-medium cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Clinical Safety Protocol</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => {
              if (confirm('Reset all demo hospitals, concentrators, and work orders to clean initial state?')) {
                resetToDemoData();
              }
            }}
            className="flex items-center gap-1 text-slate-300 hover:text-teal-300 transition cursor-pointer"
            title="Reset to fresh D-Prize demo database"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveNavTab('overview')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white shadow-md group-hover:scale-105 transition">
                O₂
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-white">OxygenCare</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-sm bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    MW
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-none">Biomedical Maintenance Network</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links based on active role */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {currentRole === 'hospital_user' && (
              <>
                <button
                  onClick={() => setActiveNavTab('assets')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'assets'
                      ? 'bg-teal-600/30 text-teal-300 font-semibold border border-teal-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Asset Register
                </button>
                <button
                  onClick={() => setActiveNavTab('request_new')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'request_new'
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'bg-teal-600/20 text-teal-300 hover:bg-teal-600/30 border border-teal-500/40'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Request Maintenance
                </button>
                <button
                  onClick={() => setActiveNavTab('work_orders')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'work_orders'
                      ? 'bg-teal-600/30 text-teal-300 font-semibold border border-teal-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Work Orders & Reports
                </button>
                <button
                  onClick={() => setActiveNavTab('pam_contacts')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'pam_contacts'
                      ? 'bg-teal-600/30 text-teal-300 font-semibold border border-teal-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Facility PAM Team
                </button>
              </>
            )}

            {currentRole === 'engineer' && (
              <>
                <button
                  onClick={() => setActiveNavTab('work_orders')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'work_orders'
                      ? 'bg-sky-600/30 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  My Work Orders
                </button>
                <button
                  onClick={() => setActiveNavTab('available_jobs')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'available_jobs'
                      ? 'bg-sky-600/30 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Available Dispatch
                </button>
                <button
                  onClick={() => setActiveNavTab('service_reports')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'service_reports'
                      ? 'bg-sky-600/30 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Service Reports
                </button>
                <button
                  onClick={() => setActiveNavTab('profile')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'profile'
                      ? 'bg-sky-600/30 text-sky-300 font-semibold border border-sky-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Credentials & Earnings
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveNavTab('overview')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'overview'
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  D-Prize KPIs
                </button>
                <button
                  onClick={() => setActiveNavTab('verification')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'verification'
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verification Queue
                </button>
                <button
                  onClick={() => setActiveNavTab('work_orders_board')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'work_orders_board'
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Work Order Dispatch
                </button>
                <button
                  onClick={() => setActiveNavTab('qa_reports')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'qa_reports'
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Technical QA Review
                </button>
                <button
                  onClick={() => setActiveNavTab('national_assets')}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeNavTab === 'national_assets'
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  National Registry
                </button>
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Role Switcher Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition shadow-xs ${badge.color}`}
              >
                <BadgeIcon className="w-4 h-4 shrink-0" />
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-[11px] leading-tight opacity-90">{badge.label}</div>
                  <div className="text-[12px] font-bold truncate max-w-[130px]">{badge.name}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Switch Active Role
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Test distinct permissions & views</p>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => handleRoleSelect('hospital_user')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition ${
                        currentRole === 'hospital_user' ? 'bg-teal-50 text-teal-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <div className="font-bold">1. Hospital / Facility</div>
                        <div className="text-[11px] text-slate-500">Kamuzu Central (Asset Register)</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleSelect('engineer')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition ${
                        currentRole === 'engineer' ? 'bg-sky-50 text-sky-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Wrench className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <div className="font-bold">2. Biomedical Engineer</div>
                        <div className="text-[11px] text-slate-500">Kondwani Phiri (Service Reports)</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition ${
                        currentRole === 'admin' ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <div className="font-bold">3. Admin Dashboard</div>
                        <div className="text-[11px] text-slate-500">Dr. Chisomo Mwale (Verification & QA)</div>
                      </div>
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onOpenAuthModal('sign_in');
                      }}
                      className="text-xs text-teal-600 hover:text-teal-800 font-medium cursor-pointer p-1"
                    >
                      + Register New User
                    </button>
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        setActiveNavTab('landing');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 p-1"
                    >
                      View Landing Page
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1">
            {badge.label} Navigation
          </div>

          {currentRole === 'hospital_user' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveNavTab('assets');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'assets' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                Asset Register
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('request_new');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'request_new' ? 'bg-teal-600 text-white font-bold' : 'bg-teal-900/60 text-teal-200'}`}
              >
                + Request Service
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('work_orders');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'work_orders' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                Work Orders
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('pam_contacts');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'pam_contacts' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                PAM Team
              </button>
            </div>
          )}

          {currentRole === 'engineer' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveNavTab('work_orders');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'work_orders' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                My Work Orders
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('available_jobs');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'available_jobs' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                Available Dispatch
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('service_reports');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'service_reports' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                Service Reports
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('profile');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'profile' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                Credentials & Earnings
              </button>
            </div>
          )}

          {currentRole === 'admin' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveNavTab('overview');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                D-Prize KPIs
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('verification');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'verification' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                Verification Queue
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('work_orders_board');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'work_orders_board' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                Dispatch Board
              </button>
              <button
                onClick={() => {
                  setActiveNavTab('qa_reports');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${activeNavTab === 'qa_reports' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-700 text-slate-200'}`}
              >
                Technical QA
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
